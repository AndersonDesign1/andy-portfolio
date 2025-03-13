import { createClient, type SanityClient, type ClientConfig } from "@sanity/client"

/**
 * Sanity client configuration
 */
const clientConfig: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
}

/**
 * Sanity client instance for fetching data
 */
export const client: SanityClient = createClient(clientConfig)

