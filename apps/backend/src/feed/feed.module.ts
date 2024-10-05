import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [FeedService],
  controllers: [FeedController],
  imports: [PrismaModule],
})
export class FeedModule {}
