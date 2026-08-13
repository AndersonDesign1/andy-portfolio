# `@andy-portfolio/web`

Astro 7 primary portfolio site (React islands, Tailwind 4, Sanity, Vercel adapter).

## Stack

- **Astro 7** + `@astrojs/react` / `@astrojs/vercel` / `@astrojs/sitemap`
- **Lint / format**: Ultracite 7.10.3 → Oxlint + Oxfmt (`oxlint.config.ts`, `oxfmt.config.ts`)
  - Presets: `ultracite/oxlint/{core,astro,react}`
  - Plugins: `oxlint-plugin-react-doctor`, vendored anti-slop (`../../tools/oxlint/anti-slop`)
- **Motion**: Motion + Lenis; Spotify now-playing island
- **Navigation**: Astro `prefetch` (`prefetchAll` + `viewport`) and `<ClientRouter />` view transitions

## Commands

| Command | Action |
| --- | --- |
| `bun run dev` | Dev server on **http://localhost:3000** |
| `bun run build` | Vercel output build |
| `bun run preview` | Preview the built site |
| `bun run lint` / `check` | `ultracite check` |
| `bun run lint:fix` / `fix` | `ultracite fix` |
| `bun run typecheck` | `astro check` |
| `bunx react-doctor@latest -y --verbose --no-score` | Advisory React Doctor CLI |

Requires **Bun 1.3.x** and **Node ≥22.18** for TypeScript Oxlint/Oxfmt configs.

## Env

Copy secrets into `apps/web/.env` / `.env.local` (and root `.env.local`). See root [`AGENTS.md`](../../AGENTS.md) for Sanity / Spotify / Resend notes.

## Layout / routing notes

- Layout: `src/layouts/base-layout.astro` (`ClientRouter`, theme boot script)
- Do not `transition:persist` `AppShell` while it wraps the page `<slot />` (stale children)
- Navbar listens for `astro:page-load` so active links stay correct under soft navigations
