import { Controller } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { EventPattern } from '@nestjs/microservices';
import { YoutubeImportRequestDto } from '@august-tv/server/dto';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @EventPattern('youtube-import-requested')
  importFromYoutube(data: YoutubeImportRequestDto) {
    console.log('Importing from YouTube - controller');
    this.youtubeService.importFromYoutube(data);
  }
}
