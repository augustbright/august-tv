import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { SocketsModule } from 'src/sockets/sockets.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '@august-tv/server';

@Module({
  imports: [
    SocketsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'api-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [KafkaController],
  exports: [ClientsModule],
})
export class KafkaModule {}
