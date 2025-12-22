import { createClient, type SanityClient } from "@sanity/client";
import { projectId, dataset } from "../env";

/**
 * Sanity client configuration
 */
const clientConfig = {
  projectId: projectId!,
  dataset: dataset || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
};

/**
 * Sanity client instance for fetching data
 */
export const client: SanityClient = createClient(clientConfig);
