import { Body, Controller, Post } from '@nestjs/common';
import { Guard } from 'src/common/guard';
import { YoutubeService } from './youtube.service';
import { VideoDownloaderService } from './video-downloader.service';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TImportFromYoutubeParams } from '@august-tv/common/types';

@Controller('youtube')
export class YoutubeController {
  constructor(
    private readonly youtubeService: YoutubeService,
    private readonly videoDownloaderService: VideoDownloaderService,
    private readonly mediaService: MediaService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('/importFromYoutube')
  @Guard.scope('admin')
  async importFromYoutube(@Body() body: TImportFromYoutubeParams) {
    return this.youtubeService.importFromYoutube(body);
  }
}
