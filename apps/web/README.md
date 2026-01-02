# @andy-portfolio/web

Next.js 16 frontend for the portfolio.

## ✨ Features
- **Dynamic OG**: Branded social images generated via `/api/og`.
- **Smooth Interaction**: Motion + Lenis for fluid UX.
- **Sanity Integrated**: Content managed through the studio.

## � Structure

```text
├── src/
│   ├── app/          # Next.js App Router (pages & APIs)
│   ├── components/   # React components (shadcn/ui)
│   ├── data/         # Static JSON data
│   ├── lib/          # Utilities & Metadata
│   └── types/        # TypeScript definitions
└── public/           # Static assets
```

## �🚀 Development
```bash
bun dev
```

### Env Variables
Required in root `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `RESEND_API_KEY`

## 📦 Stack
- Next.js 16, Tailwind 4, shadcn/ui, Zod.
