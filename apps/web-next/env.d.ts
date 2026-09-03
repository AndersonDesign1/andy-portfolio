export {};

declare global {
  // biome-ignore lint/style/noNamespace: "ProcessEnv needs to be augmented"
  namespace NodeJS {
    interface ProcessEnv {
      CONTACT_EMAIL?: string;
      // Next.js environment
      NODE_ENV: "development" | "production" | "test"; // pragma: allowlist secret

      // Resend environment variables
      RESEND_API_KEY: string;
      RESEND_WEBHOOK_SECRET?: string;

      // Spotify environment variables
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      SPOTIFY_REFRESH_TOKEN: string;
    }
  }
}
