import { env } from '@august-tv/env';

import { Injectable, Logger } from '@nestjs/common';
import { File, Storage } from '@google-cloud/storage';
import * as fs from 'fs/promises';
import * as path from 'path';
import { JobsService, PrismaService } from '@august-tv/server/modules';
import { Video } from '@prisma/client';

export type TTempFile = {
  originalName: string;
  path: string;
};

type TCreateFileConfig = {
  filename: string;
  path: string;
  publicUrl: string;
};

type TStructuredFiles = {
  thumbnails: {
    small: TCreateFileConfig;
    medium: TCreateFileConfig;
    large: TCreateFileConfig;
    original: TCreateFileConfig;
  }[];
  videoFiles: TCreateFileConfig[];
  master: TCreateFileConfig;
};

@Injectable()
export class UploadingService {
  private readonly storage = new Storage();
  private readonly bucketName = env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME;
  private readonly logger = new Logger(UploadingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  async uploadTranscodedVideo({
    observers,
    dir,
    storageDir,
  }: {
    observers: string[];
    dir: string;
    storageDir: string;
  }) {
    return this.jobsService.wrap(
      {
        name: 'Uploading video',
        payload: {},
        type: 'uploading-video',
        observers,
      },
      async (job) => {
        const files = await fs.readdir(dir, {
          recursive: true,
          withFileTypes: true,
        });
        const filesPaths = files
          .filter((file) => file.isFile())
          .map((file) => path.join(file.parentPath, file.name));

        // upload files to storage
        const totalCount = filesPaths.length;
        let uploadedCount = 0;

        const responses = await Promise.all(
          filesPaths.map(async (filePath) => {
            const relPath = filePath.split(dir).at(-1)!;
            const destination = path.join(storageDir, relPath);
            const [response] = await this.storage
              .bucket(this.bucketName)
              .upload(filePath, {
                destination,
              });

            uploadedCount++;
            const percent = Math.round((uploadedCount / totalCount) * 100);
            job.progress(percent);

            return response;
          }),
        );

        fs.rm(dir, { recursive: true }).then(() => {
          this.logger.log(`Cleaned up ${dir}`);
        });

        return this.structured(responses);
      },
    );
  }

  async createDraft({
    structured,
    originalId,
    authorId,
    videoTitle,
    videoDescription,
    thumbnailOriginalSize,
    uploadImmediately,
  }: {
    structured: TStructuredFiles;
    originalId: string;
    authorId: string;
    videoTitle: string;
    videoDescription: string;
    thumbnailOriginalSize: {
      width: number;
      height: number;
    };
    uploadImmediately: boolean;
  }) {
    const dbFileSet = await this.prisma.fileSet.create({
      data: {
        files: {
          createMany: {
            data: structured.videoFiles,
          },
        },
      },
    });

    const dbMaster = await this.prisma.file.create({
      data: {
        ...structured.master,
        fileSet: {
          connect: {
            id: dbFileSet.id,
          },
        },
      },
    });

    const dbThumbnailSet = await this.prisma.imageSet.create({
      data: {},
    });

    const dbThumbnails = await this.putThumbnailsInSet({
      structured,
      setId: dbThumbnailSet.id,
      ownerId: authorId,
      thumbnailOriginalSize,
    });

    const video = await this.prisma.video.create({
      data: {
        title: videoTitle,
        description: videoDescription,
        status: 'READY',
        visibility: uploadImmediately ? 'PUBLIC' : 'DRAFT',
        imported: {
          create: {
            originalId,
            source: 'youtube',
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
        thumbnailSet: {
          connect: {
            id: dbThumbnailSet.id,
          },
        },
        thumbnail: {
          connect: {
            id: dbThumbnails[0].id,
          },
        },
        fileSet: {
          connect: {
            id: dbFileSet.id,
          },
        },
        master: {
          connect: {
            id: dbMaster.id,
          },
        },
      },
    });

    return { video };
  }

  async updateDraft({
    structured,
    draft,
    thumbnailOriginalSize,
  }: {
    structured: TStructuredFiles;
    draft: Video;
    thumbnailOriginalSize: {
      width: number;
      height: number;
    };
  }) {
    await this.prisma.fileSet.update({
      where: {
        id: draft.fileSetId,
      },
      data: {
        files: {
          createMany: {
            data: structured.videoFiles,
          },
        },
      },
    });

    const dbMaster = await this.prisma.file.create({
      data: {
        ...structured.master,
        fileSet: {
          connect: {
            id: draft.fileSetId,
          },
        },
      },
    });

    const dbThumbnails = await this.putThumbnailsInSet({
      structured,
      setId: draft.thumbnailSetId,
      ownerId: draft.authorId,
      thumbnailOriginalSize,
    });

    const video = await this.prisma.video.update({
      where: {
        id: draft.id,
      },
      data: {
        status: 'READY',
        thumbnail: {
          connect: {
            id: dbThumbnails[0].id,
          },
        },
        master: {
          connect: {
            id: dbMaster.id,
          },
        },
      },
    });

    return { video };
  }

  private async structured(responses: File[]) {
    const structured: TStructuredFiles = responses.reduce(
      (acc, response) => {
        const segments = response.name.split('/');
        segments.shift();
        segments.shift();
        segments.shift();

        let segment = segments.shift();
        if (segment === 'video') {
          segment = segments.shift();
          if (segment.startsWith('master')) {
            return {
              ...acc,
              master: {
                filename: segment,
                path: response.name,
                publicUrl: response.publicUrl(),
              },
            };
          } else {
            return {
              ...acc,
              videoFiles: [
                ...acc.videoFiles,
                {
                  filename: segment,
                  path: response.name,
                  publicUrl: response.publicUrl(),
                },
              ],
            };
          }
        } else if (segment === 'thumbnails') {
          segment = segments.shift();
          const thumbnailIdx = Number(segment.split('_').at(-1)) - 1;
          const thumbnail = acc.thumbnails[thumbnailIdx] ?? {};
          segment = segments.shift();
          const extension = path.extname(segment);
          const size = path.basename(segment, extension);
          thumbnail[size] = {
            filename: segment,
            path: response.name,
            publicUrl: response.publicUrl(),
          };
          acc.thumbnails[thumbnailIdx] = thumbnail;
          return acc;
        } else if (segment.startsWith('original')) {
          // TODO: don't upload original
          // noop
        } else {
          // error
        }
        return acc;
      },
      {
        thumbnails: [],
        videoFiles: [],
        master: {
          filename: '',
          path: '',
          publicUrl: '',
        },
      },
    );

    return structured;
  }

  private async putThumbnailsInSet({
    structured,
    setId,
    ownerId,
    thumbnailOriginalSize,
  }: {
    structured: TStructuredFiles;
    setId: string;
    ownerId: string;
    thumbnailOriginalSize: {
      width: number;
      height: number;
    };
  }) {
    return Promise.all(
      structured.thumbnails.map(async (thumbnail) =>
        this.prisma.image.create({
          data: {
            original: {
              create: thumbnail.original,
            },
            large: {
              create: thumbnail.large,
            },
            medium: {
              create: thumbnail.medium,
            },
            small: {
              create: thumbnail.small,
            },
            originalHeight: thumbnailOriginalSize.height,
            originalWidth: thumbnailOriginalSize.width,
            owner: {
              connect: {
                id: ownerId,
              },
            },
            set: {
              connect: {
                id: setId,
              },
            },
          },
        }),
      ),
    );
  }
}
