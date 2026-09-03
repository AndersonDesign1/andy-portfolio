import { z } from "zod";

const optionalEmail = z.preprocess((value) => {
  const parsed = z.string().optional().safeParse(value);
  if (!(parsed.success && parsed.data)) {
    return;
  }
  const trimmed = parsed.data.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.email().optional());

const readEnv = (key: string): string | undefined => {
  const raw = process.env[key];
  const parsed = z.string().optional().safeParse(raw);
  if (!(parsed.success && parsed.data)) {
    return undefined;
  }
  const trimmed = parsed.data.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const spotifyEnvSchema = z.object({
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_REFRESH_TOKEN: z.string().min(1),
});

const resendEnvSchema = z.object({
  CONTACT_EMAIL: optionalEmail,
  RESEND_API_KEY: z.string().min(1),
});

/** Spotify API routes — parse on request, not at import (CI has no secrets). */
export const getSpotifyEnv = () =>
  spotifyEnvSchema.parse({
    SPOTIFY_CLIENT_ID: readEnv("SPOTIFY_CLIENT_ID"),
    SPOTIFY_CLIENT_SECRET: readEnv("SPOTIFY_CLIENT_SECRET"),
    SPOTIFY_REFRESH_TOKEN: readEnv("SPOTIFY_REFRESH_TOKEN"),
  });

/** Contact action + giveaway mailers. */
export const getResendEnv = () =>
  resendEnvSchema.parse({
    CONTACT_EMAIL: readEnv("CONTACT_EMAIL"),
    RESEND_API_KEY: readEnv("RESEND_API_KEY"),
  });
