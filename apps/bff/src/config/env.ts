import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  STRAVA_CLIENT_ID: z.string().min(1, "STRAVA_CLIENT_ID is required"),
  STRAVA_CLIENT_SECRET: z.string().min(1, "STRAVA_CLIENT_SECRET is required"),
  STRAVA_REDIRECT_URI: z
    .string()
    .url("STRAVA_REDIRECT_URI must be a valid URL"),

  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
  SESSION_NAME: z.string().default("strava_tracker_session"),

  REDIS_URL: z.string().optional(),
  USE_REDIS_SESSION: z
    .string()
    .transform((val) => val === "true")
    .default("false"),

  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),

  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      throw new Error(
        `Environment configuration error:\n${missingVars}\n\nPlease check your .env file.`,
      );
    }
    throw error;
  }
};

const rawEnv = parseEnv();

export const env = {
  ...rawEnv,
  CORS_ORIGIN: new URL(rawEnv.FRONTEND_URL).origin,
};
