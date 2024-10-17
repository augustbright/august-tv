import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseAuthMiddleware } from './common/firebase-auth.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { env, gracefulShutdown } from '@august-tv/server';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const port = env.BACKEND_PORT;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  app.use(cookieParser());
  app.use(new FirebaseAuthMiddleware().use);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  gracefulShutdown(app);

  try {
    console.log(`Starting server on port ${port}`);
    await app.listen(port);
    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.error('Error starting server', error);
    return process.exit(1);
  }

  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [env.KAFKA_BROKER],
      },
      consumer: {
        groupId: 'api-service-consumer',
      },
    },
  });

  await kafkaMicroservice.listen();
  console.log('Kafka microservice started');
}
bootstrap();
