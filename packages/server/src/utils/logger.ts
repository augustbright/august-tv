import { WinstonModule, WinstonModuleOptions } from "nest-winston";
import winston from "winston";

export const createServerLogger = (
    tag: string,
    options?: WinstonModuleOptions
) => {
    const logger = WinstonModule.createLogger({
        ...options,
        transports: [
            new winston.transports.File({
                filename: `logs/${tag}-error.log`,
                level: "error",
            }),
            new winston.transports.File({
                filename: `logs/${tag}-combined.log`,
            }),

            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.printf(
                        ({ context, message }) => `${context}: ${message}`
                    )
                ),
            }),
        ],
    });

    process.on("uncaughtException", (err) => {
        logger.error(
            "Application is crashing due to uncaught exception",
            err,
            err.stack
        );
        process.exit(1);
    });

    return logger;
};
