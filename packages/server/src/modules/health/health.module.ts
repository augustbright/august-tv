import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { HealthCheckFn } from "./types";
import { PrismaHealthIndicator } from "./prisma.health-indicator";
import { PrismaModule } from "../prisma/prisma.module";
import { HttpModule } from "@nestjs/axios";

@Module({})
export class HealthModule {
    static forRoot({
        healthIndicators,
    }: {
        healthIndicators: HealthCheckFn[];
    }) {
        return {
            module: HealthModule,
            imports: [TerminusModule, PrismaModule, HttpModule],
            controllers: [HealthController],
            providers: [
                PrismaHealthIndicator,
                {
                    provide: "HEALTH_INDICATORS",
                    useValue: healthIndicators,
                },
            ],
        };
    }
}
