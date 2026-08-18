import { defineConfig } from "oxlint";

import {
  antiSlopPlugin,
  antiSlopRules,
} from "../../tools/oxlint/anti-slop.shared.mts";

// Lint only — Biome owns formatting here (see the root biome.jsonc).
export default defineConfig({
  jsPlugins: [antiSlopPlugin],
  rules: { ...antiSlopRules },
});
