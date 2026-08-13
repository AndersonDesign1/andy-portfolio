import { createClient, type SanityClient } from "@sanity/client";
import { projectId, dataset } from "../env";

if (!projectId) {
  throw new Error(
    "Missing Sanity project id (PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_STUDIO_PROJECT_ID)"
  );
}

if (!dataset) {
  throw new Error(
    "Missing Sanity dataset (PUBLIC_SANITY_DATASET / NEXT_PUBLIC_SANITY_DATASET / SANITY_STUDIO_DATASET)"
  );
}

/**
 * Sanity client configuration
 */
const clientConfig = {
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV !== "development",
};

/**
 * Sanity client instance for fetching data
 */
export const client: SanityClient = createClient(clientConfig);
