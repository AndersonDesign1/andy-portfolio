import type { SchemaTypeDefinition } from "sanity";
import category from "./category";
import post from "./post";

/**
 * Array of all schema types
 */
export const schemaTypes: SchemaTypeDefinition[] = [post, category];

/**
 * Schema configuration object
 */
export const schema = {
  types: schemaTypes,
};
