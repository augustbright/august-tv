import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('latest')
  async getLatestFeed() {
    const result = await this.feedService.getLatest();
    return result; // NestJS automatically handles the response
  }
}
