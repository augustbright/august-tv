import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseAuthMiddleware } from './common/firebase-auth.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.BACKEND_PORT;
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
  SwaggerModule.setup('swagger', app, document); // '/api' will serve the Swagger UI

  try {
    console.log(`Starting server on port ${port}`);
    await app.listen(port);
    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.error('Error starting server', error);
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Received SIGINT, closing app...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, closing app...');
    await app.close();
    process.exit(0);
  });
}
bootstrap();
