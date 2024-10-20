import { env } from "@august-tv/env";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { createServerLogger } from "./utils";
import { iAmHealthy } from "./iAmHealthy";

export { createServerLogger } from "./utils/logger";

export const gracefulShutdown = (app: INestApplication) => {
    process.on("SIGINT", async () => {
        console.log("Received SIGINT, closing app...");
        await app.close();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        console.log("Received SIGTERM, closing app...");
        await app.close();
        process.exit(0);
    });
};

export async function bootstrapMicroservice({
    AppModule,
    port,
    tag,
}: {
    AppModule: any;
    tag: string;
    port: number;
}) {
    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.KAFKA,
        logger: createServerLogger("dummy"),
        options: {
            client: {
                brokers: [env.KAFKA_BROKER],
            },
            consumer: {
                groupId: `${tag}-consumer`,
            },
        },
    });
    await app.listen();

    await iAmHealthy(port);
}
