import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DbFileModule } from 'src/db-file/db-file.module';

@Module({
  imports: [StorageModule, PrismaModule, DbFileModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
