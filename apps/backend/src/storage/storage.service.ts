import { Injectable } from '@nestjs/common';
import { Storage, TransferManager } from '@google-cloud/storage';
import { getManyFiles, resolveUploadPath } from 'src/common/fs-utils';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly storage = new Storage();
  private readonly bucketName = process.env.GOOGLE_CLOUD_MEDIA_BUCKET_NAME!;
  private readonly transferManager = new TransferManager(
    this.storage.bucket(this.bucketName),
  );

  async uploadFromFolder(folder: string, destination: string) {
    const resolvedPath = resolveUploadPath(folder);
    const files = await getManyFiles(folder);

    const responses = await this.transferManager.uploadManyFiles(files, {
      customDestinationBuilder(localPath) {
        const relPath = localPath.split(resolvedPath).at(-1)!;
        return path.join(destination, relPath);
      },
    });

    const storageFiles = responses.map((response) => {
      const file = response[0];
      return file;
    });

    return storageFiles;
  }

  async downloadFile(file: string, destination: string) {
    await this.storage.bucket(this.bucketName).file(file).download({
      destination,
    });

    return path.basename(file);
  }

  async deleteFile(path: string) {
    return this.storage.bucket(this.bucketName).file(path).delete();
  }
}
