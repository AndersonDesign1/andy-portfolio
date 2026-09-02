# AGENTS.md

## Cursor Cloud specific instructions

Bun + Turbo monorepo (`andy-portfolio`), Astro-primary after cutover:

| App | Path | Dev port | Role |
| --- | --- | --- | --- |
| Web (primary) | `apps/web` | `3000` | Astro 7 + React islands + `@astrojs/vercel` |
| Web (archive) | `apps/web-next` | `3001` | Next.js 16.3 reference — **not a workspace**, not installed. See [Next archive notes](#next-archive-notes-appsweb-next) |
| Studio | `apps/studio` | `3333` | Sanity CMS (kept for the Next archive; binds `localhost` / IPv6; use `http://localhost:3333`, not `127.0.0.1`) |
| Shared | `packages/sanity-config` | — | Sanity schemas & client for Studio + Next archive |

### Package manager

Bun pinned to `bun@1.3.14` in root `package.json` (Cloud Agent / CI / Vercel should match). Startup update script runs `bun install`. Keep the text `bun.lock` in sync — Bun 1.3+ uses `bun.lock` (not `bun.lockb`); a stale/hand-patched lockfile breaks `--frozen-lockfile` and Vercel installs.

### Common commands

See root `package.json` / `turbo.json`: `bun dev`, `bun lint`, `bun format` / `ultracite fix`. No automated test suite.

App-scoped:

- Astro: `bun run --filter=@andy-portfolio/web dev|build|lint|typecheck`
- Studio: `bun run --filter=@andy-portfolio/studio dev`
- Next archive: **unavailable** until restored — it is not in `workspaces`, so `--filter=@andy-portfolio/web-next` resolves to nothing

Astro typecheck uses `@astrojs/check` via `bun run --filter=@andy-portfolio/web typecheck` (or `cd apps/web && bun run typecheck`). Non-interactive; do not run bare `astro check` prompts that try to install deps.

### Astro app notes (`apps/web`)

- Ultracite **7.10.3** + **Oxlint** / **Oxfmt** (`apps/web/oxlint.config.ts`, `oxfmt.config.ts`) with `ultracite/oxlint/{core,astro,react}` plus `oxlint-plugin-react-doctor`. Lint/fix: `bun run --filter=@andy-portfolio/web lint` / `lint:fix` (aliases for `ultracite check` / `fix`). Next archive still uses Biome.
- Oxlint TS configs need **Node ^20.19 or ≥22.18** on `PATH` (loading `oxlint.config.ts` / `oxfmt.config.ts`). If `node -v` is older (e.g. VM default 22.14), use nvm Node 22.23+ first: `export PATH="$(dirname "$(nvm which 22)"):$PATH"`.
- Prefetch is on (`prefetch.prefetchAll` + `defaultStrategy: "viewport"` in `apps/web/astro.config.mjs`). View transitions use `<ClientRouter />` in `base-layout.astro`. Do **not** `transition:persist` the `AppShell` that wraps the page `<slot />` — persisted islands keep stale children across navigations. Navbar listens for `astro:page-load` to keep the active link correct.
- **Blog CMS is Graft (static), not Sanity.** Schema in `apps/web/graft.config.ts`; posts in `apps/web/content/posts/<slug>.mdx`; images in `apps/web/public/blog/<slug>/`. `graft compile` writes `.graft/index.db` (gitignored). Dev and Vercel build run `graft compile && astro build`. Graft’s SQLite FTS needs **Node ≥22.16** (`engines.node` stays `22.x` so Vercel does not jump to 24). Studio (`graft studio`) is Postgres-tier — not used here. Re-export from Sanity: `bun run --filter=@andy-portfolio/web export:sanity`.
- Contact uses Astro Actions (`src/actions/index.ts` → `sendEmail`). Same-origin CSRF applies; curl must send a matching `Origin`.
- **BotID (Astro ≠ Next):** client `initBotId` must protect `POST /_actions/sendEmail` (Astro Actions RPC), **not** `POST /contact` (that was Next Server Actions). `apps/web/vercel.json` must include the BotID challenge/proxy rewrites from the botid “Other Frameworks” docs. Do **not** recreate the BotID project for this — path + rewrites are enough.
- Email inbound webhook (`/api/webhook/email`) **requires** `RESEND_WEBHOOK_SECRET` and validates Svix `svix-id` / `svix-timestamp` / `svix-signature` (fail closed).
- Env: Spotify / Resend / BotID live on the Astro app. Sanity `PUBLIC_*` / `NEXT_PUBLIC_*` / `SANITY_STUDIO_*` are still used by Studio and the Next archive, and by `apps/web`’s one-time `export:sanity` script — **not** by the live blog. Copy secrets into **app** `.env` / `.env.local` (and root `.env.local`); restart after changes.
- Spotify/email Zod validation: `apps/web/src/lib/env.ts` (reads `import.meta.env` and `process.env`).
- **Spotify OAuth (refresh token mint):** visit `/api/spotify/authorize` → callback `/api/spotify/callback`. Legacy `/callback` redirects there. Spotify Developer Dashboard redirect URIs must match the **exact** origin (add **www** and apex if both exist): `https://www.andersonjoseph.com/api/spotify/callback`, `https://andersonjoseph.com/api/spotify/callback`, `http://127.0.0.1:3000/api/spotify/callback`. No need to delete/recreate the Spotify app — only add missing URIs and rotate `SPOTIFY_REFRESH_TOKEN` in Vercel after authorize.
- Revalidate stub: `/api/revalidate-tag` still authenticates `SANITY_REVALIDATE_SECRET` so an old Sanity webhook does not 500. Live Astro blog freshness is **git push → Vercel rebuild**, not this webhook.
- OG image route is `src/pages/api/og.ts` (`.tsx` endpoints are not registered by Astro — use `createElement` / `.ts`).
- Giveaway routes are **ended** stubs (parity with archived Next behavior).

### Next archive notes (`apps/web-next`)

**Status: source-only archive. Deliberately excluded — do not "fix" this by re-adding it unasked.**

- Root `workspaces` lists `apps/studio` and `apps/web` explicitly (no `apps/*` glob) so `bun install` skips web-next's dependency tree and Turbo does not discover its tasks. `bun dev` / `bun build` / `bun lint` therefore cover **web + studio only**.
- The stale root-level `.next/` directory (a leftover from the pre-monorepo layout) was deleted. Build output and `node_modules` are gitignored and were never committed — **no source or history was lost**; every `apps/web-next` file is still tracked.
- Nothing depends on it. `apps/web` loads the anti-slop Oxlint plugin via the relative path `../../tools/oxlint/anti-slop/index.ts`, not as a workspace dependency.

**To restore it:** add `apps/web-next` back to the root `workspaces` array (or revert to the `apps/*` glob), run `bun install` to install its deps and relink `@andy-portfolio/sanity-config`, then `bun run --filter=@andy-portfolio/web-next dev` (port **3001**). Changing the workspace set rewrites `bun.lock` — commit it with the `package.json` change or `--frozen-lockfile` installs (CI, Vercel) will fail.

- Next **16.3.0** with `cacheComponents: true` and `partialPrefetching: true`.
- Blog: `"use cache"` + `cacheLife('days')` + `cacheTag('post')`; `revalidateTag(tag, 'max')` on the revalidate route.

### Env / egress gotchas

- `SANITY_STUDIO_PROJECT_ID` must match the web Sanity project id. Studio requires login to edit.
- Resend from this Cloud Agent network may be Cloudflare-blocked (HTTP 1010); validate contact email from a Vercel preview if local submit fails.
- Spotify idle `{isPlaying:false}` is valid.
- Astro React islands are separate trees: any island using Motion `m.*` must wrap with `MotionRoot` (`apps/web/src/components/motion-root.tsx`). AppShell already provides LazyMotion for navbar/Spotify.
- After file edits in `apps/web`, `apps/web/.cursor/hooks.json` `afterFileEdit` runs `bun run fix` (`ultracite fix`). Commit autofixes or CI lint fails. **This is the only hooks file in the repo** — the root and `apps/web-next` ones ran `bun x ultracite fix`, which failed on every edit ("Could not resolve ultracite": ultracite is a dependency of `apps/web`, not the root, and neither location has `oxfmt.config.ts` / `oxlint.config.ts`). They were removed rather than repointed, because the root formatter is Biome and running it over `apps/web` would fight oxfmt.
- `apps/web/CLAUDE.md` is a **symlink** to `AGENTS.md` (git mode 120000). Windows checkouts without `core.symlinks` materialize it as a text file containing the literal string `AGENTS.md`; formatting it appends a newline and rewrites the symlink target to `AGENTS.md\n`, breaking it on macOS/Linux/CI. It is listed in `ignorePatterns` in `apps/web/oxfmt.config.ts` — do not remove that entry. Before the entry existed, the format phase failed, and because `ultracite check` aborts before linting, **oxlint and all anti-slop rules were silently skipped** by `bun run lint`.
- Line endings are pinned to LF by the root `.gitattributes` (`* text=auto eol=lf`). Oxfmt treats CRLF as a format error, so a Windows checkout with `core.autocrlf=true` fails lint on every file. Set `git config core.autocrlf false` locally.

### Anti-slop coverage

Anti-slop runs in **three** workspaces, all wired into `bun run lint` (turbo):

| Workspace | Config | Rules |
| --- | --- | --- |
| `apps/web` | `oxlint.config.ts` | Full Ultracite Oxlint stack + anti-slop |
| `packages/sanity-config` | `oxlint.config.mts` | **anti-slop only** |
| `apps/studio` | `oxlint.config.mts` | **anti-slop only** |

The latter two share `tools/oxlint/anti-slop.shared.mts` and enable **only** the 15 anti-slop rules — deliberately not Ultracite's `core` preset, whose stylistic rules (`sort-keys`, `arrow-body-style`) would fight Biome, which owns formatting there.

`.mts` is load-bearing: as `.ts` these configs emit `MODULE_TYPELESS_PACKAGE_JSON` on every lint run, and the alternative (`"type": "module"` in `packages/sanity-config/package.json`) would change module semantics for a package consumed by Sanity Studio and Astro. Do not rename them back.

`tools/oxlint/anti-slop/` itself stays unlinted and unformatted — it is vendored from upstream.

**The 17 pre-existing violations are fixed.** 16 were in `packages/sanity-config` (studio was already clean):

- `src/schemaTypes/post.ts` + `category.ts` had 15 `as SchemaField` / `as SlugField` / … casts on object literals, tripping `require-safety-comment-for-type-assertion`. Rewritten with Sanity's `defineType` / `defineField` / `defineArrayMember`, which infer per-`type` and need no casts. These helpers are identity functions at runtime — verified by diffing the serialized schema shape before and after: **identical**.
- `src/lib/types.ts` held the hand-rolled types those casts existed for, including `options?: Record<string, unknown>` (`no-unsafe-dictionary-type`). With the casts gone it had zero consumers, so the file, its `export *` in `src/index.ts`, and the stale `./types` entry in `package.json` `exports` were removed.

### Biome (root / studio / packages / tools)

Root Biome had never run — `bun run format` always died on a config error. Three faults, now fixed:

1. Root `biome.jsonc` extended `ultracite`, `ultracite/core`, `ultracite/react`, `ultracite/next`. Ultracite 7 has **no bare `.` export and no `/core`** — those are *oxlint* preset names. Biome presets live under **`ultracite/biome/*`** only.
2. Those presets need **Biome >= 2.5** (`useSortedEnumMembers`, `noDuplicateClasses` are rejected by 2.3.x). Root is now on **2.5.9**; do not downgrade below 2.5.
3. Biome 2.x **discovers nested configs**, so `apps/web-next/biome.jsonc` was loaded from the root run and failed on the same bad specifiers. It now sets `"root": false` and uses `ultracite/biome/*`.

`ultracite` is a **root devDependency** solely so these `extends` resolve — it is not otherwise used at the root.

Scope: root `biome.jsonc` restricts `files.includes` to everything except three trees, each with a **`!!` force-ignore**:

```jsonc
"includes": ["**", "!!apps/web/**", "!!apps/web-next/**", "!!tools/oxlint/anti-slop/**"]
```

- `apps/web` — Oxfmt/Oxlint territory; two formatters on the same files rewrite each other.
- `apps/web-next` — frozen archive with its own nested `biome.jsonc`.
- `tools/oxlint/anti-slop` — **vendored** from `github.com/dmmulroy/anti-slop`; reformatting makes every upstream sync conflict.

**A single `!` is not sufficient for `apps/web-next`.** A nested `biome.jsonc` governs its own directory regardless of the root config's exclusions, so with a plain `!` the root `bun run format` still reformatted `apps/web-next/public/IOM-logo.svg`. `!!` force-ignore stops the scanner descending at all. Verified: the scan drops from 104 files to 20, with 0 hits in all three trees.

`bun run format` is clean as of the formatting pass that normalized `.vscode/settings.json`, `apps/studio/sanity.cli.ts`, `packages/sanity-config/src/schemaTypes/post.ts`, and the root `package.json` / `biome.jsonc` (trailing newline, quote style, one collapsed type annotation — no semantic changes).

### Vercel cutover checklist

1. Set the Vercel project **Root Directory** to `apps/web` (Astro). Framework should be **Astro** (`apps/web/vercel.json` sets `"framework": "astro"` — overrides a leftover Next.js preset).
2. Node: app `engines.node` is `22.x` (avoid open `>=22` ranges that jump to 24.x on Vercel).
3. Install uses repo-root `bun install --frozen-lockfile` via `apps/web/vercel.json`.
4. Live Astro blog content is MDX in git; a push rebuilds. `/api/revalidate-tag` is only a leftover Sanity webhook ack.
5. Confirm env vars on the Astro project (`RESEND_*`, `SPOTIFY_*`, BotID/Vercel analytics as needed). Sanity vars remain for Studio / the Next archive, not for serving `/blog`.
