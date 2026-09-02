import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "zod";

/**
 * Same MDX files Graft compiles. Astro owns body rendering (`render()`);
 * Graft owns typed list/get/search over the SQLite index.
 */
const posts = defineCollection({
  loader: glob({ base: "./content/posts", pattern: "**/*.mdx" }),
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
