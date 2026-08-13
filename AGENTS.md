# AGENTS.md

## Cursor Cloud specific instructions

This is a Bun + Turbo monorepo (`andy-portfolio`) with two runnable apps and one shared package:

- `apps/web` — Next.js 16 (App Router, Turbopack) portfolio + blog. Dev on `http://localhost:3000`.
- `apps/studio` — Sanity Studio CMS. Dev on `http://localhost:3333`.
- `packages/sanity-config` — shared Sanity schemas/client (no build/lint/test scripts).

### Package manager

The package manager is Bun (pinned to `bun@1.1.38` in root `package.json`). It is installed on the VM and symlinked to `/usr/local/bin/bun`, so it is on `PATH` in non-interactive shells. Dependencies are refreshed automatically by the startup update script (`bun install`).

### Common commands (see root `package.json` / `turbo.json`)

- Run everything in dev: `bun dev` (turbo runs `next dev` + `sanity dev` together).
- Lint: `bun lint` (only `apps/web` has a lint task; runs `biome check .`).
- Format: `bun format`.
- There is no automated test suite in this repo (no `test` scripts).

### Non-obvious caveats

- `bun run build` currently fails at the TypeScript type-check step in `apps/web/src/components/ui/button.tsx` (a pre-existing radix `Slot` vs button-props type mismatch). This is a source/type issue, not an environment problem, and does not affect `bun dev` — the dev server compiles and serves pages normally. The `apps/studio` build succeeds.
- Env is read from `.env.local` at the repo root **and** copied to `apps/web/.env.local` and `apps/studio/.env.local` (Next.js and Sanity load from their app dirs). Those files are gitignored. Cloud Agent secrets are injected into the process environment; write them into those `.env.local` files and restart `bun dev` after secrets change. Restart is required — Next/Sanity do not reliably pick up new env files on an already-running `bun dev`.
- `apps/web/src/lib/env.ts` validates `SPOTIFY_*` and `RESEND_API_KEY` with Zod and throws at import time if they are missing. Those vars are only imported by the Spotify/email routes and server actions, so missing values only break those specific routes — not the whole site.
- Homepage, projects, and work-history content come from static JSON in `apps/web/src/data`. Blog posts come from Sanity; `/blog` is wrapped in try/catch and falls back to an empty list if Sanity is unreachable.
- `SANITY_STUDIO_PROJECT_ID` must be the same 8-character Sanity project id as `NEXT_PUBLIC_SANITY_PROJECT_ID`. If they differ, Studio gets `404` from the Sanity API. Point Studio at the web project id. Studio still requires a Sanity login in the browser to edit content.
- Resend API calls from this Cloud Agent network may be blocked by Cloudflare (HTTP 1010) even with a valid `re_…` key. That is egress filtering, not necessarily a bad key. Spotify `/api/spotify/now-playing` authenticates successfully; `{"isPlaying":false}` with no track is a valid idle player response.
- After editing files, a `.cursor/hooks.json` `afterFileEdit` hook runs `bun x ultracite fix` (Biome auto-format). CI (`.github/workflows/lint.yml`) fails if `bun run fix`/`bun run lint:fix` in `apps/web` produce uncommitted changes, so keep the web app formatted.
