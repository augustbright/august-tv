import { Body, Controller, Post } from '@nestjs/common';
import { Guard } from '@august-tv/server/utils';
import { KafkaEmitterService } from '@august-tv/server/modules';
import { YoutubeImportRequestDto } from '@august-tv/server/dto';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly KafkaEmitterService: KafkaEmitterService) {}

  @Post('/importFromYoutube')
  @Guard.scope('admin')
  async importFromYoutube(@Body() body: YoutubeImportRequestDto) {
    this.KafkaEmitterService.emit(
      KafkaEmitterService.topics.YouTubeImportRequested,
      body,
    );
  }
}
