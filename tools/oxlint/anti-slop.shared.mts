import path from "node:path";

/**
 * Shared anti-slop wiring. Single source of truth for which rules are on.
 *
 * - `apps/web` registers the plugin in its own `oxlint.config.ts` (full
 *   Ultracite Oxlint/Oxfmt stack) and spreads `antiSlopRules` from here.
 * - Biome-formatted workspaces (`packages/*`) use `antiSlopOnlyConfig`: lint
 *   only, no stylistic presets, because Biome owns formatting there and
 *   Ultracite's `core` preset would fight it (`sort-keys`, `arrow-body-style`).
 *
 * Rule list matches upstream dmmulroy/anti-slop 13909c9 (see anti-slop/UPSTREAM.md).
 */
export const antiSlopPlugin = {
  name: "anti-slop",
  specifier: path.resolve(import.meta.dirname, "anti-slop/index.ts"),
};

export const antiSlopRules = {
  "anti-slop/no-array-filter-map": "error",
  "anti-slop/no-chained-type-assertions": "error",
  "anti-slop/no-conditional-empty-object-spread": "error",
  "anti-slop/no-known-value-widening": "error",
  "anti-slop/no-module-mocking": "error",
  "anti-slop/no-object-parameters": "error",
  "anti-slop/no-reduce-accumulator-copy": "error",
  "anti-slop/no-reflect-apply": "error",
  "anti-slop/no-reflect-get": "error",
  "anti-slop/no-runtime-typeof": "error",
  "anti-slop/no-shape-in-symbol-names": "error",
  "anti-slop/no-unknown-parameters": "error",
  "anti-slop/no-unknown-returns": "error",
  "anti-slop/no-unknown-type-aliases": "error",
  "anti-slop/no-unsafe-dictionary-type": "error",
  "anti-slop/no-widen-then-assert": "error",
  "anti-slop/require-readable-spacing": "error",
  "anti-slop/require-safety-comment-for-type-assertion": "error",
} as const;

/** Project-local agent tooling: installed skills and hooks, not application source. */
export const agentToolingIgnores = [
  ".agent/**",
  ".agents/**",
  ".claude/**",
  ".codex/**",
  ".continue/**",
  ".cursor/**",
  ".gemini/**",
  ".opencode/**",
  ".pi/**",
  ".roo/**",
  ".windsurf/**",
];

export const antiSlopOnlyConfig = {
  ignorePatterns: [...agentToolingIgnores, "node_modules/**", "results/**"],
  jsPlugins: [antiSlopPlugin],
  rules: { ...antiSlopRules },
};
