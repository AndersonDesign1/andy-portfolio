/**
 * Schema for the Astro blog. Agents: this is the source of truth for posts.
 * Author documents in content/posts/<slug>.mdx; frontmatter must match.
 *
 * Primitives from `graft add` live under graft/ and merge in via graft/index.ts.
 */
import { defineCollection, field, mergePrimitives } from "@usegraft/core";

import * as primitives from "./graft";

const MAX_TITLE_LENGTH = 100;
const MAX_EXCERPT_LENGTH = 200;
const MAX_SEO_TITLE_LENGTH = 60;
const MAX_SEO_DESCRIPTION_LENGTH = 160;

// Static SQLite artifact at .graft/index.db — no database, no env vars.
export const index = "static";

/** Authored bodies are prose. Refuse executable MDX constructs at compile. */
export const mdxTrust = "restricted";

export const posts = defineCollection({
  description: "Blog posts rendered at /blog/<slug>.",
  fields: {
    categories: field.array({
      description:
        "Category labels shown on the post (titles, not references).",
      maxItems: 20,
      of: field.string(),
      optional: true,
    }),
    excerpt: field.text({
      description: "Short summary for the listing, meta description, and OG.",
      maxLength: MAX_EXCERPT_LENGTH,
    }),
    mainImage: field.object({
      description: "Hero image. Paths are site-root URLs under /blog/<slug>/.",
      fields: {
        alt: field.string({
          description: "Alternative text for SEO and accessibility.",
        }),
        caption: field.string({
          description: "Optional caption under the hero.",
          optional: true,
        }),
        src: field.string({
          description: "Public path, e.g. /blog/my-post/hero.jpg.",
        }),
      },
      optional: true,
    }),
    publishedAt: field.datetime({
      description: "ISO-8601 publish time (e.g. 2026-01-15T12:00:00.000Z).",
    }),
    seoDescription: field.text({
      description: "Meta description when different from the excerpt.",
      maxLength: MAX_SEO_DESCRIPTION_LENGTH,
      optional: true,
    }),
    seoTitle: field.string({
      description: "Title used for SEO when different from the headline.",
      maxLength: MAX_SEO_TITLE_LENGTH,
      optional: true,
    }),
    title: field.string({
      description: "Post headline and default <title>.",
      maxLength: MAX_TITLE_LENGTH,
    }),
  },
  name: "posts",
});

export const { collections, functions } = mergePrimitives([
  { collections: { posts } },
  primitives,
]);
