import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsModule as CommonJobsModule } from '@august-tv/server/modules';

@Module({
  imports: [CommonJobsModule],
  controllers: [JobsController],
})
export class JobsModule {}
