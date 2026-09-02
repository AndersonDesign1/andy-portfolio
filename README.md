# Andy Portfolio

Personal portfolio and blog. Bun + Turbo monorepo with **Astro 7** as the primary site, [Graft](https://graft.page) for the live blog, Sanity kept for Studio / the Next archive, and a Next.js archive kept for reference.

## Tech stack

- **Monorepo**: [Turbo](https://turbo.build/) + [Bun](https://bun.sh/) `1.3.14`
- **Web (primary)**: [Astro 7](https://astro.build/) + React islands + `@astrojs/vercel`
- **Web (archive)**: [Next.js 16.3](https://nextjs.org/) in `apps/web-next` — source kept, **excluded from workspaces** ([restore](#restoring-the-next-archive))
- **CMS (Astro blog)**: [Graft](https://graft.page) static index (`apps/web/graft.config.ts`, `content/posts/`)
- **CMS (Studio / Next archive)**: [Sanity](https://www.sanity.io/) (`apps/studio`, port 3333)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + shadcn-style primitives
- **Motion**: [Motion](https://motion.dev/) + [Lenis](https://github.com/darkroomengineering/lenis)
- **Lint (Astro)**: [Ultracite](https://www.ultracite.ai/) **7.10.3** → **Oxlint** + **Oxfmt**, with Astro/React presets, `oxlint-plugin-react-doctor`, and vendored [anti-slop](https://github.com/dmmulroy/anti-slop) at `tools/oxlint/anti-slop`
- **Lint (Next archive / root format)**: Biome

## Structure

```text
├── apps/
│   ├── web/           # Astro 7 primary site (port 3000); Graft blog CMS
│   ├── web-next/      # Next.js 16.3 archive — source only, not a workspace
│   └── studio/        # Sanity CMS (port 3333; Next archive + leftover Studio)
├── packages/
│   └── sanity-config/ # Shared Sanity schemas & client
├── tools/
│   └── oxlint/anti-slop/  # Vendored Oxlint anti-slop plugin
├── turbo.json
└── AGENTS.md          # Cloud Agent / contributor caveats
```

## Quick start

```bash
bun install
cp .env.example .env.local   # fill Spotify, Resend, etc.
bun dev
```

- Astro: http://localhost:3000 (blog is Graft MDX; `graft compile` runs as part of `dev` / `build`)
- Studio: http://localhost:3333 (use `localhost`, not `127.0.0.1`) — Sanity, not the live blog

Graft’s static index needs **Node ≥22.16**. Oxlint TypeScript configs need **Node ≥22.18** on `PATH` (CI installs Node 22).

## Restoring the Next archive

`apps/web-next` holds the pre-Astro Next.js 16.3 site. Its **source is fully committed**, but it is deliberately **not installed or built**:

- It is excluded from the root `workspaces` array (which lists `apps/studio` and `apps/web` explicitly instead of globbing `apps/*`), so `bun install` skips its ~1k dependencies and Turbo does not discover its tasks.
- Its build output was deleted locally. Build artifacts (`.next/`, `node_modules/`) are gitignored and were never committed, so nothing was lost from history.

Nothing else references it — `apps/web` loads the anti-slop Oxlint plugin by relative path, not as a workspace dependency.

To bring it back:

```bash
# 1. Re-add it to the root package.json workspaces array:
#      "workspaces": ["apps/*", "packages/*"]
#    (or add "apps/web-next" alongside the existing entries)

# 2. Install its dependencies and relink @andy-portfolio/sanity-config
bun install

# 3. Run it (port 3001)
bun run --filter=@andy-portfolio/web-next dev
```

`bun install` will rewrite `bun.lock` when the workspace set changes — commit that alongside the `package.json` edit, or Vercel's `--frozen-lockfile` install will fail.

## Commands

| Command | Action |
| --- | --- |
| `bun dev` | Turbo dev (all apps) |
| `bun build` | Release builds |
| `bun lint` | Lint workspaces (`apps/web` → `ultracite check`) |
| `bun run --filter=@andy-portfolio/web lint:fix` | Autofix Astro lint/format |
| `bun run --filter=@andy-portfolio/web typecheck` | `astro check` |
| `bunx react-doctor@latest -y --verbose --no-score` | Advisory React Doctor scan (from `apps/web`) |

## Astro app highlights (`apps/web`)

- **Blog**: Graft MDX in `apps/web/content/posts/`; `graft compile` is part of `dev` / `build`
- **Prefetch**: `prefetchAll` + `viewport` strategy in `astro.config.mjs`
- **View transitions**: `<ClientRouter />` in `src/layouts/base-layout.astro`
- **Spotify widget**: `/api/spotify/now-playing` returns normalized `albumArtUrl`; UI hides when idle with no track
- **Contact**: Astro Actions (`src/actions`); webhook at `/api/webhook/email` requires Svix verification
- Quality docs for agents: [`AGENTS.md`](./AGENTS.md)

## License

MIT © [Anderson Joseph](https://andersonjoseph.com)
