import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { TMessage } from '@august-tv/common/types';

@Controller('sockets')
export class SocketsController {
  constructor(private readonly socketsGateway: SocketsGateway) {}

  @Get('/connections')
  getConnections() {
    return this.socketsGateway.getConnections();
  }

  @Post('/send-message/:uid')
  sendMessage(@Body() message: TMessage, @Param('uid') uid: string) {
    return this.socketsGateway.sendToUser(uid, message);
  }
}
