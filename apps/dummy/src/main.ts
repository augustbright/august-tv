import { env } from '@august-tv/env';
import { bootstrapMicroservice } from '@august-tv/server';
import { AppModule } from './app.module';

bootstrapMicroservice({
  AppModule,
  tag: 'dummy',
  port: env.DUMMY_PORT,
});
