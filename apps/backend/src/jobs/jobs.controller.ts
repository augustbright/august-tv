import { Body, Controller, Post } from '@nestjs/common';
import { JobsService } from '@august-tv/server/modules';
import { Guard } from '@august-tv/server/utils';
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
