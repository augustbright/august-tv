import { Controller, Get, Inject } from "@nestjs/common";
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
} from "@nestjs/terminus";
import { Guard } from "../../utils";
import { HealthCheckFn } from "./types";
import { PrismaHealthIndicator } from "./prisma.health-indicator";

@Controller("health")
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private prisma: PrismaHealthIndicator,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator,
        @Inject("HEALTH_INDICATORS")
        private healthIndicators: HealthCheckFn[]
    ) {}

    @Get()
    @HealthCheck()
    @Guard.scope("public")
    check() {
        return this.health.check(
            this.healthIndicators.map((fn) =>
                fn.bind(null, {
                    http: this.http,
                    prisma: this.prisma,
                    memory: this.memory,
                    disk: this.disk,
                })
            )
        );
    }
}
