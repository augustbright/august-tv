import { HealthIndicatorResult } from "@nestjs/terminus";
import {
    DiskHealthIndicator,
    HttpHealthIndicator,
    MemoryHealthIndicator,
} from "@nestjs/terminus";
import { PrismaHealthIndicator } from "./prisma.health-indicator";

export type HealthCheckFn = (indicators: {
    disk: DiskHealthIndicator;
    http: HttpHealthIndicator;
    memory: MemoryHealthIndicator;
    prisma: PrismaHealthIndicator;
}) => PromiseLike<HealthIndicatorResult>;
