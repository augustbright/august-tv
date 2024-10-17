import { INestApplication } from "@nestjs/common";

export { env } from "./env";

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
