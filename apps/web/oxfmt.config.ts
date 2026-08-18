import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  // CLAUDE.md is a symlink to AGENTS.md (git mode 120000). Windows checkouts
  // without `core.symlinks` materialize it as a text file containing the literal
  // target path, which oxfmt then "fixes" by appending a newline — rewriting the
  // symlink target to `AGENTS.md\n` and breaking it on macOS/Linux/CI.
  // Formatting a link is meaningless anyway: the real file is AGENTS.md.
  ignorePatterns: [...(ultracite.ignorePatterns ?? []), "CLAUDE.md"],
});
