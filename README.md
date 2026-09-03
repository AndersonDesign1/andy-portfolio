# Andy Portfolio

Personal portfolio and blog. Bun + Turbo monorepo with **two site versions** and **Graft** as the CMS for both.

## Two site versions

| Version | Path | Port | Role |
| --- | --- | --- | --- |
| **Astro 7** | `apps/web` | 3000 | Live site on Vercel |
| **Next.js 16.3** | `apps/web-next` | 3001 | Local archive — same Graft content, not deployed |

`bun dev` starts both. Vercel Root Directory is `apps/web`; do not add a Vercel project for Next.

## Tech stack

- **Monorepo**: [Turbo](https://turbo.build/) + [Bun](https://bun.sh/) `1.4.0`
- **Web (live)**: [Astro 7](https://astro.build/) + React islands + `@astrojs/vercel`
- **Web (archive)**: [Next.js 16.3](https://nextjs.org/) — workspace, local only
- **CMS**: [Graft](https://graft.page) static index in `packages/content` (`content/{posts,projects,case-studies}/`)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + shadcn-style primitives
- **Motion**: [Motion](https://motion.dev/) + [Lenis](https://github.com/darkroomengineering/lenis)
- **Lint (Astro)**: [Ultracite](https://www.ultracite.ai/) **7.10.3** → **Oxlint** + **Oxfmt**, with Astro/React presets, `oxlint-plugin-react-doctor`, and vendored [anti-slop](https://github.com/dmmulroy/anti-slop) at `tools/oxlint/anti-slop`
- **Lint (Next / root format)**: Biome

## Structure

```text
├── apps/
│   ├── web/           # Astro 7 live site (port 3000)
│   └── web-next/      # Next.js 16.3 archive (port 3001, not deployed)
├── packages/
│   └── content/       # Shared Graft CMS (schema + MDX)
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

- Astro: http://localhost:3000
- Next: http://localhost:3001

Both apps compile Graft (`packages/content`) then serve the same posts, projects, and case studies. Graft’s static index needs **Node ≥22.16**. Oxlint TypeScript configs need **Node ≥22.18** on `PATH` (CI installs Node 22).

## Commands

| Command | Action |
| --- | --- |
| `bun dev` | Turbo dev (Astro 3000 + Next 3001) |
| `bun build` | Build both apps (Vercel uses the Astro app script only) |
| `bun lint` | Lint workspaces (Astro Ultracite + Next Biome) |
| `bun run --filter=@andy-portfolio/web lint:fix` | Autofix Astro lint/format |
| `bun run --filter=@andy-portfolio/web typecheck` | `astro check` |
| `bun run --filter=@andy-portfolio/web-next typecheck` | `tsc --noEmit` |
| `bun run --filter=@andy-portfolio/content compile` | Rebuild the Graft SQLite index |
| `bunx react-doctor@latest -y --verbose --no-score` | Advisory React Doctor scan (from `apps/web`) |

## Graft CMS (`packages/content`)

Author MDX under `packages/content/content/{posts,projects,case-studies}/`. `graft compile` writes `.graft/index.db` (gitignored). Astro renders post bodies with `@astrojs/mdx`; Next uses `@usegraft/sdk-next` `MdxBody`. Education / work history stay as local JSON in each app.

## Astro app highlights (`apps/web`)

- **Prefetch**: `prefetchAll` + `viewport` strategy in `astro.config.mjs`
- **View transitions**: `<ClientRouter />` in `src/layouts/base-layout.astro`
- **Spotify widget**: `/api/spotify/now-playing` returns normalized `albumArtUrl`; UI hides when idle with no track
- **Contact**: Astro Actions (`src/actions`); webhook at `/api/webhook/email` requires Svix verification
- Quality docs for agents: [`AGENTS.md`](./AGENTS.md)

## License

MIT © [Anderson Joseph](https://andersonjoseph.com)
