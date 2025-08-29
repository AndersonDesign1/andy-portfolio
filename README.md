# My Personal Portfolio

A modern full-stack Portfolio built using:

- [Next.js 15+](https://nextjs.org/)
- [Sanity](https://www.sanity.io/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PNPM](https://pnpm.io/) (Fast, disk-efficient package manager)

## ✨ Features

- Out-of-the-box content management with Sanity
- Beautiful UI components using shadcn/ui
- Scalable backend using Sanity
- Folder structure ready for production apps
- Strict TypeScript setup
- App Router support (Next.js 15+)
- Spotify "Now Playing" integration to show your recent songs

---

##  Getting Started

### 1. Clone the Repository

```
git clone [<your-repo-url>](https://github.com/AndersonDesign1/andy-portfolio.git)
```

### 2. Install Dependencies with PNPM

> This project uses [PNPM](https://pnpm.io/) for faster and more efficient package management.

#### Install PNPM globally (if not installed)

```
npm install -g pnpm
```

#### Then install dependencies:

```
pnpm install
```

---

##  Setup Sanity

1. Go to [Sanity.io](https://www.sanity.io/) and create a free account.
2. Create a new project.
3. In the `.env.local` file (rename `env.example` to `.env.local`), add the following values from your Sanity project dashboard:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=your_sanity_dataset
```

---

## Setup Spotify Now Playing

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a new application.
2. In the `.env.local` file, add the following values from your Spotify application dashboard:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

---

##  Run the App


Visit `http://localhost:3000` to view the app in the browser.

---

##  Project Structure

```
.
├── src/
│   ├── app/              # App router structure
│   ├── components/       # UI components (shadcn/ui)
│   ├── lib/              # Utility functions
│   ├── sanity/           # Sanity schema and client
│   └── types/            # TypeScript types
├── public/           # Static files
├── .env.example        # Environment variables
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

##  Customization Tips

- Add more shadcn components by running:
  ```
  pnpm dlx shadcn-ui@latest add [component]
  ```
- Extend the Sanity schema in `src/sanity/schemaTypes` as needed.

---

##  Deployment

You can deploy this app to:

- [Vercel](https://vercel.com/) — seamless for Next.js
- [Netlify](https://netlify.com/)
- [Render](https://render.com/)

---

##  License

MIT License
