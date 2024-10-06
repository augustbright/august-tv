import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MediaModule } from './media/media.module';
import { SocketsModule } from './sockets/sockets.module';
import { PrismaModule } from './prisma/prisma.module';
import { TranscodeModule } from './transcode/transcode.module';
import { FeedModule } from './feed/feed.module';
import { ImageModule } from './image/image.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    UserModule,
    MediaModule,
    SocketsModule,
    PrismaModule,
    TranscodeModule,
    FeedModule,
    ImageModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
