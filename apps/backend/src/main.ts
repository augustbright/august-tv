import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseAuthMiddleware } from './common/firebase-auth.middleware';

async function bootstrap() {
  const port = process.env.SERVICE_BACKEND_PORT;
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(new FirebaseAuthMiddleware().use);

  try {
    console.log(`Starting server on port ${port}`);
    await app.listen(port);
    console.log(`Server started on port ${port}`);
  } catch (error) {
    console.error('Error starting server', error);
  }
}
bootstrap();
