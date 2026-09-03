/**
 * Schema for the Astro site. Agents: this is the source of truth for posts,
 * projects, and case studies. Author documents in content/<collection>/<slug>.mdx;
 * frontmatter must match.
 *
 * Primitives from `graft add` live under graft/ and merge in via graft/index.ts.
 */
import { defineCollection, field, mergePrimitives } from "@usegraft/core";

import * as primitives from "./graft";

const MAX_EXCERPT_LENGTH = 200;
const MAX_HEADING_LENGTH = 120;
const MAX_LABEL_LENGTH = 80;
const MAX_LINE_LENGTH = 200;
const MAX_PATH_LENGTH = 300;
const MAX_PROSE_LENGTH = 2000;
const MAX_SEO_DESCRIPTION_LENGTH = 160;
const MAX_SEO_TITLE_LENGTH = 60;
const MAX_TITLE_LENGTH = 100;

const lines = (description: string, maxItems: number) =>
  field.array({
    description,
    maxItems,
    of: field.string({ maxLength: MAX_LINE_LENGTH }),
  });

const pathString = (description: string) =>
  field.string({
    description,
    maxLength: MAX_PATH_LENGTH,
  });

const optionalPath = (description: string) =>
  field.string({
    description,
    maxLength: MAX_PATH_LENGTH,
    optional: true,
  });

const prose = (description: string) =>
  field.text({
    description,
    maxLength: MAX_PROSE_LENGTH,
  });

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

export const projects = defineCollection({
  description: "Portfolio entries listed on / and /projects.",
  fields: {
    description: prose("Short summary shown on the home and projects grids."),
    featured: field.boolean({
      description: "When true, the project appears in Selected Works on /.",
      optional: true,
    }),
    links: field.object({
      description: "Outbound and in-site destinations for this project.",
      fields: {
        caseStudy: optionalPath(
          "In-site case study path, e.g. /case-studies/welup-digital."
        ),
        github: optionalPath("Optional source repository URL."),
        live: optionalPath("Live site URL."),
      },
    }),
    metrics: field.array({
      description: "Optional highlight stats (label + value).",
      maxItems: 12,
      of: field.object({
        fields: {
          label: field.string({
            description: "Metric name, e.g. Organic Traffic.",
            maxLength: MAX_LABEL_LENGTH,
          }),
          value: field.string({
            description: "Metric value shown next to the label.",
            maxLength: MAX_LINE_LENGTH,
          }),
        },
      }),
      optional: true,
    }),
    order: field.number({
      description:
        "Display order (lower first). Matches the former JSON array.",
      int: true,
      max: 1000,
      min: 1,
    }),
    techStack: field.array({
      description:
        "Technologies listed on cards and used for category filters.",
      maxItems: 24,
      of: field.string({ maxLength: MAX_LABEL_LENGTH }),
    }),
    thumbnail: pathString("Public path for the card / hover image."),
    title: field.string({
      description: "Project name shown on / and /projects.",
      maxLength: MAX_HEADING_LENGTH,
    }),
    type: field.string({
      description: 'Either "case-study" or "standard".',
      maxLength: 20,
      pattern: /^(?<kind>case-study|standard)$/u,
    }),
  },
  name: "projects",
});

export const caseStudies = defineCollection({
  description: "Long-form case studies rendered at /case-studies/<slug>.",
  fields: {
    approach: field.object({
      description: "How the work was planned and executed.",
      fields: {
        collaboration: prose("Who you worked with."),
        iterations: lines("What changed across rounds of work.", 12),
        keyDecisions: field.array({
          description: "Choices that shaped the outcome.",
          maxItems: 12,
          of: field.object({
            fields: {
              decision: field.string({
                description: "The choice that was made.",
                maxLength: MAX_LINE_LENGTH,
              }),
              rationale: field.string({
                description: "Why that choice was made.",
                maxLength: MAX_LINE_LENGTH,
              }),
            },
          }),
        }),
        methodology: prose("Overview of the process."),
        phases: field.array({
          description: "Named stages with activities.",
          maxItems: 12,
          of: field.object({
            fields: {
              activities: lines("Work done in this phase.", 12),
              duration: field.string({
                description: "How long this phase ran.",
                maxLength: MAX_LABEL_LENGTH,
              }),
              name: field.string({
                description: "Phase title.",
                maxLength: MAX_LABEL_LENGTH,
              }),
            },
          }),
        }),
        research: lines("Research inputs.", 12),
        userFeedback: prose("What users or stakeholders said."),
        wireframes: field.array({
          description: "Optional wireframe image paths.",
          maxItems: 12,
          of: field.string({ maxLength: MAX_PATH_LENGTH }),
          optional: true,
        }),
      },
    }),
    challenge: field.object({
      description: "The problem the engagement started from.",
      fields: {
        constraints: lines("Limits on time, people, or platform.", 12),
        context: prose("Business or technical backdrop."),
        metrics: lines("Starting measurements.", 12),
        problem: prose("The core problem statement."),
      },
    }),
    gallery: field.object({
      description: "Screens and artifacts shown at the bottom of the page.",
      fields: {
        images: field.array({
          description:
            "Gallery frames. Paths are site-root URLs under public/.",
          maxItems: 24,
          of: field.object({
            fields: {
              alt: field.string({
                description: "Alternative text.",
                maxLength: MAX_LINE_LENGTH,
              }),
              src: pathString("Public path, e.g. /welup-main.png."),
              title: field.string({
                description: "Caption shown under the frame.",
                maxLength: MAX_HEADING_LENGTH,
              }),
            },
          }),
        }),
      },
    }),
    goals: field.object({
      description: "What success looked like going in.",
      fields: {
        primary: lines("Primary goals.", 12),
        stakeholder: lines("Stakeholder goals.", 12),
        success: lines("Success criteria.", 12),
      },
    }),
    hero: field.object({
      description: "Title block at the top of the case study.",
      fields: {
        client: field.string({
          description: "Client or company name.",
          maxLength: MAX_HEADING_LENGTH,
        }),
        duration: field.string({
          description: "Engagement length, e.g. 6 months.",
          maxLength: MAX_LABEL_LENGTH,
        }),
        heroImage: pathString("Public path for the hero image."),
        liveUrl: optionalPath("Optional live site URL."),
        overview: prose("One-paragraph summary used as the meta description."),
        technologies: field.array({
          description: "Tools and platforms listed in the hero.",
          maxItems: 24,
          of: field.string({ maxLength: MAX_LABEL_LENGTH }),
        }),
        title: field.string({
          description: "Case study headline and default <title>.",
          maxLength: MAX_HEADING_LENGTH,
        }),
      },
    }),
    order: field.number({
      description: "Prev/next order (lower first).",
      int: true,
      max: 1000,
      min: 1,
    }),
    results: field.object({
      description: "Measured outcomes.",
      fields: {
        achievements: lines("Narrative wins.", 12),
        beforeAfter: field.array({
          description: "Before → after metric pairs.",
          maxItems: 12,
          of: field.object({
            fields: {
              after: field.string({
                description: "Value after the work.",
                maxLength: MAX_LABEL_LENGTH,
              }),
              before: field.string({
                description: "Value before the work.",
                maxLength: MAX_LABEL_LENGTH,
              }),
              improvement: field.string({
                description: "Short delta label, e.g. +250%.",
                maxLength: MAX_LABEL_LENGTH,
              }),
              metric: field.string({
                description: "What was measured.",
                maxLength: MAX_LABEL_LENGTH,
              }),
            },
          }),
        }),
        deliverables: lines("What shipped.", 12),
        metrics: lines("Highlight stats under the before/after grid.", 12),
        testimonials: field.array({
          description: "Optional quotes. Not all studies have these.",
          maxItems: 8,
          of: field.object({
            fields: {
              name: field.string({
                description: "Attribution name.",
                maxLength: MAX_HEADING_LENGTH,
              }),
              quote: prose("The quote itself."),
              role: field.string({
                description: "Attribution role or company.",
                maxLength: MAX_HEADING_LENGTH,
              }),
            },
          }),
          optional: true,
        }),
      },
    }),
  },
  name: "case-studies",
});

export const { collections, functions } = mergePrimitives([
  { collections: { "case-studies": caseStudies, posts, projects } },
  primitives,
]);
