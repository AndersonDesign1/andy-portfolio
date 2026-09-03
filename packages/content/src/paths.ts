import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Directory that holds `graft.config.ts`, `content/`, and `.graft/`. */
export const CONTENT_ROOT = dirname(
  fileURLToPath(new URL("../graft.config.ts", import.meta.url))
);

/** Compiled static SQLite index. Rebuild with `graft compile` in this package. */
export const INDEX_PATH = join(CONTENT_ROOT, ".graft/index.db");
