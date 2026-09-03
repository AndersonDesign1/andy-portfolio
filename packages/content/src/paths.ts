import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

/**
 * Resolve the content package root (graft.config.ts, content/, .graft/).
 *
 * Do not use `import.meta.url` relative to this file. Astro and Next bundle
 * this module into prerender chunks, so that URL becomes
 * `dist/server/.prerender/...` instead of `packages/content`.
 */
const resolveContentRoot = (): string => {
  const fromEnv = process.env.GRAFT_CONTENT_ROOT;
  if (fromEnv) {
    return fromEnv;
  }

  try {
    const require = createRequire(import.meta.url);
    return dirname(require.resolve("@andy-portfolio/content/package.json"));
  } catch {
    // Bundled chunks still walk node_modules; if that fails, guess from cwd.
  }

  const cwd = process.cwd();
  const guesses = [
    cwd,
    join(cwd, "packages/content"),
    join(cwd, "../../packages/content"),
    join(cwd, "../content"),
  ];

  for (const guess of guesses) {
    if (
      existsSync(join(guess, "graft.config.ts")) ||
      existsSync(join(guess, ".graft/index.db"))
    ) {
      return guess;
    }
  }

  throw new Error(
    "Could not resolve @andy-portfolio/content. Set GRAFT_CONTENT_ROOT or run `bun run --filter=@andy-portfolio/content compile` from the monorepo."
  );
};

/** Directory that holds `graft.config.ts`, `content/`, and `.graft/`. */
export const CONTENT_ROOT = resolveContentRoot();

/** Compiled static SQLite index. Rebuild with `graft compile` in this package. */
export const INDEX_PATH = join(CONTENT_ROOT, ".graft/index.db");
