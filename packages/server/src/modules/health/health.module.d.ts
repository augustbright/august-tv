import { HealthController } from "./health.controller";
import { HealthCheckFn } from "./types";
import { PrismaHealthIndicator } from "./prisma.health-indicator";
import { PrismaModule } from "../prisma/prisma.module";
export declare class HealthModule {
    static forRoot({ healthIndicators, }: {
        healthIndicators: HealthCheckFn[];
    }): {
        module: typeof HealthModule;
        imports: (typeof PrismaModule)[];
        controllers: (typeof HealthController)[];
        providers: (typeof PrismaHealthIndicator | {
            provide: string;
            useValue: HealthCheckFn[];
        })[];
    };
}
