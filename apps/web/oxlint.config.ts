import path from "node:path";

import { defineConfig } from "oxlint";
import astro from "ultracite/oxlint/astro";
import core from "ultracite/oxlint/core";
import jsPlugins from "ultracite/oxlint/js-plugins";
import react from "ultracite/oxlint/react";

const selectedJsPluginRulePrefixes = new Set(["react-doctor"]);

const antiSlopSpecifier = path.resolve(
  import.meta.dirname,
  "../../tools/oxlint/anti-slop/index.ts"
);

const antiSlopRules = {
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

const selectedJsPlugins = {
  ...jsPlugins,
  jsPlugins: [
    {
      name: "react-doctor",
      specifier: "oxlint-plugin-react-doctor",
    },
  ],
  overrides: jsPlugins.overrides?.map((override) => ({
    ...override,
    rules: Object.fromEntries(
      Object.entries(override.rules ?? {}).filter(([ruleName]) =>
        selectedJsPluginRulePrefixes.has(ruleName.split("/")[0] ?? ruleName)
      )
    ),
  })),
  rules: Object.fromEntries(
    Object.entries(jsPlugins.rules ?? {}).filter(([ruleName]) =>
      selectedJsPluginRulePrefixes.has(ruleName.split("/")[0] ?? ruleName)
    )
  ),
};

export default defineConfig({
  extends: [core, astro, react, selectedJsPlugins],
  ignorePatterns: [...(core.ignorePatterns ?? []), "scripts/**"],
  jsPlugins: [
    {
      name: "anti-slop",
      specifier: antiSlopSpecifier,
    },
  ],
  rules: {
    ...antiSlopRules,
  },
});
