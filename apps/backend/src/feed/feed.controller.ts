import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ApiTags } from '@nestjs/swagger';
import { Guard } from 'src/common/guard';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Guard.scope('public')
  @Get('latest')
  async getLatestFeed() {
    const result = await this.feedService.getLatest();
    return result; // NestJS automatically handles the response
  }
}
