import { env } from '@august-tv/env';
import { bootstrapMicroservice } from '@august-tv/server';
import { AppModule } from './app.module';

bootstrapMicroservice({
  AppModule,
  tag: 'video-transcoder',
  port: env.VIDEO_TRANSCODER_PORT,
});
