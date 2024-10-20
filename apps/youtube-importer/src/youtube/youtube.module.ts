import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { VideoDownloaderService } from './video-downloader.service';
import {
  KafkaEmitterModule,
  PrismaModule,
  JobsModule,
} from '@august-tv/server/modules';

@Module({
  imports: [
    HttpModule,
    KafkaEmitterModule.forRoot({
      clientId: 'youtube-importer',
    }),
    PrismaModule,
    JobsModule,
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService, VideoDownloaderService],
})
export class YoutubeModule {}
