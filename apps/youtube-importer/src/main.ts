import { env } from '@august-tv/env';
import { bootstrapMicroservice } from '@august-tv/server';
import { AppModule } from './app.module';

bootstrapMicroservice({
  AppModule,
  tag: 'youtube-importer',
  port: env.YOUTUBE_IMPORTER_PORT,
});
