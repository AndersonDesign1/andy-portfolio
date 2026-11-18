// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { codeThemeDark, codeThemeLight } from "./src/lib/code-themes.ts";

export default defineConfig({
  adapter: vercel(),
  image: {
    remotePatterns: [
      { hostname: "mosaic.scdn.co", protocol: "https" },
      { hostname: "i.scdn.co", protocol: "https" },
      { hostname: "image-cdn-ak.spotifycdn.com", protocol: "https" },
      { hostname: "image-cdn-fa.spotifycdn.com", protocol: "https" },
      { hostname: "wrapped-images.spotifycdn.com", protocol: "https" },
    ],
  },
  integrations: [react(), mdx(), sitemap()],
  // Blog code blocks: the same WCAG AA grayscale pair as /ai answers. No
  // default colour: tokens carry --shiki-light / --shiki-dark and global.css
  // picks one per theme (the blog's <pre> supplies its own background).
  markdown: {
    shikiConfig: {
      defaultColor: false,
      themes: { dark: codeThemeDark, light: codeThemeLight },
    },
  },
  output: "static",
  // Prefetch + ClientRouter: near-instant in-site navigations.
  // ClientRouter also defaults prefetchAll; keep this explicit for non-VT pages.
  prefetch: {
    defaultStrategy: "viewport",
    prefetchAll: true,
  },
  site: "https://www.andersonjoseph.com",
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss()],
  },
});
