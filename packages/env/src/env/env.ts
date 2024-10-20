import { init } from "./init";
init();
import { z } from "zod";

export const envSchema = z.object({
    DUMMY_HOST: z.string({
        required_error: "Missing DUMMY_HOST environment variable",
    }),
    DUMMY_PORT: z
        .string({
            required_error: "Missing DUMMY_PORT environment variable",
        })
        .transform(Number)
        .refine((val) => val > 0, {
            message: `DUMMY_PORT must be a positive number`,
        }),

    REST_HOST: z.string({
        required_error: "Missing REST_HOST environment variable",
    }),
    REST_PORT: z
        .string({
            required_error: "Missing REST_PORT environment variable",
        })
        .transform(Number)
        .refine((val) => val > 0, {
            message: `REST_PORT must be a positive number`,
        }),

    YOUTUBE_IMPORTER_HOST: z.string({
        required_error: "Missing YOUTUBE_IMPORTER_HOST environment variable",
    }),
    YOUTUBE_IMPORTER_PORT: z
        .string({
            required_error:
                "Missing YOUTUBE_IMPORTER_PORT environment variable",
        })
        .transform(Number)
        .refine((val) => val > 0, {
            message: `YOUTUBE_IMPORTER_PORT must be a positive number`,
        }),

    VIDEO_TRANSCODER_HOST: z.string({
        required_error: "Missing VIDEO_TRANSCODER_HOST environment variable",
    }),
    VIDEO_TRANSCODER_PORT: z
        .string({
            required_error:
                "Missing VIDEO_TRANSCODER_PORT environment variable",
        })
        .transform(Number)
        .refine((val) => val > 0, {
            message: `VIDEO_TRANSCODER_PORT must be a positive number`,
        }),

    GOOGLE_CLOUD_PROJECT_ID: z.string({
        required_error: "Missing GOOGLE_CLOUD_PROJECT_ID environment variable",
    }),
    GOOGLE_CLOUD_MEDIA_BUCKET_NAME: z.string({
        required_error:
            "Missing GOOGLE_CLOUD_MEDIA_BUCKET_NAME environment variable",
    }),
    GOOGLE_CLOUD_MEDIA_BUCKET_LOCATION: z.string({
        required_error:
            "Missing GOOGLE_CLOUD_MEDIA_BUCKET_LOCATION environment variable",
    }),
    GOOGLE_APPLICATION_CREDENTIALS: z.string({
        required_error:
            "Missing GOOGLE_APPLICATION_CREDENTIALS environment variable",
    }),

    YOUTUBE_API_URL: z.string({
        required_error: "Missing YOUTUBE_API_URL environment variable",
    }),
    YOUTUBE_API_KEY: z.string({
        required_error: "Missing YOUTUBE_API_KEY environment variable",
    }),

    KAFKA_BROKER: z.string({
        required_error: "Missing KAFKA_BROKER environment variable",
    }),
    DATABASE_URL: z.string({
        required_error: "Missing DATABASE_URL environment variable",
    }),
    TMP_DIR: z.string({
        required_error: "Missing TMP_DIR environment variable",
    }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    process.exit(1);
}

export const env = parsedEnv.data;
export const rawEnv = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key, String(value)])
);
