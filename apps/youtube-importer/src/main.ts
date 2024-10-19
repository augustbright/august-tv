import { env } from '@august-tv/env';
import { createServerLogger } from '@august-tv/server';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { iAmHealthy } from '@august-tv/server/modules';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    logger: createServerLogger('youtube-importer'),
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

  await iAmHealthy(env.YOUTUBE_IMPORTER_PORT);
}
bootstrap();
