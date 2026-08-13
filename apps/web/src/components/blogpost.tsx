"use client";

import { urlFor } from "@andy-portfolio/sanity-config";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

interface PortableTextBlock {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

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

interface SanityPost {
  _createdAt: string;
  body: PortableTextBlock[];
  categories?: (Category | null)[];
  mainImage?: SanityImage;
  publishedAt?: string;
  title: string;
}

const components: PortableTextComponents = {
  block: {
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-primary border-l-2 pl-6 text-primary text-xl italic">
        {children}
      </blockquote>
    ),
    h1: ({ children }) => (
      <h1 className="mt-12 mb-6 font-bold text-3xl text-primary tracking-tight md:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-6 font-bold text-2xl text-primary tracking-tight md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-4 font-bold text-primary text-xl tracking-tight md:text-2xl">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-lg text-secondary leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 flex list-outside list-disc flex-col gap-2 pl-4 text-lg text-secondary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 flex list-outside list-decimal flex-col gap-2 pl-4 text-lg text-secondary">
        {children}
      </ol>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-secondary/10 px-1.5 py-0.5 font-mono text-primary text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      if (!value?.href || typeof value.href !== "string") {
        return <span>{children}</span>;
      }
      const isInternal = value.href.startsWith("/");
      if (isInternal) {
        return (
          <a
            className="text-primary underline decoration-subtle underline-offset-4 transition-all hover:decoration-primary"
            href={value.href}
          >
            {children}
          </a>
        );
      }
      return (
        <a
          className="text-primary underline decoration-subtle underline-offset-4 transition-all hover:decoration-primary"
          href={value.href}
          rel="noreferrer noopener"
          target="_blank"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
  },
  types: {
    code: ({ value }) => (
      <pre className="my-8 overflow-x-auto rounded-sm border border-subtle bg-secondary/10 p-4">
        <code className="font-mono text-primary text-sm">{value.code}</code>
      </pre>
    ),
    image: ({ value }) => (
      <figure className="my-12 md:my-16">
        <div className="relative w-full overflow-hidden rounded-sm bg-secondary/5">
          <img
            alt={value.alt || "Blog post image"}
            className="h-auto w-full object-contain"
            height={500}
            loading="lazy"
            src={urlFor(value).url() || "/placeholder.svg?height=500&width=800"}
            width={800}
          />
        </div>
        {value.caption && (
          <figcaption className="pt-4 text-center font-mono text-muted text-sm">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};

export default function BlogPost({ post }: { post: SanityPost }) {
  return (
    <section className="min-h-screen bg-primary pt-40 pb-24 md:pt-48">
      <div className="mx-auto max-w-screen-md px-6">
        <a
          className="inline-flex items-center gap-2 font-mono text-muted text-sm transition-colors hover:text-primary"
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
              <h1 className="pb-8 font-bold text-4xl text-primary leading-tight tracking-tighter md:text-6xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 font-mono text-muted text-sm">
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
                <div className="relative w-full overflow-hidden rounded-sm bg-secondary/5">
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
                  <figcaption className="pt-4 text-center font-mono text-muted text-sm">
                    {post.mainImage.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="prose prose-lg max-w-none">
              <PortableText components={components} value={post.body} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
