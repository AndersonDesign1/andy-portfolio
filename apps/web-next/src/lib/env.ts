import { z } from "zod";

const envSchema = z.object({
  CONTACT_EMAIL: z.email().optional(),

  NODE_ENV: z
    .enum(["development", "production", "test"]) // pragma: allowlist secret
    .default("development"),

  RESEND_API_KEY: z.string().min(1, "Resend API Key is required"),
  SPOTIFY_CLIENT_ID: z.string().min(1, "Spotify Client ID is required"),
  SPOTIFY_CLIENT_SECRET: z.string().min(1, "Spotify Client Secret is required"),
  SPOTIFY_REFRESH_TOKEN: z.string().min(1, "Spotify Refresh Token is required"),
});

function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        `Environment validation failed:\n${missingVars.join("\n")}`
      );
    }
    throw error;
  }
}

export const env = validateEnv();
