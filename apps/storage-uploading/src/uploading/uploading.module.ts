import {
  ImageModule,
  JobsModule,
  PrismaModule,
} from '@august-tv/server/modules';
import { Module } from '@nestjs/common';
import { UploadingService } from './uploading.service';

@Module({
  imports: [PrismaModule, ImageModule, JobsModule],
  providers: [UploadingService],
})
export class UploadingModule {}
