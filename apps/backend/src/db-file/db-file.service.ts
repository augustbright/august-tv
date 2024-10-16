import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { File } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DbFileService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  async delete(file: File) {
    const deleteFromStoragePromise = this.storageService.deleteFile(file.path);

    const deletedFile = await this.prisma.file.update({
      where: { id: file.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    await deleteFromStoragePromise;

    return deletedFile;
  }
}
