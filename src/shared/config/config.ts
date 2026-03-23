import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number(),
    NODE_ENV: z.enum(['development', 'production']),
    SERVER_URL: z.string(),
    CORS_ORIGIN: z.string(),
    MONGO_URI: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:', parsed.error.issues);
    process.exit(1);
}

const env = parsed.data;

export const config = {
    server: {
        port: env.PORT,
        nodeEnv: env.NODE_ENV,
        serverUrl: env.SERVER_URL,
        corsOrigin: env.CORS_ORIGIN,
        isDev: env.NODE_ENV === 'development',
        isProd: env.NODE_ENV === 'production',
    },
    db: {
        mongoUri: env.MONGO_URI,
    },
} as const;
