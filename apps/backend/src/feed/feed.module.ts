import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { PrismaModule } from '@august-tv/server/modules';

@Module({
  providers: [FeedService],
  controllers: [FeedController],
  imports: [PrismaModule],
})
export class FeedModule {}
