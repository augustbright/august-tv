/// <reference types="node" />
/// <reference types="node" />
import { Prisma, $Enums, Job as PrismaJob } from "@prisma/client";
import { JobsService } from "./jobs.service";
import { EventEmitter } from "stream";
import { TJobType } from "@august-tv/common/types";
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
export declare class Job extends EventEmitter<{
    done: [];
    fail: [error: string];
    finished: [];
}> {
    private readonly jobsService;
    private readonly job;
    private lastProgress;
    protected parentJob: Job | null;
    private readonly logger;
    metadata: Record<string, unknown>;
    constructor(jobsService: JobsService, job: PrismaJob);
    update({ progress, ...rest }: Partial<TJobUpdateParams>): Promise<{
        observers: {
            id: string;
        }[];
    } & {
        error: string | null;
        description: string | null;
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
        status: $Enums.JobStatus;
        progress: number;
        stage: string | null;
        payload: Prisma.JsonValue;
        parentJobId: string | null;
    }>;
    stage(stage: string): Promise<void>;
    progress(progress: number): Promise<void>;
    error(error: string): Promise<void>;
    done(): Promise<void>;
    get isChild(): boolean;
    registerChildJob(job: Job): any;
    private cleanup;
}
