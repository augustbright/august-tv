import { Controller } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { EventPattern } from '@nestjs/microservices';
import { YoutubeImportRequestDto } from '@august-tv/server/dto';
import { KafkaTopics } from '@august-tv/server/kafka';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @EventPattern(KafkaTopics.YouTubeImportRequested)
  importFromYoutube(data: YoutubeImportRequestDto) {
    this.youtubeService.importFromYoutube(data);
  }
}
