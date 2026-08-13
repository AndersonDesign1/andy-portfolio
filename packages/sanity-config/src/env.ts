/**
 * Environment variables for Sanity configuration
 */

/**
 * The Sanity project ID from environment variables
 */
export const projectId: string | undefined =
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;

/**
 * The Sanity dataset name from environment variables
 */
export const dataset: string | undefined =
  process.env.PUBLIC_SANITY_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET;

/**
 * Validates that required environment variables are set
 * @returns True if all required variables are set, false otherwise
 */
export const validateEnv = (): boolean => {
  return Boolean(projectId && dataset);
};
