# AGENTS.md

## Cursor Cloud specific instructions

Bun + Turbo monorepo (`andy-portfolio`), Astro-primary after cutover:

| App | Path | Dev port | Role |
| --- | --- | --- | --- |
| Web (primary) | `apps/web` | `3000` | Astro 7 + React islands + `@astrojs/vercel` — live on Vercel |
| Web (archive) | `apps/web-next` | `3001` | Next.js 16.3 — workspace, local only, same Graft CMS |
| Shared CMS | `packages/content` | — | Graft schema + MDX for both apps |

### Package manager

Bun pinned to `bun@1.4.0` in root `package.json` (Cloud Agent / CI / Vercel should match). Startup update script runs `bun install`. Keep the text `bun.lock` in sync — Bun 1.3+ uses `bun.lock` (not `bun.lockb`); a stale/hand-patched lockfile breaks `--frozen-lockfile` and Vercel installs.

### Common commands

See root `package.json` / `turbo.json`: `bun dev`, `bun lint`, `bun format` / `ultracite fix`. No automated test suite. `bun dev` starts Astro (3000) and Next (3001).

App-scoped:

- Astro: `bun run --filter=@andy-portfolio/web dev|build|lint|typecheck`
- Next: `bun run --filter=@andy-portfolio/web-next dev|build|lint|typecheck`
- Graft: `bun run --filter=@andy-portfolio/content compile`

Astro typecheck uses `@astrojs/check` via `bun run --filter=@andy-portfolio/web typecheck` (or `cd apps/web && bun run typecheck`). Non-interactive; do not run bare `astro check` prompts that try to install deps.

### Astro app notes (`apps/web`)

- Ultracite **7.10.3** + **Oxlint** / **Oxfmt** (`apps/web/oxlint.config.ts`, `oxfmt.config.ts`) with `ultracite/oxlint/{core,astro,react}` plus `oxlint-plugin-react-doctor`. Lint/fix: `bun run --filter=@andy-portfolio/web lint` / `lint:fix` (aliases for `ultracite check` / `fix`). Next uses Biome.
- Oxlint TS configs need **Node ^20.19 or ≥22.18** on `PATH` (loading `oxlint.config.ts` / `oxfmt.config.ts`). If `node -v` is older (e.g. VM default 22.14), use nvm Node 22.23+ first: `export PATH="$(dirname "$(nvm which 22)"):$PATH"`.
- Prefetch is on (`prefetch.prefetchAll` + `defaultStrategy: "viewport"` in `apps/web/astro.config.mjs`). View transitions use `<ClientRouter />` in `base-layout.astro`. Do **not** `transition:persist` the `AppShell` that wraps the page `<slot />` — persisted islands keep stale children across navigations. Navbar listens for `astro:page-load` to keep the active link correct.
- **CMS is Graft (static).** Schema and MDX live in `packages/content`. Blog images under each app's `public/blog/<slug>/`. Projects / case studies use public-root paths. `graft compile` writes `packages/content/.graft/index.db` (gitignored). Dev and Vercel build run `bun run --filter=@andy-portfolio/content compile` then the app build. Graft’s SQLite FTS needs **Node ≥22.16** (`engines.node` stays `22.x` so Vercel does not jump to 24). Graft Studio (`graft studio`) is Postgres-tier — not used here.
- Contact uses Astro Actions (`src/actions/index.ts` → `sendEmail`). Same-origin CSRF applies; curl must send a matching `Origin`.
- **BotID (Astro ≠ Next):** client `initBotId` must protect `POST /_actions/sendEmail` (Astro Actions RPC), **not** `POST /contact` (that was Next Server Actions). `apps/web/vercel.json` must include the BotID challenge/proxy rewrites from the botid “Other Frameworks” docs. Do **not** recreate the BotID project for this — path + rewrites are enough.
- Email inbound webhook (`/api/webhook/email`) **requires** `RESEND_WEBHOOK_SECRET` and validates Svix `svix-id` / `svix-timestamp` / `svix-signature` (fail closed).
- Env: Spotify / Resend / BotID live on the Astro app. Graft needs no env. Copy secrets into **app** `.env` / `.env.local` (and root `.env.local`); restart after changes.
- Spotify/email Zod validation: `apps/web/src/lib/env.ts` (reads `import.meta.env` and `process.env`).
- **Spotify OAuth (refresh token mint):** visit `/api/spotify/authorize` → callback `/api/spotify/callback`. Legacy `/callback` redirects there. Spotify Developer Dashboard redirect URIs must match the **exact** origin (add **www** and apex if both exist): `https://www.andersonjoseph.com/api/spotify/callback`, `https://andersonjoseph.com/api/spotify/callback`, `http://127.0.0.1:3000/api/spotify/callback`. No need to delete/recreate the Spotify app — only add missing URIs and rotate `SPOTIFY_REFRESH_TOKEN` in Vercel after authorize.
- Blog freshness is **git push → Vercel rebuild**. There is no revalidate webhook.
- OG image route is `src/pages/api/og.ts` (`.tsx` endpoints are not registered by Astro — use `createElement` / `.ts`).
- Giveaway routes are **ended** stubs (parity with archived Next behavior).

### Next archive notes (`apps/web-next`)

Next is a **workspace** so `bun dev` / `bun lint` / `bun build` include it. It is **not deployed** — Vercel Root Directory stays `apps/web`.

- Next **16.3.0** with `cacheComponents: true` and `partialPrefetching: true`.
- Blog / projects / case studies read the shared Graft index (`@usegraft/sdk-next`, `MdxBody` for post bodies).
- Nested `biome.jsonc` (`root: false`). Root Biome **force-ignores** `!!apps/web-next/**`. Align `@biomejs/biome` with root **2.5.9**.

### Env / egress gotchas

- Resend from this Cloud Agent network may be Cloudflare-blocked (HTTP 1010); validate contact email from a Vercel preview if local submit fails.
- Spotify idle `{isPlaying:false}` is valid.
- Astro React islands are separate trees: any island using Motion `m.*` must wrap with `MotionRoot` (`apps/web/src/components/motion-root.tsx`). AppShell already provides LazyMotion for navbar/Spotify.
- After file edits in `apps/web`, `apps/web/.cursor/hooks.json` `afterFileEdit` runs `bun run fix` (`ultracite fix`). Commit autofixes or CI lint fails. **This is the only hooks file in the repo** — do not add a root or web-next Ultracite hook (`bun x ultracite` cannot resolve web’s Oxlint stack). Next lint is `biome check`.
- `apps/web/CLAUDE.md` is a **symlink** to `AGENTS.md` (git mode 120000). Windows checkouts without `core.symlinks` materialize it as a text file containing the literal string `AGENTS.md`; formatting it appends a newline and rewrites the symlink target to `AGENTS.md\n`, breaking it on macOS/Linux/CI. It is listed in `ignorePatterns` in `apps/web/oxfmt.config.ts` — do not remove that entry. Before the entry existed, the format phase failed, and because `ultracite check` aborts before linting, **oxlint and all anti-slop rules were silently skipped** by `bun run lint`.
- Line endings are pinned to LF by the root `.gitattributes` (`* text=auto eol=lf`). Oxfmt treats CRLF as a format error, so a Windows checkout with `core.autocrlf=true` fails lint on every file. Set `git config core.autocrlf false` locally.

### Anti-slop coverage

Anti-slop runs in **`apps/web`** via `oxlint.config.ts` (full Ultracite Oxlint stack + anti-slop), wired into `bun run lint` (turbo).

`tools/oxlint/anti-slop/` itself stays unlinted and unformatted — it is vendored from upstream.

### Biome (root / packages / tools)

Root Biome presets live under **`ultracite/biome/*`** only and need **Biome >= 2.5**. Root is on **2.5.9**; do not downgrade below 2.5.

`ultracite` is a **root devDependency** solely so these `extends` resolve — it is not otherwise used at the root.

Scope: root `biome.jsonc` restricts `files.includes` to everything except three trees, each with a **`!!` force-ignore**:

```jsonc
"includes": ["**", "!!apps/web/**", "!!apps/web-next/**", "!!tools/oxlint/anti-slop/**"]
```

- `apps/web` — Oxfmt/Oxlint territory; two formatters on the same files rewrite each other.
- `apps/web-next` — nested `biome.jsonc`; a plain `!` is not enough because Biome 2.x still descends into nested configs.
- `tools/oxlint/anti-slop` — **vendored** from `github.com/dmmulroy/anti-slop`; reformatting makes every upstream sync conflict.

**A single `!` is not sufficient for `apps/web-next`.** Force-ignore stops the scanner descending at all.

### Vercel cutover checklist

1. Set the Vercel project **Root Directory** to `apps/web` (Astro). Framework should be **Astro** (`apps/web/vercel.json` sets `"framework": "astro"` — overrides a leftover Next.js preset).
2. Node: app `engines.node` is `22.x` (avoid open `>=22` ranges that jump to 24.x on Vercel).
3. Install uses repo-root `bun install --frozen-lockfile` via `apps/web/vercel.json` (Bun **1.4.0**).
4. Live content is MDX in git (`packages/content`); a push rebuilds. `apps/web` `build` compiles Graft then Astro — root Turbo `bun build` also builds Next locally and must not be the Vercel command.
5. Confirm env vars on the Astro project (`RESEND_*`, `SPOTIFY_*`, BotID/Vercel analytics as needed). No Sanity vars.
