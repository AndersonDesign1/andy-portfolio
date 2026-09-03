/**
 * Graft handle for the Astro site — reads the compiled static SQLite index
 * shared with Next via `@andy-portfolio/content`.
 * Server-only: import from .astro frontmatter and endpoints, never islands.
 */
import { existsSync } from "node:fs";

import { collections } from "@andy-portfolio/content";
import { getIndexPath } from "@andy-portfolio/content/paths";
import { openStaticIndex } from "@usegraft/db";
import { createGraft } from "@usegraft/sdk-astro";
import type { Graft } from "@usegraft/sdk-astro";

type SiteGraft = Graft<typeof collections>;
type SiteGraftReads = Pick<
  SiteGraft,
  "getContent" | "listContent" | "searchContent"
>;

let cached: SiteGraft | null = null;

const openGraft = async (): Promise<SiteGraft> => {
  if (cached) {
    return cached;
  }
  const indexPath = getIndexPath();
  if (!existsSync(indexPath)) {
    throw new Error(
      `Compiled Graft index not found at ${indexPath}. Run \`bun run --filter=@andy-portfolio/content compile\` first (dev and build scripts do this).`
    );
  }
  const index = await openStaticIndex(indexPath);
  cached = createGraft({ collections, index });
  return cached;
};

/**
 * Typed reads over `posts`, `projects`, and `case-studies`.
 * Methods are async; the SQLite artifact opens once.
 */
export const getGraft = (): SiteGraftReads => ({
  getContent: async (collection, slug, options) => {
    const graft = await openGraft();
    return graft.getContent(collection, slug, options);
  },
  listContent: async (collection, options) => {
    const graft = await openGraft();
    return graft.listContent(collection, options);
  },
  searchContent: async (collection, query, options) => {
    const graft = await openGraft();
    return graft.searchContent(collection, query, options);
  },
});
