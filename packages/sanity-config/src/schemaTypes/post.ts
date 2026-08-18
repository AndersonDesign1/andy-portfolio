import { defineArrayMember, defineField, defineType } from "sanity";

const MAX_TITLE_LENGTH = 100;
const MAX_EXCERPT_LENGTH = 200;
const MAX_SEO_DESCRIPTION_LENGTH = 160;
const MAX_SEO_TITLE_LENGTH = 60;
const MAX_SLUG_LENGTH = 96;
const EXCERPT_ROWS = 3;
const CODE_ROWS = 10;
const CODE_PREVIEW_LENGTH = 50;

/**
 * Post schema definition
 * Represents a blog post with rich content
 *
 * Uses Sanity's `defineType`/`defineField`/`defineArrayMember` helpers. They are
 * identity functions at runtime and infer the correct type per `type` literal,
 * which is why this file needs no `as` casts.
 */
const postSchema = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(MAX_TITLE_LENGTH),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: MAX_SLUG_LENGTH,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption",
          description: "Text displayed below the image",
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
        }),
      ],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: EXCERPT_ROWS,
      description: "A short summary of the post, used for SEO and previews.",
      validation: (rule) => rule.required().max(MAX_EXCERPT_LENGTH),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Title used for SEO (if different from main title)",
      validation: (rule) => rule.max(MAX_SEO_TITLE_LENGTH),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: EXCERPT_ROWS,
      description: "Description used for SEO (if different from excerpt)",
      validation: (rule) => rule.max(MAX_SEO_DESCRIPTION_LENGTH),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Text displayed below the image",
            }),
          ],
          options: {
            hotspot: true,
          },
        }),
        defineArrayMember({
          type: "object",
          name: "code",
          title: "Code",
          fields: [
            defineField({
              name: "language",
              title: "Language",
              type: "string",
              initialValue: "javascript",
              options: {
                list: [
                  { title: "Javascript", value: "javascript" },
                  { title: "HTML", value: "html" },
                  { title: "CSS", value: "css" },
                  { title: "TypeScript", value: "typescript" },
                  { title: "Python", value: "python" },
                ],
              },
            }),
            defineField({
              name: "code",
              title: "Code",
              type: "text",
              rows: CODE_ROWS,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { code: "code", language: "language" },
            prepare({ code, language }: { code?: string; language?: string }) {
              return {
                title: `Code${language ? ` (${language})` : ""}`,
                subtitle: code?.slice(0, CODE_PREVIEW_LENGTH),
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
  },
});

export default postSchema;
