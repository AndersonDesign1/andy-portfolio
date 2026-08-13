import { createClient, type SanityClient } from "@sanity/client";
import { projectId, dataset } from "../env";

/**
 * Sanity client configuration
 */
const clientConfig = {
  projectId: projectId!,
  dataset: dataset || "main",
  apiVersion: "2024-01-01",
  useCdn: process.env.NODE_ENV !== "development",
};

/**
 * Sanity client instance for fetching data
 */
export const client: SanityClient = createClient(clientConfig);
