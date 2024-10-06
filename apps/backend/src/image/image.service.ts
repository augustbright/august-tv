import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';
import * as path from 'path';
import {
  cleanUp,
  ensureUploadPath,
  moveUploadedFile,
  resolveUploadPath,
} from 'src/common/fs-utils';
import { StorageService } from 'src/storage/storage.service';
import { PrismaService } from 'src/prisma/prisma.service';
import type { File } from '@google-cloud/storage';

@Injectable()
export class ImageService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly sizes = [
    { width: 200, name: 'small' },
    { width: 500, name: 'medium' },
    { width: 1000, name: 'large' },
  ] as const;

  async uploadImage(
    image: Express.Multer.File,
    config: {
      ownerId: string;
    },
  ) {
    const imageId = randomUUID();
    try {
      await ensureUploadPath(imageId);
      const { width: originalWidth, height: originalHeight } = await sharp(
        resolveUploadPath(image.filename),
      ).metadata();

      await this.resizeImage(image.filename, imageId);
      await moveUploadedFile(
        image.filename,
        imageId,
        `original-${image.filename}`,
      );

      const storageFiles = await this.storageService.uploadFromFolder(
        imageId,
        `images/${config.ownerId}/${imageId}`,
      );

      type Size =
        | (typeof ImageService.prototype.sizes)[number]['name']
        | 'original';
      const sizeFilesMap = storageFiles.reduce((acc, file) => {
        const filename = path.basename(file.name);
        const size = filename.split('-')[0];
        return { ...acc, [size]: file };
      }, {}) as Record<Size, File>;

      return this.prisma.image.create({
        data: {
          id: imageId,
          folder: `images/${config.ownerId}/${imageId}`,
          largeUrl: sizeFilesMap.large.publicUrl(),
          mediumUrl: sizeFilesMap.medium.publicUrl(),
          smallUrl: sizeFilesMap.small.publicUrl(),
          originalUrl: sizeFilesMap.original.publicUrl(),
          originalWidth,
          originalHeight,
          ownerId: config.ownerId,
        },
      });
    } finally {
      cleanUp(imageId);
      cleanUp(image.filename);
    }
  }

  async resizeImage(filename: string, imageId: string): Promise<void> {
    for (const size of this.sizes) {
      const resizedImagePath = resolveUploadPath(
        imageId,
        `${size.name}-${filename}`,
      );

      await sharp(resolveUploadPath(filename))
        .resize({ width: size.width })
        .toFile(resizedImagePath);
    }
  }
}
