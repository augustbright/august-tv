import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { SocketsModule } from 'src/sockets/sockets.module';

@Module({
  imports: [SocketsModule],
  providers: [KafkaController],
})
export class KafkaModule {}
