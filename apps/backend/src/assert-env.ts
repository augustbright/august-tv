import { z } from 'zod';

export const envSchema = z.object({
  BACKEND_PORT: z
    .string({
      required_error: 'Missing PORT environment variable',
    })
    .transform(Number)
    .refine((val) => val > 0, {
      message: `PORT must be a positive number`,
    }),

  GOOGLE_CLOUD_PROJECT_ID: z.string({
    required_error: 'Missing GOOGLE_CLOUD_PROJECT_ID environment variable',
  }),
  GOOGLE_CLOUD_MEDIA_BUCKET_NAME: z.string({
    required_error:
      'Missing GOOGLE_CLOUD_MEDIA_BUCKET_NAME environment variable',
  }),
  GOOGLE_CLOUD_MEDIA_BUCKET_LOCATION: z.string({
    required_error:
      'Missing GOOGLE_CLOUD_MEDIA_BUCKET_LOCATION environment variable',
  }),
  GOOGLE_APPLICATION_CREDENTIALS: z.string({
    required_error:
      'Missing GOOGLE_APPLICATION_CREDENTIALS environment variable',
  }),

  YOUTUBE_API_URL: z.string({
    required_error: 'Missing YOUTUBE_API_URL environment variable',
  }),
  YOUTUBE_API_KEY: z.string({
    required_error: 'Missing YOUTUBE_API_KEY environment variable',
  }),

  KAFKA_BROKER: z.string({
    required_error: 'Missing KAFKA_BROKER environment variable',
  }),
  DATABASE_URL: z.string({
    required_error: 'Missing DATABASE_URL environment variable',
  }),
});

// eslint-disable-next-line no-restricted-syntax
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  process.exit(1); // Stop the process if env variables are invalid
}

export const env = parsedEnv.data;
