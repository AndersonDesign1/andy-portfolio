import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const looksLikeContentRoot = (root: string): boolean =>
  existsSync(join(root, "graft.config.ts")) ||
  existsSync(join(root, ".graft/index.db"));

/**
 * Resolve the content package root (graft.config.ts, content/, .graft/).
 *
 * Do not trust `import.meta.url` relative to this file. Astro prerender
 * rewrites it to `dist/server/.prerender`, and Next Turbopack can resolve
 * the package to a virtual `[project]/packages/content` path that is not
 * on disk. Always confirm the candidate exists before using it.
 */
const resolveContentRoot = (): string => {
  const fromEnv = process.env.GRAFT_CONTENT_ROOT;
  if (fromEnv && looksLikeContentRoot(fromEnv)) {
    return fromEnv;
  }

  try {
    const require = createRequire(import.meta.url);
    const fromPackage = dirname(
      require.resolve("@andy-portfolio/content/package.json")
    );
    if (looksLikeContentRoot(fromPackage)) {
      return fromPackage;
    }
  } catch {
    // Bundled / virtual module URLs fall through to cwd guesses.
  }

  const cwd = process.cwd();
  const guesses = [
    cwd,
    join(cwd, "packages/content"),
    join(cwd, "../../packages/content"),
    join(cwd, "../content"),
  ];

  for (const guess of guesses) {
    if (looksLikeContentRoot(guess)) {
      return guess;
    }
  }

  throw new Error(
    "Could not resolve @andy-portfolio/content. Set GRAFT_CONTENT_ROOT or run `bun run --filter=@andy-portfolio/content compile` from the monorepo."
  );
};

/** Directory that holds `graft.config.ts`, `content/`, and `.graft/`. */
export const getContentRoot = (): string => resolveContentRoot();

/** Compiled static SQLite index. Rebuild with `graft compile` in this package. */
export const getIndexPath = (): string =>
  join(resolveContentRoot(), ".graft/index.db");
