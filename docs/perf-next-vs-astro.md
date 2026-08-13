# Next vs Astro metrics (Cloud Agent VM)

Captured 2026-08-13 after Next 16.3 Cache Components quality pass and Astro full-parity cutover.

Method notes: same Bun 1.1.38 monorepo; Studio remains in both installs. Times are single-run unless noted. TTFB is warm local `dev` (median of 5). Avoid comparing Absolute Lighthouse scores here — lab Lighthouse deferred; use local preview on a developer machine for Perf/LCP/CLS.

| Metric | Next (`apps/web-next`) | Astro (`apps/web`) | Delta |
| --- | --- | --- | --- |
| Monorepo `node_modules` (both apps present) | — | 1.5G total | +~0.2G vs Next-only baseline 1.3G (expected while both live) |
| App `node_modules` | 115–116M | 134–177M | Astro app-local slightly larger |
| Lint (`biome check`) | ~0.17s | ~0.13s | Astro ≈ same / slightly faster |
| Typecheck | `tsc --noEmit` ~3.1s | `astro check` needs `@astrojs/check` (not installed); build type phase covered by `astro build` | — |
| `build` wall time | ~19.9s (re-run) / baseline ~14.0s | ~4.7–5.6s | Astro **~3–4× faster** |
| Build output size | `.next` ~182M–1.1G (incl. cache) | `dist` 5.2M; `.vercel/output` ~49–51M | Astro **much smaller** deploy artifact |
| Dev ready line | Ready ~243–298ms | ready ~2053ms | Next cold line faster; Astro first compile heavier |
| Dev idle RSS (approx) | ~1001 MB (`next-server`) | ~593 MB (astro/node sum) | Astro **lower** RSS in this capture |
| TTFB `/` (dev, warm) | ~37–50ms avg | ~19–37ms avg | Astro similar / slightly better |
| TTFB `/blog` (dev, warm) | ~36ms median baseline; noisy avg ~274ms | ~120–160ms | Blog TTFB higher on Astro **dev** (SSR/fetch path) |
| TTFB `/projects` (dev) | ~40–135ms | ~14–23ms | Astro faster |
| Homepage HTML bytes (dev) | ~82KB | ~115KB | Astro HTML larger (islands/hydration markers) |
| Blog HTML bytes (dev) | ~56KB | ~99KB | Astro larger HTML |

## Interpretation

- **Build & deploy size:** clear Astro win (`dist`/`vercel output` vs `.next`).
- **Dev memory:** Astro lower RSS in this VM capture.
- **Route TTFB:** static marketing routes favor Astro; blog list/detail are slower under Astro `dev` here — re-check with `astro preview` / Vercel preview for deployed-like numbers.
- **HTML weight:** Astro ships more HTML with React island markers; expect less client JS on mostly-static routes once measured in Network panel / Lighthouse.
- **Install size:** monorepo stays large while **both** Next archive and Astro primary coexist; expect shrink if/when `apps/web-next` is removed later (out of scope).

Raw captures: [`perf-next-baseline.txt`](./perf-next-baseline.txt), [`perf-astro.txt`](./perf-astro.txt).
