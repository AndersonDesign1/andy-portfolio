import path from "node:path";

/**
 * Shared anti-slop wiring for workspaces that are formatted by Biome.
 *
 * `apps/web` deliberately does NOT use this: it runs the full Ultracite
 * Oxlint/Oxfmt stack and registers the plugin itself in its own
 * `oxlint.config.ts`.
 *
 * Everything here is lint-only. No stylistic rules are enabled, because Biome
 * owns formatting in these workspaces and Ultracite's `core` preset would fight
 * it (`sort-keys`, `arrow-body-style`, …).
 */
export const antiSlopSpecifier = path.resolve(
  import.meta.dirname,
  "anti-slop/index.ts"
);

export const antiSlopPlugin = {
  name: "anti-slop",
  specifier: antiSlopSpecifier,
};

export const antiSlopRules = {
  "anti-slop/no-chained-type-assertions": "error",
  "anti-slop/no-conditional-empty-object-spread": "error",
  "anti-slop/no-known-value-widening": "error",
  "anti-slop/no-module-mocking": "error",
  "anti-slop/no-object-parameters": "error",
  "anti-slop/no-reflect-apply": "error",
  "anti-slop/no-reflect-get": "error",
  "anti-slop/no-runtime-typeof": "error",
  "anti-slop/no-shape-in-symbol-names": "error",
  "anti-slop/no-unknown-parameters": "error",
  "anti-slop/no-unknown-returns": "error",
  "anti-slop/no-unknown-type-aliases": "error",
  "anti-slop/no-unsafe-dictionary-type": "error",
  "anti-slop/no-widen-then-assert": "error",
  "anti-slop/require-safety-comment-for-type-assertion": "error",
} as const;
