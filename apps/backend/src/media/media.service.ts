import { Injectable } from '@nestjs/common';
import { Storage, TransferManager } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { TranscodeService } from '../transcode/transcode.service';
import * as fs from 'fs/promises';
import { Prisma, Video } from '@prisma/client';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { ImageService } from 'src/image/image.service';
import { resolveUploadPath } from 'src/common/fs-utils';
import * as path from 'path';
import { DbFileService } from 'src/db-file/db-file.service';
import { IWithPermissions, TActionType } from 'src/common/IWithPermissions';
import { UserService } from 'src/user/user.service';
import { JobsService } from 'src/jobs/jobs.service';
import { PatchMedia } from './media.dto';

const storage = new Storage();
const bucketName = process.env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME!;
const transferManager = new TransferManager(storage.bucket(bucketName));
const rootOutputFolder = 'tmp/transcoded/';

export type TTempFile = {
  originalname: string;
  path: string;
};

@Injectable()
export class MediaService implements IWithPermissions {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transcodeService: TranscodeService,
    private readonly socketsGateway: SocketsGateway,
    private readonly imageService: ImageService,
    private readonly dbFileService: DbFileService,
    private readonly userService: UserService,
    private readonly jobsService: JobsService,
  ) {}

  async getPermissionsForUser(
    id: string,
    userId: string | undefined,
  ): Promise<readonly TActionType[]> {
    if (userId && (await this.userService.isAdmin(userId))) {
      return ['READ', 'WRITE', 'DELETE'];
    }
    const video = await this.prisma.video.findFirstOrThrow({
      where: { id },
    });
    if (video.authorId === userId) {
      return ['READ', 'WRITE', 'DELETE'];
    }

    if (video.visibility === 'PUBLIC' && video.status === 'READY') {
      return ['READ'];
    }

    return [];
  }

  async assertPermissionsForUser(
    objectId: string,
    userId: string | undefined,
    action: TActionType,
  ): Promise<void> {
    const permissions = await this.getPermissionsForUser(objectId, userId);
    if (!permissions.includes(action)) {
      throw new Error('Permission denied');
    }
  }

  async getMediaById(id: string, userId: string | undefined) {
    return this.prisma.video.findUniqueOrThrow({
      where: { id },
      include: {
        master: true,
        author: {
          select: {
            id: true,
            nickname: true,
            subscribersCount: true,
            picture: {
              include: {
                small: true,
              },
            },
          },
        },
        rates: {
          where: {
            userId: userId ?? 'NO_USER',
          },
        },
      },
    });
  }

  async upload(
    file: TTempFile,
    authorId: string,
    params: {
      observers: string[];
    },
  ) {
    const video = await this.prisma.video.create({
      data: {
        author: {
          connect: { id: authorId },
        },
        title: file.originalname,
        thumbnailSet: {
          create: {},
        },
        fileSet: {
          create: {},
        },
      },
    });

    return {
      job: await this.processVideo(file, video, params),
      video,
    };
  }

  async patch(id: string, data: PatchMedia.Body) {
    return this.prisma.video.update({
      where: { id },
      data: {
        description: data.description,
        title: data.title,
        visibility: data.visibility,
      },
    });
  }

  async getUserMedia(user: any) {
    return this.prisma.video.findMany({
      where: {
        AND: [
          { authorId: user.uid },
          {
            status: {
              not: 'DELETED',
            },
          },
        ],
      },
      include: {
        thumbnail: {
          include: {
            large: true,
            medium: true,
            small: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string) {
    const {
      fileSet: { files },
      thumbnailSet: { images },
    } = await this.prisma.video.findUniqueOrThrow({
      where: { id },
      include: {
        fileSet: {
          include: {
            files: true,
          },
        },
        thumbnailSet: {
          include: {
            images: {
              include: {
                large: true,
                medium: true,
                small: true,
                original: true,
              },
            },
          },
        },
      },
    });

    await Promise.all(files.map((file) => this.dbFileService.delete(file)));

    await Promise.all(
      images.map((image) => this.imageService.delete(image.id)),
    );

    this.prisma.imported.delete({
      where: { id },
    });

    return this.prisma.video.update({
      where: { id },
      data: {
        status: 'DELETED',
      },
    });
  }

  async rate(id: string, userId: string, type: 'LIKE' | 'DISLIKE' | null) {
    return this.prisma.$transaction(async (tx) => {
      const prevRating = await tx.rating.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId: id,
          },
        },
      });

      await tx.rating.upsert({
        where: {
          userId_videoId: {
            userId,
            videoId: id,
          },
        },
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          video: {
            connect: {
              id,
            },
          },
          type,
        },
        update: {
          type,
        },
      });

      let incrementLikes = 0;
      let incrementDislikes = 0;

      if (prevRating) {
        if (prevRating.type === 'LIKE') {
          if (type === 'LIKE') {
            incrementLikes = 0;
          } else if (type === 'DISLIKE') {
            incrementLikes -= 1;
            incrementDislikes += 1;
          } else {
            incrementLikes -= 1;
          }
        } else if (prevRating.type === 'DISLIKE') {
          if (type === 'DISLIKE') {
            incrementDislikes = 0;
          } else if (type === 'LIKE') {
            incrementDislikes -= 1;
            incrementLikes += 1;
          } else {
            incrementDislikes -= 1;
          }
        } else {
          if (type === 'LIKE') {
            incrementLikes += 1;
          } else if (type === 'DISLIKE') {
            incrementDislikes += 1;
          }
        }
      } else {
        if (type === 'LIKE') {
          incrementLikes += 1;
        } else if (type === 'DISLIKE') {
          incrementDislikes += 1;
        }
      }

      const { likesCount, dislikesCount } = await tx.video.update({
        where: { id },
        data: {
          likesCount: {
            increment: incrementLikes,
          },
          dislikesCount: {
            increment: incrementDislikes,
          },
        },
      });

      return { likesCount, dislikesCount, type };
    });
  }

  private async processVideo(
    file: TTempFile,
    video: Video,
    params: {
      observers: string[];
    },
  ) {
    const job = await this.jobsService.create(
      {
        name: 'Processing video',
        stage: 'transcoding',
        description: `We are currently processing ${file.originalname}`,
        type: 'process-video',
        payload: {
          videoId: video.id,
        },
      },
      {
        observers: params.observers,
      },
    );
    const filename = `${randomUUID()}_${file.originalname}`;
    const outputFolder = `${rootOutputFolder}${filename}/`;
    const tempFilePath = file.path;

    async function getManyFiles(folder: string, ending: string) {
      const allFiles = await fs.readdir(`${outputFolder}${folder}`);
      return allFiles
        .map((file) => `${outputFolder}${folder}/${file}`)
        .filter((file) => file.endsWith(ending));
    }

    const uploadManyFiles = async (files: string[], fileSetId: string) => {
      const responses = await transferManager.uploadManyFiles(files, {
        customDestinationBuilder(path) {
          const relPath = path.split(outputFolder).at(-1);
          return `transcoded/${filename}/${relPath}`;
        },
      });
      const dbFilesCreateManyInput: Prisma.FileCreateManyInput[] =
        responses.map(
          ([storageFile]) =>
            ({
              filename: path.basename(storageFile.name),
              path: storageFile.name,
              publicUrl: storageFile.publicUrl(),
              fileSetId,
            }) satisfies Prisma.FileCreateManyInput,
        );

      const dbFiles = await this.prisma.file.createManyAndReturn({
        data: dbFilesCreateManyInput,
      });

      return dbFiles;
    };

    setImmediate(async () => {
      try {
        const transcoded = await this.transcodeService.transcode(tempFilePath, {
          onProgress: (percent) => {
            job.progress(percent);
          },
          outputFolder,
          filename,
        });

        const videoVariantFiles = await getManyFiles(
          transcoded.videoFolder,
          '_variant.m3u8',
        );
        const videoPartsFiles = await getManyFiles(
          transcoded.videoFolder,
          '.ts',
        );
        const videoMasterFiles = await getManyFiles(
          transcoded.videoFolder,
          '_master.m3u8',
        );

        const thumbnailsFilenames = await Promise.all(
          (await getManyFiles(transcoded.thumbnailsFolder, '.png')).map(
            async (thumbnail) => {
              const thumbnailName = randomUUID() + path.extname(thumbnail);
              await fs.rename(thumbnail, resolveUploadPath(thumbnailName));
              return thumbnailName;
            },
          ),
        );

        // TODO upload later, after db operations are done
        job.stage('uploading files');
        await uploadManyFiles(videoVariantFiles, video.fileSetId);
        await uploadManyFiles(videoPartsFiles, video.fileSetId);
        const [uploadedMaster] = await uploadManyFiles(
          videoMasterFiles,
          video.fileSetId,
        );

        const dbThumbnails = await Promise.all(
          thumbnailsFilenames.map((thumbnailFilename) =>
            this.imageService.upload(thumbnailFilename, {
              ownerId: video.authorId,
              setId: video.thumbnailSetId,
            }),
          ),
        );

        await this.prisma.video.update({
          where: { id: video.id },
          data: {
            status: 'READY',
            master: {
              connect: {
                id: uploadedMaster.id,
              },
            },
            thumbnail: {
              connect: {
                id: dbThumbnails[0].id,
              },
            },
          },
        });

        job.done();
      } catch (error) {
        await this.prisma.video.update({
          where: { id: video.id },
          data: { status: 'ERROR' },
        });

        job.error(String(error));
      } finally {
        await fs.rm(rootOutputFolder, { recursive: true });
        await fs.rm(file.path);
      }
    });

    return job;
  }
}
