import { TMessage } from '@august-tv/common/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SocketsGateway } from 'src/sockets/sockets.gateway';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly socketsGateway: SocketsGateway) {}

  @MessagePattern('send-to-user')
  handleKafkaMessage(@Payload() message: { data: TMessage; userId: string }) {
    this.socketsGateway.sendToUser(message.userId, message.data);
  }
}
