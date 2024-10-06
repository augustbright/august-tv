import { Injectable } from '@nestjs/common';
import { Storage, TransferManager } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { TranscodeService } from '../transcode/transcode.service';
import * as fs from 'fs/promises';
import { Video } from '@prisma/client';
import { SocketsGateway } from 'src/sockets/sockets.gateway';

const storage = new Storage();
const bucketName = process.env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME;
const transferManager = new TransferManager(storage.bucket(bucketName));
const rootOutputFolder = 'tmp/transcoded/';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transcodeService: TranscodeService,
    private readonly socketsGateway: SocketsGateway,
  ) {}

  async getMediaById(id: string) {
    return this.prisma.video.findUnique({
      where: { id },
    });
  }

  async upload(file: Express.Multer.File, user: any) {
    const video = await this.prisma.video.create({
      data: {
        authorId: user.uid,
        title: file.originalname,
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
    });
  }

  async getMediaForEditingById(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    });

    const [thumbnails] = await storage.bucket(bucketName).getFiles({
      prefix: `transcoded/${video.folder}/thumbnails/`,
    });

    const thumbnailUrls = thumbnails.map((thumbnail) => thumbnail.publicUrl());

    return {
      ...video,
      thumbnails: thumbnailUrls,
    };
  }

  private async processVideo(file: Express.Multer.File, video: Video) {
    try {
      const filename = `${randomUUID()}_${file.originalname}`;
      const outputFolder = `${rootOutputFolder}${filename}/`;

      async function getManyFiles(folder: string, ending: string) {
        const allFiles = await fs.readdir(`${outputFolder}${folder}`);
        return allFiles
          .map((file) => `${outputFolder}${folder}/${file}`)
          .filter((file) => file.endsWith(ending));
      }

      async function uploadManyFiles(files: string[]) {
        return await transferManager.uploadManyFiles(files, {
          customDestinationBuilder(path) {
            const relPath = path.split(outputFolder).at(-1);
            return `transcoded/${filename}/${relPath}`;
          },
        });
      }

      const tempFilePath = file.path;
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
      // const allThumbnailFiles = await getManyFiles(
      //   transcoded.thumbnailsFolder,
      //   '.png',
      // );

      await uploadManyFiles(videoVariantFiles);
      await uploadManyFiles(videoPartsFiles);
      const [uploadedMasters] = await uploadManyFiles(videoMasterFiles);
      // const [uploadedThumbnails] = await uploadManyFiles(allThumbnailFiles);

      await this.prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'READY',
          masterUrl: uploadedMasters[0].publicUrl(),
          //TODO: thumbnailUrl: uploadedThumbnails[0].publicUrl(),
          folder: filename,
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
        error: error.message,
      });
    } finally {
      await fs.rm(rootOutputFolder, { recursive: true });
      await fs.rm(file.path);
    }
  }
}
