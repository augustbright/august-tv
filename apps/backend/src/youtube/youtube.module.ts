import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';
import { UserModule } from 'src/user/user.module';
import { VideoDownloaderService } from './video-downloader.service';
import { SocketsModule } from 'src/sockets/sockets.module';
import { MediaModule } from 'src/media/media.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    UserModule,
    HttpModule,
    SocketsModule,
    MediaModule,
    JobsModule,
    PrismaModule,
    KafkaModule,
  ],
  controllers: [YoutubeController],
  providers: [YoutubeService, VideoDownloaderService],
})
export class YoutubeModule {}
