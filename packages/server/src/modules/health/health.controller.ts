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
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly prisma: PrismaHealthIndicator,
        private readonly memory: MemoryHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        @Inject("HEALTH_INDICATORS")
        private readonly healthIndicators: HealthCheckFn[]
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
