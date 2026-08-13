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
- Env is read from `.env.local`. This environment has no real Sanity/Spotify/Resend credentials; a `.env.local` with placeholder values exists so the dev servers boot and env-validated modules don't crash on import.
- `apps/web/src/lib/env.ts` validates `SPOTIFY_*` and `RESEND_API_KEY` with Zod and throws at import time if they are missing. Those vars are only imported by the Spotify/email routes and server actions, so missing values only break those specific routes — not the whole site. The placeholders in `.env.local` keep them from throwing.
- Homepage, projects, and work-history content come from static JSON in `apps/web/src/data`, so the site renders fully without a real Sanity project. The `/blog` route fetches from Sanity but is wrapped in try/catch and falls back to an empty list, so it renders (0 posts) without valid Sanity credentials.
- The Studio (`sanity dev`) boots with a placeholder `SANITY_STUDIO_PROJECT_ID`, but loading/editing real content requires a real Sanity project ID and login.
- After editing files, a `.cursor/hooks.json` `afterFileEdit` hook runs `bun x ultracite fix` (Biome auto-format). CI (`.github/workflows/lint.yml`) fails if `bun run fix`/`bun run lint:fix` in `apps/web` produce uncommitted changes, so keep the web app formatted.
