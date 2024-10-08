import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketsModule } from 'src/sockets/sockets.module';
import { TranscodeModule } from 'src/transcode/transcode.module';

@Module({
  imports: [PrismaModule, SocketsModule, TranscodeModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
