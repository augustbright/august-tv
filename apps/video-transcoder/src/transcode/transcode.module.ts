import { Module } from '@nestjs/common';
import { TranscodeService } from './transcode.service';
import { TranscodeController } from './transcode.controller';
import {
  ImageModule,
  JobsModule,
  KafkaEmitterModule,
} from '@august-tv/server/modules';

@Module({
  imports: [
    KafkaEmitterModule.forRoot({
      clientId: 'video-transcoder',
    }),
    JobsModule,
    ImageModule,
  ],
  providers: [TranscodeService],
  exports: [TranscodeService],
  controllers: [TranscodeController],
})
export class TranscodeModule {}
