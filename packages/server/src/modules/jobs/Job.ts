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
        private readonly job: PrismaJob
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

    async error(error: string) {
        this.update({ error, status: "FAILED" });
        this.emit("fail", error);
        this.emit("finished");
        this.cleanup();
    }

    async done() {
        this.update({ status: "DONE", progress: 100 });
        this.emit("done");
        this.emit("finished");
        this.cleanup();
    }

    get isChild() {
        return !!this.parentJob;
    }

    async registerChildJob(job: Job) {
        if (this.job.status !== "IN_PROGRESS") {
            this.logger.error(
                `Cannot register child job for job ${this.job.id} with status ${this.job.status}`
            );
            return this;
        }

        if (this.isChild) {
            return await this.parentJob?.registerChildJob(job);
        } else {
            this.jobsService.registerChildJob(this.job.id, job.job.id);
            job.parentJob = this;
            return this;
        }
    }

    private cleanup() {
        this.removeAllListeners();
    }
}
