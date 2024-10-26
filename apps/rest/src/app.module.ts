import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketsModule } from './sockets/sockets.module';
import { FeedModule } from './feed/feed.module';
import { GuardCheckService } from './common/guard-check.service';
import { Reflector } from '@nestjs/core';
import {
  HealthModule,
  JobsModule,
  KafkaEmitterModule,
  UserModule,
  VideoModule,
} from '@august-tv/server/modules';
import { TagsModule } from './tags/tags.module';
import { CategoriesModule } from './categories/categories.module';
import { UserController } from './user/user.controller';
import { VideoController } from './video/video.controller';
import { YoutubeController } from './youtube/youtube.controller';
import { JobsController } from './jobs/jobs.controller';

@Module({
  imports: [
    UserModule,
    VideoModule,
    SocketsModule,
    FeedModule,
    JobsModule,
    HealthModule.forRoot({
      healthIndicators: [
        ({ memory }) => memory.checkHeap('memory', 150 * 1024 * 1024),
        ({ prisma }) => prisma.isHealthy('postgres'),
      ],
    }),
    TagsModule,
    CategoriesModule,
    KafkaEmitterModule.forRoot({
      clientId: 'rest',
    }),
  ],
  controllers: [
    AppController,
    UserController,
    VideoController,
    YoutubeController,
  ],
  providers: [AppService, GuardCheckService, Reflector, JobsController],
})
export class AppModule {}
