import { INestApplication } from "@nestjs/common";
export { createServerLogger } from "./utils/logger";
export declare const gracefulShutdown: (app: INestApplication) => void;
