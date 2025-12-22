import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "anderson-sanity-studio",
  deployment: {
    appId: 's9i5d5yl6ivwrst0eno9eb0c',
  },
});
