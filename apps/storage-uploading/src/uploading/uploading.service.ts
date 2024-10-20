import { env } from '@august-tv/env';

import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs/promises';
import * as path from 'path';
import { JobsService, PrismaService } from '@august-tv/server/modules';

export type TTempFile = {
  originalName: string;
  path: string;
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
    authorId,
    thumbnailOriginalSize,
    videoTitle,
    videoDescription,
    uploadImmediately,
  }: {
    observers: string[];
    dir: string;
    storageDir: string;
    authorId: string;
    thumbnailOriginalSize: {
      width: number;
      height: number;
    };
    videoTitle: string;
    videoDescription: string;
    uploadImmediately: boolean;
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

        type TCreateFileConfig = {
          filename: string;
          path: string;
          publicUrl: string;
        };

        const structured: {
          thumbnails: {
            small: TCreateFileConfig;
            medium: TCreateFileConfig;
            large: TCreateFileConfig;
            original: TCreateFileConfig;
          }[];
          videoFiles: TCreateFileConfig[];
          master: TCreateFileConfig;
        } = responses.reduce(
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

        const dbThumbnails = await Promise.all(
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
                    id: authorId,
                  },
                },
                set: {
                  connect: {
                    id: dbThumbnailSet.id,
                  },
                },
              },
            }),
          ),
        );

        const video = await this.prisma.video.create({
          data: {
            title: videoTitle,
            description: videoDescription,
            status: 'READY',
            visibility: uploadImmediately ? 'PUBLIC' : 'DRAFT',
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
      },
    );
  }
}
