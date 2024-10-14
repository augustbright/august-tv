import { Body, Controller, Post } from '@nestjs/common';
import { Guard } from 'src/common/guard';
import { YoutubeService } from './youtube.service';
import { PostImportFromYoutube } from './youtube.dto';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('/importFromYoutube')
  @Guard.scope('admin')
  async importFromYoutube(@Body() body: PostImportFromYoutube.Body) {
    return this.youtubeService.importFromYoutube(body);
  }
}
