/**
 * Common type definitions for Sanity schemas
 */
import type { Rule, DocumentDefinition } from "sanity";

/**
 * Base interface for all schema types
 */
export type SchemaType = {
  name: string;
  title: string;
  type: string;
};

/**
 * Interface for document schema types
 * Using Sanity's built-in DocumentDefinition type
 */
export type DocumentSchema = DocumentDefinition;

/**
 * Interface for field definitions
 */
export type SchemaField = {
  name: string;
  title: string;
  type: string;
  description?: string;
  validation?: (rule: Rule) => Rule;
  options?: Record<string, unknown>;
  fields?: SchemaField[];
  of?: Array<{ type: string } & Partial<SchemaField>>;
  rows?: number;
};

/**
 * Type for language alternatives in code blocks
 */
export type LanguageAlternative = {
  title: string;
  value: string;
};

/**
 * Type for image field with hotspot
 */
export interface ImageField extends SchemaField {
  type: "image";
  options: {
    hotspot: boolean;
  };
  fields?: SchemaField[];
}

/**
 * Type for a plain-object code block (no CodeMirror dependency).
 * Renders as a monospace textarea in Studio and a <pre><code> block on the site.
 */
export interface CodeField extends SchemaField {
  type: "object";
  name: "code";
  fields: SchemaField[];
}

/**
 * Type for slug field
 */
export interface SlugField extends SchemaField {
  type: "slug";
  options: {
    source: string;
    maxLength: number;
  };
}

/**
 * Type for reference field (for use in arrays)
 */
export interface ReferenceField extends SchemaField {
  type: "reference";
  to: { type: string }[];
}

/**
 * Type for array field (now supports reference fields)
 */
export interface ArrayField extends SchemaField {
  type: "array";
  of: Array<({ type: string } & Partial<SchemaField>) | ReferenceField>;
  options?: {
    layout?: "tags" | "grid";
  };
}
