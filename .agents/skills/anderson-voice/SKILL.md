---
name: anderson-voice
description: >-
  Write, rewrite, or audit portfolio copy, case studies, project blurbs, About
  chapters, and blog posts in Anderson Joseph's natural, plain, story-first
  voice. Use whenever drafting or editing public-facing copy for
  andersonjoseph.com.
---

# Anderson's Voice & Storyline Guide

Use this skill whenever writing or revising copy for Anderson Joseph's portfolio (`apps/web`, `packages/content`). Incorporates the core writing rules from `blader/humanizer` (v4.0.0) tuned to Anderson's actual blog voice.

## Identity & Audience

- **Who Anderson is:** A product engineer working from Nigeria with teams anywhere. He builds web interfaces, full-stack products, and tools built for AI agents (like Graft and Andy's AI), plus open-source utilities like Smol.
- **Who is reading:** A mix of founders/clients, hiring teams, and fellow builders skimming quickly.
- **The goal:** Short, plain, real mini-stories. Readers should skim effortlessly, picture what happened, and hear an actual person.

## Core Rules

1. **Keep it tiny and skimmable.** Prefer 1 to 2 short sentences per block. If a reader has to slow down to parse a paragraph, cut it in half.
2. **Use plain, everyday words.** Write like you talk. Skip corporate or technical filler ("crawlability", "bottleneck", "underperforming", "stakeholders", "turning point", "seamless").
3. **Refer to clients by brand name.** Never refer to a client or founder as "she", "he", "her", or "his". Always use the brand name (`Tare Gems`, `MykroGrid`, `Welup Digital`, `PromptEarn`, `Flik`).
4. **Lead with outcomes, not tech stacks.** Focus on what was broken, what Anderson built, and what changed—never list framework/library stacks that box him into one toolset.
5. **Show what changed, briefly.** Give the real before and after in plain terms (e.g., WhatsApp DMs to automatic checkout; an old site getting DDoSed to a fast rebuild).
6. **No em dashes (`—`) or en dashes (`–`) in prose.** Use periods, commas, or colons instead. (Date ranges like `2021 – now` are fine.)
7. **Cut AI writing tells (from `blader/humanizer`):**
   - **No "not X, but Y" staging.** State the point directly instead of setting up a fake contrast.
   - **No forced triads.** Don't pack three parallel items into every sentence just for rhythm.
   - **No staged run-ups or dramatic one-line closers.** Cut lines that announce a point or repeat what the sentence before already showed.
   - **No generic aphorisms** ("Launch day isn't the finish line", "feel right in the hand", "with the same care at both ends").
   - **No repeated slogans across pages.** Home, About, Footer, and Contact should each say one simple, distinct thing.
8. **Keep pronouns consistent.** First person ("I", "my") on the site; third person only in `<meta>` tags and `ASK_SUGGESTIONS`.

## Length Targets

| Surface                                                          | Target                                                                 |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Home Hero** (`apps/web/src/pages/index.astro`)                 | Short H1 (under 10 words) + 2 short sentences in the lede.             |
| **Selected Work** (`apps/web/src/data/work.ts`)                  | 1 to 2 short sentences (`outcome`). Wrap key figures or wins in `<b>`. |
| **What I do** (`apps/web/src/pages/index.astro`)                 | 1 to 2 short plain sentences per column.                               |
| **About chapters** (`apps/web/src/pages/about.astro`)            | 2 short sentences per chapter. Real story beats, zero fluff.           |
| **Case studies** (`packages/content/content/case-studies/*.mdx`) | 2 short sentences per step. Plain facts, clear before and after.       |
| **Footer & Contact** (`site-footer.astro`, `contact.astro`)      | 1 to 2 simple, human sentences.                                        |

## Two-Pass Check

1. **Draft simply:** State what happened in plain words using brand names and short sentences.
2. **Humanizer pass:** Strip every em dash, cut any forced three-item list, remove any "not X, but Y" contrast, and trim any sentence that repeats a fact already stated.
3. **Verify:** Run `bun run --filter=@andy-portfolio/content compile` (if content changed), `bun run --filter=@andy-portfolio/web lint`, and `bun run --filter=@andy-portfolio/web typecheck`.
