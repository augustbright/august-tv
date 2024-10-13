import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketsModule } from 'src/sockets/sockets.module';
import { JobsController } from './jobs.controller';

@Module({
  imports: [PrismaModule, SocketsModule],
  providers: [JobsService],
  exports: [JobsService],
  controllers: [JobsController],
})
export class JobsModule {}
