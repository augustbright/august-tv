import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import {
  PrismaModule,
  ImageModule,
  DbFileModule,
  MediaUploadModule,
} from '@august-tv/server/modules';
import { SocketsModule } from 'src/sockets/sockets.module';
import { UserModule } from 'src/user/user.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    PrismaModule,
    SocketsModule,
    ImageModule,
    DbFileModule,
    UserModule,
    JobsModule,
    MediaUploadModule,
  ],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
