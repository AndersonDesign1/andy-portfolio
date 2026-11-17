import { defineConfig } from "oxlint";
import astro from "ultracite/oxlint/astro";
import core from "ultracite/oxlint/core";
import jsPlugins from "ultracite/oxlint/js-plugins";
import react from "ultracite/oxlint/react";

import {
  agentToolingIgnores,
  antiSlopPlugin,
  antiSlopRules,
} from "../../tools/oxlint/anti-slop.shared.mts";

const selectedJsPluginRulePrefixes = new Set(["react-doctor"]);

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
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    ...agentToolingIgnores,
    "scripts/**",
  ],
  jsPlugins: [antiSlopPlugin],
  rules: {
    ...antiSlopRules,
    // A scrollable <section> (a labelled region) needs tabIndex={0} so
    // keyboard users can scroll it in Safari; Chromium and Firefox focus
    // scrollers on their own. The rule only sees explicit roles, and an
    // explicit role="region" on <section> trips no-redundant-roles, so the
    // tag is allowed instead. Everything else stays forbidden.
    "jsx-a11y/no-noninteractive-tabindex": [
      "error",
      { roles: ["tabpanel"], tags: ["section"] },
    ],
  },
});
