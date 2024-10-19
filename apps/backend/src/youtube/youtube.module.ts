import { Module } from '@nestjs/common';
import { YoutubeController } from './youtube.controller';
import { KafkaEmitterModule } from '@august-tv/server/modules';

@Module({
  imports: [
    KafkaEmitterModule.forRoot({
      clientId: 'rest-youtube-importer',
      groupId: 'rest-youtube-importer',
    }),
  ],
  controllers: [YoutubeController],
})
export class YoutubeModule {}
