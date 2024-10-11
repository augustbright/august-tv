import { Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { SocketsController } from './sockets.controller';

@Module({
  providers: [SocketsGateway],
  exports: [SocketsGateway],
  controllers: [SocketsController],
})
export class SocketsModule {}
