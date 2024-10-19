import { env } from '@august-tv/env';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { SocketsModule } from './sockets/sockets.module';
import { FeedModule } from './feed/feed.module';
import { GuardCheckService } from './common/guard-check.service';
import { Reflector } from '@nestjs/core';
import { YoutubeModule } from './youtube/youtube.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthModule } from '@august-tv/server/modules';

@Module({
  imports: [
    UserModule,
    MediaModule,
    SocketsModule,
    FeedModule,
    YoutubeModule,
    JobsModule,
    HealthModule.forRoot({
      healthIndicators: [
        ({ http }) =>
          http.pingCheck(
            'youtube-importer',
            `http://${env.YOUTUBE_IMPORTER_HOST}:${env.YOUTUBE_IMPORTER_PORT}/health`,
          ),
        ({ memory }) => memory.checkHeap('memory', 150 * 1024 * 1024),
        ({ prisma }) => prisma.isHealthy('postgres'),
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GuardCheckService, Reflector],
})
export class AppModule {}
