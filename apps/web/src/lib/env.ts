import { z } from "zod";

function read(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) {
    return fromProcess;
  }
  try {
    const meta = import.meta.env as Record<string, string | undefined>;
    return meta[name];
  } catch {}
}

const envSchema = z.object({
  CONTACT_EMAIL: z.email().optional(),
  RESEND_API_KEY: z.string().min(1),
  SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  SPOTIFY_REFRESH_TOKEN: z.string().min(1),
});

export function getServerEnv() {
  return envSchema.parse({
    CONTACT_EMAIL: read("CONTACT_EMAIL"),
    RESEND_API_KEY: read("RESEND_API_KEY"),
    SPOTIFY_CLIENT_ID: read("SPOTIFY_CLIENT_ID"),
    SPOTIFY_CLIENT_SECRET: read("SPOTIFY_CLIENT_SECRET"),
    SPOTIFY_REFRESH_TOKEN: read("SPOTIFY_REFRESH_TOKEN"),
  });
}
