import { Injectable } from "@nestjs/common";
import { KafkaEmitterService } from "../kafka-emitter/kafka-emitter.service";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Job as PrismaJob } from "@prisma/client";
import { Job, TJobParams, TJobUpdateParams } from "./Job";
import { TJobAction, TJobTestParams } from "@august-tv/common/types";
import { KafkaTopics } from "../../kafka";
import { throttle } from "lodash";

const JOB_NOTIFICATION_THROTTLE = 1000;

@Injectable()
export class JobsService {
    private readonly notifyObservers: (
        job: PrismaJob,
        action: TJobAction,
        observers: string[]
    ) => void = throttle((job, action, observers) => {
        this.kafkaEmitterService.emit(KafkaTopics.JobsStatusUpdated, {
            action,
            job,
            observers,
        });
    }, JOB_NOTIFICATION_THROTTLE);

    constructor(
        private readonly prismaService: PrismaService,
        private readonly kafkaEmitterService: KafkaEmitterService
    ) {}

    private async create(params: TJobParams) {
        const dbJob = await this.prismaService.job.create({
            data: {
                name: params.name,
                description: params.description,
                type: params.type,
                payload: params.payload,
                stage: params.stage,
                observers: {
                    connect: params.observers.map((observer) => ({
                        id: observer,
                    })),
                },
            },
        });

        setImmediate(() => {
            try {
                this.notifyObservers(dbJob, "created", params.observers);
            } catch (error) {
                console.error(error);
            }
        });

        return {
            dbJob,
            jobInstance: new Job(this, dbJob, params.observers),
        };
    }

    async wrap<R>(params: TJobParams, callback: (job: Job) => Promise<R>) {
        const { jobInstance, dbJob } = await this.create(params);
        try {
            const result = await callback(jobInstance);
            this.update(dbJob.id, {
                status: "DONE",
                progress: 100,
            });
            return result;
        } catch (error) {
            this.update(dbJob.id, {
                status: "FAILED",
                error: String(error),
            });
            throw error;
        }
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
                payload = {
                    ...(prevJob.payload as object),
                    ...params.mergePayload,
                };
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
                    "updated",
                    job.observers.map((o) => o.id)
                );

                if (params.status === "DONE") {
                    this.notifyObservers(
                        job,
                        "done",
                        job.observers.map((o) => o.id)
                    );
                }

                if (params.status === "FAILED") {
                    this.notifyObservers(
                        job,
                        "failed",
                        job.observers.map((o) => o.id)
                    );
                }
            } catch (error) {
                console.error(error);
            }
        });

        return job;
    }

    async getJobsObservedByUser(userId: string) {
        return this.prismaService.job.findMany({
            where: {
                AND: [
                    {
                        parentJobId: null,
                    },
                    {
                        observers: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                ],
            },
            include: {
                childJobs: true,
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
        const { dbJob, jobInstance } = await this.create({
            name: params.name,
            description: params.description,
            type: "test",
            payload: params.payload ?? {},
            stage: params.stage,
            observers: params.observers,
        });

        let timePassed = 0;
        let lastMilestone = 0;
        const interval = setInterval(() => {
            timePassed += 500;
            const percentCompleted = Math.round(
                (timePassed / params.timeout) * 100
            );
            jobInstance.progress(percentCompleted);
            const currentMilestone = Math.floor(percentCompleted / 10) * 10;
            if (currentMilestone > lastMilestone) {
                lastMilestone = currentMilestone;
                jobInstance.stage(`Milestone ${currentMilestone}%`);
            }
        }, 500);
        setTimeout(() => {
            clearInterval(interval);
            this.update(dbJob.id, {
                status: "DONE",
                progress: 100,
            });
        }, params.timeout);
    }
}
