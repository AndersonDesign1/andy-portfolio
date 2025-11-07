import { z } from "zod";

// Environment variable validation schema
const envSchema = z.object({
  // Spotify API
  SPOTIFY_CLIENT_ID: z.string().min(1, "Spotify Client ID is required"),
  SPOTIFY_CLIENT_SECRET: z.string().min(1, "Spotify Client Secret is required"),
  SPOTIFY_REFRESH_TOKEN: z.string().min(1, "Spotify Refresh Token is required"),

  // Email service
  RESEND_API_KEY: z.string().min(1, "Resend API Key is required"),

  // Contact
  CONTACT_EMAIL: z.string().email().optional(),

  // Next.js
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Parse and validate environment variables
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

// Export validated environment variables
export const env = validateEnv();
