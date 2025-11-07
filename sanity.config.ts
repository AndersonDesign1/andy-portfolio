import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure"; // Updated from deskTool
import { schema } from "./src/sanity/schemaTypes";

/**
 * Sanity configuration
 * Defines the project settings and plugins
 */
export default defineConfig({
  basePath: "/studio",
  projectId: "3zx1ytic",
  dataset: "production",
  plugins: [
    structureTool(), // Updated from deskTool()
    visionTool(),
    codeInput(),
  ],
  schema,
});
