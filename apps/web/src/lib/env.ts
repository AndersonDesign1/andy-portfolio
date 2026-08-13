import { z } from "zod";

const envSchema = z.object({
  CONTACT_EMAIL: z.email().optional(),
  RESEND_API_KEY: z.string().min(1),
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_REFRESH_TOKEN: z.string().min(1),
});

export const getServerEnv = () =>
  envSchema.parse({
    CONTACT_EMAIL: process.env.CONTACT_EMAIL ?? import.meta.env.CONTACT_EMAIL,
    RESEND_API_KEY:
      process.env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY,
    SPOTIFY_CLIENT_ID:
      process.env.SPOTIFY_CLIENT_ID ?? import.meta.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET:
      process.env.SPOTIFY_CLIENT_SECRET ??
      import.meta.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN:
      process.env.SPOTIFY_REFRESH_TOKEN ??
      import.meta.env.SPOTIFY_REFRESH_TOKEN,
  });
