import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "@andy-portfolio/sanity-config/schemas";
import { structure } from "@andy-portfolio/sanity-config";
import { codeInput } from "@sanity/code-input";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "andy-portfolio-studio",
  title: "Andy Portfolio Studio",

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure,
    }),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});
