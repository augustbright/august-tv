import { DiskHealthIndicator, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator } from "@nestjs/terminus";
import { HealthCheckFn } from "./types";
import { PrismaHealthIndicator } from "./prisma.health-indicator";
export declare class HealthController {
    private health;
    private http;
    private prisma;
    private memory;
    private disk;
    private healthIndicators;
    constructor(health: HealthCheckService, http: HttpHealthIndicator, prisma: PrismaHealthIndicator, memory: MemoryHealthIndicator, disk: DiskHealthIndicator, healthIndicators: HealthCheckFn[]);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
