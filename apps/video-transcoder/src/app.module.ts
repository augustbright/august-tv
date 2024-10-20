import { TranscodeModule } from './transcode/transcode.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TranscodeModule],
})
export class AppModule {}
