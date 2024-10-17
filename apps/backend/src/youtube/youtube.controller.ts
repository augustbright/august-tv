import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Guard } from 'src/common/guard';
import { YoutubeService } from './youtube.service';
import { PostImportFromYoutube } from './youtube.dto';
import { ClientKafka } from '@nestjs/microservices';

@Controller('youtube')
export class YoutubeController {
  constructor(
    private readonly youtubeService: YoutubeService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  @Guard.scope('public')
  async onModuleInit() {
    await this.kafkaService.connect();
  }

  @Post('/importFromYoutube')
  @Guard.scope('admin')
  async importFromYoutube(@Body() body: PostImportFromYoutube.Body) {
    this.kafkaService.emit('youtube-import-requested', JSON.stringify(body));
    // return this.youtubeService.importFromYoutube(body);
  }
}
