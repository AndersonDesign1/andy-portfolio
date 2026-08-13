// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  adapter: vercel(),
  image: {
    domains: ["cdn.sanity.io", "mosaic.scdn.co", "i.scdn.co"],
    remotePatterns: [
      { hostname: "cdn.sanity.io", protocol: "https" },
      { hostname: "mosaic.scdn.co", protocol: "https" },
      { hostname: "i.scdn.co", protocol: "https" },
    ],
  },
  integrations: [react(), sitemap()],
  output: "static",
  site: "https://www.andersonjoseph.com",
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss()],
  },
});
