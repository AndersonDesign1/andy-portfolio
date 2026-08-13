# Andy Portfolio

My personal portfolio and blog. A high-performance monorepo built with Bun, Turbo, and Next.js.

## ⚡ Tech Stack

- **Monorepo**: [Turbo](https://turbo.build/) + [Bun](https://bun.sh/)
- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router)
- **CMS**: [Sanity](https://www.sanity.io/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.dev/)
- **Interactions**: [Motion](https://motion.dev/) + [Lenis](https://github.com/darkroomengineering/lenis)

---

## 🏗️ Structure

```text
├── apps/
│   ├── web/          # Next.js frontend
│   └── studio/       # Sanity CMS
├── packages/
│   └── sanity-config/# Shared Sanity logic & schemas
├── turbo.json        # Build orchestration
└── biome.jsonc       # Lint/Format config
```

- [**apps/web**](./apps/web): Next.js frontend with dynamic OG images and Sanity integration.
- [**apps/studio**](./apps/studio): Sanity Studio for content management.
- [**packages/sanity-config**](./packages/sanity-config): Shared schemas and configuration.

---

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Setup environment
cp .env.example .env.local # Fill in your keys

# Run development mode
bun dev
```

Visit `http://localhost:3000` (Astro web), `http://localhost:3001` (Next archive), and `http://localhost:3333` (Studio).

---

## 🛠️ Main Commands

- `bun dev` - Start dev servers
- `bun build` - Production build
- `bun lint` - Lint all projects
- `bun format` - Format codebase

## 📄 License

MIT © [Anderson Joseph](https://andersonjoseph.com)
