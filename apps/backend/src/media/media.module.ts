import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from '@august-tv/server/modules';
import { TranscodeModule } from '@august-tv/server/modules';
import { ImageModule } from '@august-tv/server/modules';
import { DbFileModule } from '@august-tv/server/modules';
import { MediaUploadModule } from '@august-tv/server/modules';
import { SocketsModule } from 'src/sockets/sockets.module';
import { UserModule } from 'src/user/user.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    PrismaModule,
    SocketsModule,
    TranscodeModule,
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
