import { env } from '@august-tv/env';
import { bootstrapMicroservice } from '@august-tv/server';
import { AppModule } from './app.module';

bootstrapMicroservice({
  AppModule,
  tag: 'storage-uploading',
  port: env.STORAGE_UPLOADING_PORT,
});
