import { Controller, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ApiTags } from '@nestjs/swagger';
import { Guard } from '@august-tv/server/utils';
import { User } from 'src/user/user.decorator';
import { DecodedIdToken } from 'firebase-admin/auth';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Guard.scope('public')
  @Get('latest')
  async getLatestFeed() {
    const result = await this.feedService.getLatest();
    return result;
  }

  @Guard.scope('user')
  @Get('subscriptions')
  async getSubscriptionsFeed(@User({ required: true }) user: DecodedIdToken) {
    return await this.feedService.getSubscriptionsFeed(user.uid);
  }
}
