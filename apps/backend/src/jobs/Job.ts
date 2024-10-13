import { Prisma, $Enums, Job as PrismaJob } from '@prisma/client';
import { JobsService } from './jobs.service';
import { EventEmitter } from 'stream';
import { UnknownRecord } from 'type-fest';

export type TJobParams = {
  name: string;
  description?: string;
  stage?: string;
  payload: Prisma.JsonObject;
};

export type TJobUpdateParams = {
  progress: number;
  status: $Enums.JobStatus;
  stage: string;
  error: string;
  mergePayload: Prisma.JsonObject;
};

export class Job extends EventEmitter<{
  done: [];
  error: [error: string];
  finished: [];
}> {
  private lastProgress = 0;
  public metadata: UnknownRecord = {};
  constructor(
    private readonly jobsService: JobsService,
    private readonly job: PrismaJob,
  ) {
    super();
  }

  async update({ progress, ...rest }: Partial<TJobUpdateParams>) {
    const params = {
      ...rest,
    };
    if (progress && progress - this.lastProgress > 5) {
      this.lastProgress = progress;
      //   @ts-expect-error - let it be
      params.progress = this.lastProgress;
    }
    return this.jobsService.update(this.job.id, params);
  }

  async stage(stage: string) {
    this.update({ stage });
  }

  async progress(progress: number) {
    this.update({ progress });
  }

  async error(error: string) {
    this.update({ error, status: 'FAILED' });
    this.emit('error', error);
    this.cleanup();
  }

  async done() {
    this.update({ status: 'DONE', progress: 100 });
    this.emit('done');
    this.cleanup();
  }

  async forClient() {
    return this.jobsService.forClient(this.job.id);
  }

  private cleanup() {
    // this.removeAllListeners();
  }
}
