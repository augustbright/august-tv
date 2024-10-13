import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Job as PrismaJob } from '@prisma/client';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { Job, TJobParams, TJobUpdateParams } from './Job';
import { TJobTestParams } from '@august-tv/common/types';

@Injectable()
export class JobsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly socketsGateway: SocketsGateway,
  ) {}

  async create(
    params: TJobParams,
    {
      observers,
    }: {
      observers: string[];
    },
  ) {
    const job = await this.prismaService.job.create({
      data: {
        name: params.name,
        description: params.description,
        payload: params.payload,
        observers: {
          connect: observers.map((observer) => ({ id: observer })),
        },
      },
    });

    setImmediate(() => {
      try {
        this.notifyObservers(job, 'created', observers);
      } catch (error) {
        console.error(error);
      }
    });

    return new Job(this, job);
  }

  async update(id: string, params: Partial<TJobUpdateParams>) {
    const job = await this.prismaService.$transaction(async (tx) => {
      const shouldUpdateProgress = !!params.progress;
      const shouldUpdateStatus = !!params.status;
      const shouldUpdateStage = !!params.stage;
      const shouldUpdateError = !!params.error;
      const shouldMergePayload = !!params.mergePayload;
      let payload: Prisma.JsonObject = {};
      if (shouldMergePayload) {
        const prevJob = await tx.job.findFirstOrThrow({
          where: { id },
        });
        payload = { ...(prevJob.payload as object), ...params.mergePayload };
      }

      return tx.job.update({
        where: { id },
        data: {
          ...(shouldUpdateStatus && { status: params.status }),
          ...(shouldUpdateProgress && { progress: params.progress }),
          ...(shouldUpdateStage && { stage: params.stage }),
          ...(shouldUpdateError && { error: params.error }),
          ...(shouldMergePayload && { payload }),
        },
        include: {
          observers: {
            select: {
              id: true,
            },
          },
        },
      });
    });

    setImmediate(() => {
      try {
        this.notifyObservers(
          job,
          'updated',
          job.observers.map((o) => o.id),
        );

        if (params.status === 'DONE') {
          this.notifyObservers(
            job,
            'done',
            job.observers.map((o) => o.id),
          );
        }

        if (params.status === 'FAILED') {
          this.notifyObservers(
            job,
            'failed',
            job.observers.map((o) => o.id),
          );
        }
      } catch (error) {
        console.error(error);
      }
    });

    return job;
  }

  private async notifyObservers(
    job: PrismaJob,
    action: 'created' | 'updated' | 'done' | 'failed',
    observers: string[],
  ) {
    observers.forEach((observer) => {
      this.socketsGateway.sendToUser(observer, {
        type: 'job-status',
        action,
        job,
      });
    });
  }

  async forClient(id: string) {
    return this.prismaService.job.findFirstOrThrow({
      where: { id },
    });
  }

  getJobsObservedByUser(userId: string) {
    return this.prismaService.job.findMany({
      where: {
        observers: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  unobserveJob(jobId: string, userId: string) {
    return this.prismaService.job.update({
      where: { id: jobId },
      data: {
        observers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async test(params: TJobTestParams) {
    const job = await this.create(
      {
        name: params.name,
        description: params.description,
        payload: params.payload ?? {},
        stage: params.stage,
      },
      {
        observers: params.observers,
      },
    );

    let timePassed = 0;
    let lastMilestone = 0;
    const interval = setInterval(() => {
      timePassed += 500;
      const percentCompleted = Math.round((timePassed / params.timeout) * 100);
      job.progress(percentCompleted);
      const currentMilestone = Math.floor(percentCompleted / 10) * 10;
      if (currentMilestone > lastMilestone) {
        lastMilestone = currentMilestone;
        job.stage(`Milestone ${currentMilestone}%`);
      }
    }, 500);
    setTimeout(() => {
      clearInterval(interval);
      job.done();
    }, params.timeout);

    return job.forClient();
  }
}
