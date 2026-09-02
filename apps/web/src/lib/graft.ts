/**
 * Graft handle for the Astro blog — reads the compiled static SQLite index.
 * Server-only: import from .astro frontmatter and endpoints, never islands.
 */
import { existsSync } from "node:fs";
import path from "node:path";

import { openStaticIndex } from "@usegraft/db";
import { createGraft } from "@usegraft/sdk-astro";
import type { Graft } from "@usegraft/sdk-astro";

import { collections } from "../../graft.config";

const INDEX_PATH = path.resolve(process.cwd(), ".graft/index.db");

type BlogGraft = Graft<typeof collections>;
type BlogGraftReads = Pick<
  BlogGraft,
  "getContent" | "listContent" | "searchContent"
>;

let cached: BlogGraft | null = null;

const openGraft = async (): Promise<BlogGraft> => {
  if (cached) {
    return cached;
  }
  if (!existsSync(INDEX_PATH)) {
    throw new Error(
      `Compiled Graft index not found at ${INDEX_PATH}. Run \`graft compile\` from apps/web first (dev and build scripts do this).`
    );
  }
  const index = await openStaticIndex(INDEX_PATH);
  cached = createGraft({ collections, index });
  return cached;
};

/**
 * Typed reads over `posts`. Methods are async; the SQLite artifact opens once.
 */
export const getGraft = (): BlogGraftReads => ({
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
