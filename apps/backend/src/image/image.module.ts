import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { StorageModule } from 'src/storage/storage.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [StorageModule, PrismaModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
