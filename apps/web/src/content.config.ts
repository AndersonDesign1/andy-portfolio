import { fileURLToPath } from "node:url";

import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "zod";

/**
 * Same MDX files Graft compiles in `@andy-portfolio/content`.
 * Astro owns body rendering (`render()`); Graft owns typed list/get/search.
 */
const posts = defineCollection({
  loader: glob({
    base: fileURLToPath(
      new URL("../../../packages/content/content/posts", import.meta.url)
    ),
    pattern: "**/*.mdx",
  }),
  schema: z.object({
    categories: z.array(z.string()).optional(),
    excerpt: z.string(),
    mainImage: z
      .object({
        alt: z.string(),
        caption: z.string().optional(),
        src: z.string(),
      })
      .optional(),
    publishedAt: z.string(),
    seoDescription: z.string().optional(),
    seoTitle: z.string().optional(),
    title: z.string(),
  }),
});

export const collections = { posts };
