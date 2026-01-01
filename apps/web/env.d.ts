export {};

declare global {
  // biome-ignore lint/style/noNamespace: "ProcessEnv needs to be augmented"
  namespace NodeJS {
    interface ProcessEnv {
      // Next.js environment
      NODE_ENV: "development" | "production" | "test";

      // Sanity environment variables
      NEXT_PUBLIC_SANITY_PROJECT_ID: string;
      NEXT_PUBLIC_SANITY_DATASET: string;
      SANITY_API_TOKEN?: string;

      // Resend environment variables
      RESEND_API_KEY: string;
      RESEND_WEBHOOK_SECRET?: string;
      CONTACT_EMAIL?: string;

      // Spotify environment variables
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      SPOTIFY_REFRESH_TOKEN: string;
    }
  }
}
