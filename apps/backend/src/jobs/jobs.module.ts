import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketsModule } from 'src/sockets/sockets.module';

@Module({
  imports: [PrismaModule, SocketsModule],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
