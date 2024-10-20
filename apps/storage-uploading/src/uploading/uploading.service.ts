// TODO: Implement media transcode microservice
import { env } from '@august-tv/env';

import { Injectable } from '@nestjs/common';
import { Storage, TransferManager } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { Prisma, PrismaClient, Video } from '@prisma/client';
import * as path from 'path';
import {
  ImageService,
  JobsService,
  PrismaService,
} from '@august-tv/server/modules';
import { getManyFiles } from '@august-tv/server/fs-utils';
import { generateString } from '@august-tv/common';
import { Prisma } from '@prisma/client';

const storage = new Storage();
const bucketName = env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME;
const transferManager = new TransferManager(storage.bucket(bucketName));

export type TTempFile = {
  originalName: string;
  path: string;
};

@Injectable()
export class UploadingService {
  private readonly storage = new Storage();
  private readonly bucketName = env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME;
  private readonly transferManager = new TransferManager(
    this.storage.bucket(this.bucketName),
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
    private readonly jobsService: JobsService,
  ) {}

  async uploadTranscodedVideo({
    dir,
    authorId,
  }: {
    dir: string;
    authorId: string;
  }) {
    const filesPaths = await fs.readdir(dir, {
      recursive: true,
    });

    const folderName = generateString(10);

    // upload files to storage
    let uploadedCount = 0;

    const responses = await Promise.all(
      filesPaths.map(async (filePath) => {
        const relPath = filePath.split(dir).at(-1)!;
        const destination = path.join(authorId, folderName, relPath);
        const [response] = await this.storage
          .bucket(this.bucketName)
          .upload(filePath, {
            destination,
          });

        uploadedCount++;

        return response;
      }),
    );

    responses.reduce((acc, response) => {}, {
      thumbnails: [],
      videoFiles: [],
    });

    // create files in db
    // const dbFiles = await Promise.all(
    //   responses.map((response) =>
    //     this.prisma.file.create({
    //       data: {
    //         filename: path.basename(response.name),
    //         path: response.name,
    //         publicUrl: response.publicUrl(),
    //       },
    //     }),
    //   ),
    // );

    // const dbFiles = await this.prisma.file.createMany({
    //   data: responses.map(
    //     (response) =>
    //       ({
    //         filename: path.basename(response.name),
    //         path: response.name,
    //         publicUrl: response.publicUrl(),
    //       }) as Prisma.FileCreateManyInput,
    //   ),
    // });

    // delete files from disk
  }
}
