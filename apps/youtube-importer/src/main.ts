import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { env } from '@august-tv/server';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'youtube-importer-consumer',
      },
    },
  });
  await app.listen();
}
bootstrap();
