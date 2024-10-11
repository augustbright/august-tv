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

const storage = new Storage();
const bucketName = process.env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME!;
const transferManager = new TransferManager(storage.bucket(bucketName));
const rootOutputFolder = 'tmp/transcoded/';

@Injectable()
export class MediaService implements IWithPermissions {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transcodeService: TranscodeService,
    private readonly socketsGateway: SocketsGateway,
    private readonly imageService: ImageService,
    private readonly dbFileService: DbFileService,
    private readonly userService: UserService,
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

  async getMediaById(id: string) {
    return this.prisma.video.findUniqueOrThrow({
      where: { id },
      include: {
        master: true,
        author: {
          select: {
            id: true,
            nickname: true,
            picture: {
              include: {
                small: true,
              },
            },
          },
        },
      },
    });
  }

  async upload(file: Express.Multer.File, user: any) {
    const video = await this.prisma.video.create({
      data: {
        author: {
          connect: { id: user.uid },
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

    this.processVideo(file, video);
    return video;
  }

  async patch(id: string, data: any) {
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
      where: { authorId: user.uid },
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

    return this.prisma.video.delete({
      where: { id },
    });
  }

  private async processVideo(file: Express.Multer.File, video: Video) {
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

    try {
      const transcoded = await this.transcodeService.transcode(tempFilePath, {
        onProgress: (percent) => {
          this.socketsGateway.sendToUser(video.authorId, {
            type: 'upload-progress',
            video,
            percent,
          });
        },
        outputFolder,
        filename,
      });

      const videoVariantFiles = await getManyFiles(
        transcoded.videoFolder,
        '_variant.m3u8',
      );
      const videoPartsFiles = await getManyFiles(transcoded.videoFolder, '.ts');
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

      this.socketsGateway.sendToUser(video.authorId, {
        type: 'upload-finished',
        video,
      });
    } catch (error) {
      await this.prisma.video.update({
        where: { id: video.id },
        data: { status: 'ERROR' },
      });

      this.socketsGateway.sendToUser(video.authorId, {
        type: 'upload-error',
        video,
        error: String(error),
      });
    } finally {
      await fs.rm(rootOutputFolder, { recursive: true });
      await fs.rm(file.path);
    }
  }
}
