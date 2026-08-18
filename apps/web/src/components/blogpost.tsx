"use client";

import { urlFor } from "@andy-portfolio/sanity-config";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import type { ComponentProps } from "react";
import { z } from "zod";

interface SanityImage {
  alt?: string;
  asset: { _ref: string; _type: string };
  caption?: string;
}

interface Category {
  _id: string;
  description?: string;
  slug: { current: string };
  title: string;
}

export interface SanityPost {
  _createdAt: string;
  body: ComponentProps<typeof PortableText>["value"];
  categories?: (Category | null)[];
  excerpt?: string;
  mainImage?: SanityImage;
  publishedAt?: string;
  slug: { current: string };
  title: string;
}

const linkMarkSchema = z.object({ href: z.string() });

/**
 * Built per post so body figures can fall back to the post title for their
 * accessible name, matching how the hero image is handled below.
 */
const createComponents = (postTitle: string): PortableTextComponents => ({
  block: {
    blockquote: ({ children }) => (
      <blockquote className="border-primary text-primary border-l-2 py-2 pl-6 text-xl italic">
        {children}
      </blockquote>
    ),
    h1: ({ children }) => (
      <h1 className="text-primary pt-6 text-3xl font-bold tracking-tight md:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-primary pt-6 text-2xl font-bold tracking-tight md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-primary pt-2 text-xl font-bold tracking-tight md:text-2xl">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-secondary text-lg leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-secondary flex list-outside list-disc flex-col gap-2 pl-4 text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-secondary flex list-outside list-decimal flex-col gap-2 pl-4 text-lg">
        {children}
      </ol>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="bg-secondary/10 text-primary rounded px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const linkMark = linkMarkSchema.safeParse(value);
      if (!linkMark.success) {
        return <span>{children}</span>;
      }
      const { href } = linkMark.data;
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <a
            className="text-primary decoration-subtle hover:decoration-primary underline underline-offset-4 transition-colors duration-150"
            href={href}
          >
            {children}
          </a>
        );
      }
      return (
        <a
          className="text-primary decoration-subtle hover:decoration-primary underline underline-offset-4 transition-colors duration-150"
          href={href}
          rel="noreferrer noopener"
          target="_blank"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="text-primary font-semibold">{children}</strong>
    ),
  },
  types: {
    code: ({ value }) => (
      <pre className="border-subtle bg-secondary/10 overflow-x-auto rounded-sm border p-4">
        <code className="text-primary font-mono text-sm">{value.code}</code>
      </pre>
    ),
    image: ({ value }) => (
      <figure className="flex flex-col gap-4 py-6 md:py-10">
        <div className="bg-secondary/5 relative w-full overflow-hidden rounded-sm">
          <img
            alt={value.alt || value.caption || `Figure from ${postTitle}`}
            className="h-auto w-full object-contain"
            height={500}
            loading="lazy"
            src={urlFor(value).url() || "/placeholder.svg?height=500&width=800"}
            width={800}
          />
        </div>
        {value.caption && (
          <figcaption className="text-muted text-center font-mono text-sm">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
});

const BlogPost = ({ post }: { post: SanityPost }) => (
  <section className="bg-primary min-h-screen pt-40 pb-24 md:pt-48">
    <div className="mx-auto max-w-screen-md px-6">
      <a
        className="text-muted hover:text-primary inline-flex items-center gap-2 font-mono text-sm transition-colors"
        href="/blog"
      >
        <HugeiconsIcon
          color="currentColor"
          icon={ArrowLeft01Icon}
          size={16}
          strokeWidth={1.5}
        />
        Back to Writing
      </a>
      <div className="pt-12">
        <article>
          <div className="border-subtle border-b pb-8">
            <h1 className="text-primary pb-8 text-4xl leading-tight font-bold tracking-tighter md:text-6xl">
              {post.title}
            </h1>

            <div className="text-muted flex flex-wrap items-center gap-6 font-mono text-sm">
              <span>
                {new Date(
                  post.publishedAt || post._createdAt
                ).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>

              {post.categories && post.categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>/</span>
                  {post.categories
                    .filter((cat): cat is Category => !!cat)
                    .map((cat, i) => (
                      <span key={cat._id}>
                        {cat.title}
                        {i < (post.categories?.length || 0) - 1 && ", "}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          {post.mainImage && (
            <figure className="pt-16 pb-12 md:pb-16">
              <div className="bg-secondary/5 relative w-full overflow-hidden rounded-sm">
                <img
                  alt={post.mainImage.alt || post.title}
                  className="h-auto w-full object-cover"
                  height={600}
                  src={
                    urlFor(post.mainImage).url() ||
                    "/placeholder.svg?height=600&width=1200"
                  }
                  width={1200}
                />
              </div>
              {post.mainImage.caption && (
                <figcaption className="text-muted pt-4 text-center font-mono text-sm">
                  {post.mainImage.caption}
                </figcaption>
              )}
            </figure>
          )}

          <div className="flex max-w-none flex-col gap-6">
            <PortableText
              components={createComponents(post.title)}
              value={post.body}
            />
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default BlogPost;
