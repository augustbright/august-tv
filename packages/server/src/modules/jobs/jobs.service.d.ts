import { KafkaEmitterService } from "../kafka-emitter/kafka-emitter.service";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { Job, TJobParams, TJobUpdateParams } from "./Job";
import { TJobTestParams } from "@august-tv/common/types";
export declare class JobsService {
    private readonly prismaService;
    private readonly kafkaEmitterService;
    constructor(prismaService: PrismaService, kafkaEmitterService: KafkaEmitterService);
    create(params: TJobParams, { observers, }: {
        observers: string[];
    }): Promise<Job>;
    registerChildJob(parentJobId: string, childJobId: string): Promise<{
        error: string | null;
        description: string | null;
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
        status: import(".prisma/client").$Enums.JobStatus;
        progress: number;
        stage: string | null;
        payload: Prisma.JsonValue;
        parentJobId: string | null;
    }>;
    update(id: string, params: Partial<TJobUpdateParams>): Promise<{
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
        status: import(".prisma/client").$Enums.JobStatus;
        progress: number;
        stage: string | null;
        payload: Prisma.JsonValue;
        parentJobId: string | null;
    }>;
    private notifyObservers;
    getJobsObservedByUser(userId: string): Promise<({
        childJobs: {
            error: string | null;
            description: string | null;
            name: string;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            deleted: boolean;
            status: import(".prisma/client").$Enums.JobStatus;
            progress: number;
            stage: string | null;
            payload: Prisma.JsonValue;
            parentJobId: string | null;
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
        status: import(".prisma/client").$Enums.JobStatus;
        progress: number;
        stage: string | null;
        payload: Prisma.JsonValue;
        parentJobId: string | null;
    })[]>;
    unobserveJob(jobId: string, userId: string): Prisma.Prisma__JobClient<{
        error: string | null;
        description: string | null;
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        deleted: boolean;
        status: import(".prisma/client").$Enums.JobStatus;
        progress: number;
        stage: string | null;
        payload: Prisma.JsonValue;
        parentJobId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    test(params: TJobTestParams): Promise<void>;
}
