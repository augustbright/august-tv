import { Body, Controller, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Guard } from 'src/common/guard';
import { TJobTestParams } from '@august-tv/common/types';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('test')
  @Guard.scope('admin')
  async testJob(
    @Body()
    body: TJobTestParams,
  ) {
    return this.jobsService.test(body);
  }
}
