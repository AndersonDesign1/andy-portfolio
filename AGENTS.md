# AGENTS.md

## Cursor Cloud specific instructions

Bun + Turbo monorepo (`andy-portfolio`), Astro-primary after cutover:

| App | Path | Dev port | Role |
| --- | --- | --- | --- |
| Web (primary) | `apps/web` | `3000` | Astro 7 + React islands + `@astrojs/vercel` |
| Web (archive) | `apps/web-next` | `3001` | Next.js 16.3 reference — keep buildable; do not treat as primary |
| Studio | `apps/studio` | `3333` | Sanity CMS (binds `localhost` / IPv6; use `http://localhost:3333`, not `127.0.0.1`) |
| Shared | `packages/sanity-config` | — | Framework-agnostic Sanity schemas/client |

### Package manager

Bun pinned to `bun@1.3.14` in root `package.json` (Cloud Agent / CI / Vercel should match). Startup update script runs `bun install`. Keep the text `bun.lock` in sync — Bun 1.3+ uses `bun.lock` (not `bun.lockb`); a stale/hand-patched lockfile breaks `--frozen-lockfile` and Vercel installs.

### Common commands

See root `package.json` / `turbo.json`: `bun dev`, `bun lint`, `bun format` / `ultracite fix`. No automated test suite.

App-scoped:

- Astro: `bun run --filter=@andy-portfolio/web dev|build|lint|typecheck`
- Next archive: `bun run --filter=@andy-portfolio/web-next dev|build|lint` (port **3001**)
- Studio: `bun run --filter=@andy-portfolio/studio dev`

Astro typecheck uses `@astrojs/check` via `bun run --filter=@andy-portfolio/web typecheck` (or `cd apps/web && bun run typecheck`). Non-interactive; do not run bare `astro check` prompts that try to install deps.

### Astro app notes (`apps/web`)

- Ultracite **7.10.3** + **Oxlint** / **Oxfmt** (`apps/web/oxlint.config.ts`, `oxfmt.config.ts`) with `ultracite/oxlint/{core,astro,react}` plus `oxlint-plugin-react-doctor`. Lint/fix: `bun run --filter=@andy-portfolio/web lint` / `lint:fix` (aliases for `ultracite check` / `fix`). Next archive still uses Biome.
- Oxlint TS configs need **Node ^20.19 or ≥22.18** on `PATH` (loading `oxlint.config.ts` / `oxfmt.config.ts`). If `node -v` is older (e.g. VM default 22.14), use nvm Node 22.23+ first: `export PATH="$(dirname "$(nvm which 22)"):$PATH"`.
- Prefetch is on (`prefetch.prefetchAll` + `defaultStrategy: "viewport"` in `apps/web/astro.config.mjs`). View transitions use `<ClientRouter />` in `base-layout.astro`. Do **not** `transition:persist` the `AppShell` that wraps the page `<slot />` — persisted islands keep stale children across navigations. Navbar listens for `astro:page-load` to keep the active link correct.
- Contact uses Astro Actions (`src/actions/index.ts` → `sendEmail`). Same-origin CSRF applies; curl must send a matching `Origin`.
- Email inbound webhook (`/api/webhook/email`) **requires** `RESEND_WEBHOOK_SECRET` and validates Svix `svix-id` / `svix-timestamp` / `svix-signature` (fail closed).
- Env: prefer `PUBLIC_SANITY_*` / `SANITY_*`; `NEXT_PUBLIC_*` still accepted for compatibility. Copy secrets into **app** `.env` / `.env.local` (and root `.env.local`); restart after changes.
- Spotify/email Zod validation: `apps/web/src/lib/env.ts` (reads `import.meta.env` and `process.env`).
- Revalidate stub: `/api/revalidate-tag` — requires `SANITY_REVALIDATE_SECRET` in app env. On Vercel cutover, point the Sanity webhook at the **Astro** deployment URL + shared secret or blog stays stale until rebuild.
- OG image route is `src/pages/api/og.ts` (`.tsx` endpoints are not registered by Astro — use `createElement` / `.ts`).
- Giveaway routes are **ended** stubs (parity with archived Next behavior).
- Metrics: [`docs/perf-next-vs-astro.md`](docs/perf-next-vs-astro.md).

### Next archive notes (`apps/web-next`)

- Next **16.3.0** with `cacheComponents: true` and `partialPrefetching: true`.
- Blog: `"use cache"` + `cacheLife('days')` + `cacheTag('post')`; `revalidateTag(tag, 'max')` on the revalidate route.
- Baseline: [`docs/perf-next-baseline.txt`](docs/perf-next-baseline.txt).

### Env / egress gotchas

- `SANITY_STUDIO_PROJECT_ID` must match the web Sanity project id. Studio requires login to edit.
- Resend from this Cloud Agent network may be Cloudflare-blocked (HTTP 1010); validate contact email from a Vercel preview if local submit fails.
- Spotify idle `{isPlaying:false}` is valid.
- Astro React islands are separate trees: any island using Motion `m.*` must wrap with `MotionRoot` (`apps/web/src/components/motion-root.tsx`). AppShell already provides LazyMotion for navbar/Spotify.
- After file edits in `apps/web`, `.cursor/hooks.json` `afterFileEdit` runs `bun run fix` (`ultracite fix`). Commit autofixes or CI lint fails.

### Vercel cutover checklist

1. Set the Vercel project **Root Directory** to `apps/web` (Astro). Framework should be **Astro** (`apps/web/vercel.json` sets `"framework": "astro"` — overrides a leftover Next.js preset).
2. Node: app `engines.node` is `22.x` (avoid open `>=22` ranges that jump to 24.x on Vercel).
3. Install uses repo-root `bun install --frozen-lockfile` via `apps/web/vercel.json`.
4. Update Sanity webhook → Astro `/api/revalidate-tag` (or rebuild-on-publish).
5. Confirm env vars on the Astro project (`PUBLIC_SANITY_*`, `RESEND_*`, `SPOTIFY_*`, BotID/Vercel analytics as needed).
