# `@andy-portfolio/web-next`

Next.js 16.3 archive of the portfolio. Same Graft CMS as the live Astro site. **Local only** — not deployed.

## Features

- **Dynamic OG**: Branded social images generated via `/api/og`.
- **Smooth Interaction**: Motion + Lenis for fluid UX.
- **Graft CMS**: Shared MDX in `packages/content`; `graft compile` then Next.

## Structure

```text
├── src/
│   ├── app/          # Next.js App Router (pages & APIs)
│   ├── components/   # React components (shadcn/ui)
│   ├── data/         # Education / work-history JSON (not Graft)
│   ├── lib/          # Graft client, portfolio helpers, metadata
│   └── types/        # TypeScript definitions
└── public/           # Static assets (including /blog copied from Astro)
```

## Development

```bash
bun run --filter=@andy-portfolio/web-next dev
```

Serves **http://localhost:3001**. From the repo root, `bun dev` also starts this app alongside Astro.

### Env variables

Required in root `.env.local` (same as Astro; no CMS secrets):

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `RESEND_API_KEY`

## Stack

- Next.js 16.3, Tailwind 4, shadcn/ui, Zod, `@usegraft/sdk-next`.
