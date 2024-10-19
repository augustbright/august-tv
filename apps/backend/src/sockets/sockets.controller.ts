import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { TMessage } from '@august-tv/common/types';
import { Guard } from '@august-tv/server/utils';
import { EventPattern } from '@nestjs/microservices';
import { KafkaPayloads, KafkaTopics } from '@august-tv/server/kafka';

@Controller('sockets')
export class SocketsController {
  constructor(private readonly socketsGateway: SocketsGateway) {}

  @Get('/connections')
  @Guard.scope('admin')
  getConnections() {
    return this.socketsGateway.getConnections();
  }

  @Post('/send-message/:uid')
  @Guard.scope('admin')
  sendMessage(@Body() message: TMessage, @Param('uid') uid: string) {
    return this.socketsGateway.sendToUser(uid, message);
  }

  @EventPattern(KafkaTopics.JobsStatusUpdated)
  @Guard.scope('public')
  onJobStatusUpdated(payload: KafkaPayloads[KafkaTopics.JobsStatusUpdated]) {
    payload.observers.forEach((observer) => {
      this.socketsGateway.sendToUser(observer, {
        type: 'job-status',
        action: payload.action,
        job: payload.job,
      });
    });
  }
}
