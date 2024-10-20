import {
  JobsModule,
  KafkaEmitterModule,
  PrismaModule,
} from '@august-tv/server/modules';
import { Module } from '@nestjs/common';
import { UploadingService } from './uploading.service';
import { UploadingController } from './uploading.controller';

@Module({
  imports: [
    PrismaModule,
    JobsModule,
    KafkaEmitterModule.forRoot({
      clientId: 'storage-uploading',
    }),
  ],
  providers: [UploadingService],
  controllers: [UploadingController],
})
export class UploadingModule {}
