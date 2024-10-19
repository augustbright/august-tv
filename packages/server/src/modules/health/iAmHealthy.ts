import { NestFactory } from "@nestjs/core";
import { HealthModule } from "./health.module";
import { HealthCheckFn } from "./types";

export async function iAmHealthy(
    port: number,
    healthIndicators: HealthCheckFn[] = []
) {
    const healthServerApp = await NestFactory.create(
        HealthModule.forRoot({ healthIndicators })
    );
    await healthServerApp.listen(port);
}
