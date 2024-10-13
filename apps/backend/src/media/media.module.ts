import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketsModule } from 'src/sockets/sockets.module';
import { TranscodeModule } from 'src/transcode/transcode.module';
import { ImageModule } from 'src/image/image.module';
import { DbFileModule } from 'src/db-file/db-file.module';
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
  ],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
