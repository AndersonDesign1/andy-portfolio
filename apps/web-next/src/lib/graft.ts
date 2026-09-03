/**
 * Graft handle for the Next archive — reads the same compiled static SQLite
 * index as Astro via `@andy-portfolio/content`.
 * Server-only: import from Server Components, route handlers, and metadata.
 */
import { existsSync } from "node:fs";

import { collections } from "@andy-portfolio/content";
import { INDEX_PATH } from "@andy-portfolio/content/paths";
import { openStaticIndex } from "@usegraft/db";
import type { Graft } from "@usegraft/sdk-next";
import { createGraft } from "@usegraft/sdk-next";

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
  if (!existsSync(INDEX_PATH)) {
    throw new Error(
      `Compiled Graft index not found at ${INDEX_PATH}. Run \`bun run --filter=@andy-portfolio/content compile\` first (dev and build scripts do this).`
    );
  }
  const index = await openStaticIndex(INDEX_PATH);
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
