import { Prisma, $Enums, Job as PrismaJob } from "@prisma/client";
import { JobsService } from "./jobs.service";
import { EventEmitter } from "stream";
import { TJobType } from "@august-tv/common/types";
import { Logger } from "@nestjs/common";

export type TJobParams = {
    name: string;
    description?: string;
    stage?: string;
    type: TJobType;
    payload: Prisma.JsonObject;
    observers: string[];
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
    fail: [error: string];
    finished: [];
}> {
    private lastProgress = 0;
    protected parentJob: Job | null = null;
    private readonly logger: Logger;

    public metadata: Record<string, unknown> = {};
    constructor(
        private readonly jobsService: JobsService,
        private readonly job: PrismaJob,
        public readonly observers: string[]
    ) {
        super();
        this.logger = new Logger(`Job:${job.type}:${job.name} (${job.id})`);
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

    private cleanup() {
        this.removeAllListeners();
    }
}
