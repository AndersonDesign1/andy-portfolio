# `@andy-portfolio/web`

Astro 7 primary portfolio site (React islands, Tailwind 4, Graft CMS, Vercel adapter).

## Stack

- **Astro 7** + `@astrojs/react` / `@astrojs/mdx` / `@astrojs/vercel` / `@astrojs/sitemap`
- **CMS**: [Graft](https://graft.page) via `@andy-portfolio/content` (`packages/content`)
- **Lint / format**: Ultracite 7.10.3 → Oxlint + Oxfmt (`oxlint.config.ts`, `oxfmt.config.ts`)
  - Presets: `ultracite/oxlint/{core,astro,react}`
  - Plugins: `oxlint-plugin-react-doctor`, vendored anti-slop (`../../tools/oxlint/anti-slop`)
- **Motion**: Motion + Lenis; Spotify now-playing island
- **Navigation**: Astro `prefetch` (`prefetchAll` + `viewport`) and `<ClientRouter />` view transitions

## Commands

| Command | Action |
| --- | --- |
| `bun run dev` | Compile Graft then dev server on **http://localhost:3000** |
| `bun run build` | Compile Graft then Vercel output build |
| `bun run graft:compile` / `graft:dev` | One-shot compile / watch the shared content tree |
| `bun run preview` | Preview the built site |
| `bun run lint` / `check` | `ultracite check` |
| `bun run lint:fix` / `fix` | `ultracite fix` |
| `bun run typecheck` | `astro check` |
| `bunx react-doctor@latest -y --verbose --no-score` | Advisory React Doctor CLI |

Requires **Bun 1.4.x**, **Node ≥22.16** (Graft `node:sqlite`), and **Node ≥22.18** for TypeScript Oxlint/Oxfmt configs.

## Env

Copy secrets into `apps/web/.env` / `.env.local` (and root `.env.local`). See root [`AGENTS.md`](../../AGENTS.md) for Spotify / Resend notes. Graft needs no env.

## Layout / routing notes

- Layout: `src/layouts/base-layout.astro` (`ClientRouter`, theme boot script)
- Do not `transition:persist` `AppShell` while it wraps the page `<slot />` (stale children)
- Navbar listens for `astro:page-load` so active links stay correct under soft navigations
