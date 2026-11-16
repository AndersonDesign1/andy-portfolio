import { defineConfig } from "oxlint";

import { antiSlopOnlyConfig } from "../../tools/oxlint/anti-slop.shared.mts";

// Lint only. Biome owns formatting here (see the root biome.jsonc).
export default defineConfig(antiSlopOnlyConfig);
