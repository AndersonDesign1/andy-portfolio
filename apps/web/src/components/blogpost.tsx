"use client";
import { urlFor } from "@andy-portfolio/sanity-config";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ANIMATION_DURATION_LONG, ANIMATION_EASE_CUBIC } from "@/lib/constants";

interface PortableTextBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

interface SanityImage {
  asset: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

interface SanityPost {
  title: string;
  body: PortableTextBlock[];
  _createdAt: string;
  publishedAt?: string;
  mainImage?: SanityImage;
  categories?: (Category | null)[];
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <motion.figure
        animate={{ opacity: 1, scale: 1 }}
        className="my-12 md:my-16"
        initial={{ opacity: 0, scale: 1.05 }}
        transition={{
          duration: ANIMATION_DURATION_LONG,
          ease: ANIMATION_EASE_CUBIC,
        }}
      >
        <div className="relative w-full overflow-hidden rounded-sm bg-secondary/5">
          <Image
            alt={value.alt || "Blog post image"}
            className="h-auto w-full object-contain"
            height={500}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            src={urlFor(value).url() || "/placeholder.svg?height=500&width=800"}
            width={800}
          />
        </div>
        {value.caption && (
          <figcaption className="mt-4 text-center font-mono text-muted text-sm">
            {value.caption}
          </figcaption>
        )}
      </motion.figure>
    ),
    code: ({ value }) => (
      <motion.pre
        animate={{ opacity: 1, y: 0 }}
        className="my-8 overflow-x-auto rounded-sm border border-subtle bg-secondary/10 p-4"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
      >
        <code className="font-mono text-primary text-sm">{value.code}</code>
      </motion.pre>
    ),
  },
  block: {
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
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-primary border-l-2 pl-6 text-primary text-xl italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = value.href.startsWith("/")
        ? undefined
        : "noreferrer noopener";
      return (
        <a
          className="text-primary underline decoration-subtle underline-offset-4 transition-all hover:decoration-primary"
          href={value.href}
          rel={rel}
          target={value.href.startsWith("/") ? undefined : "_blank"}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded bg-secondary/10 px-1.5 py-0.5 font-mono text-primary text-sm">
        {children}
      </code>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-outside list-disc space-y-2 pl-4 text-lg text-secondary">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-outside list-decimal space-y-2 pl-4 text-lg text-secondary">
        {children}
      </ol>
    ),
  },
};

export default function BlogPost({ post }: { post: SanityPost }) {
  const { ref: postRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="min-h-screen bg-primary pt-48 pb-24 md:pt-64"
      ref={postRef}
    >
      <div className="mx-auto max-w-screen-md px-6">
        <Link
          className="mb-12 inline-flex items-center font-mono text-muted text-sm transition-colors hover:text-primary"
          href="/blog"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Writing
        </Link>

        <article>
          {/* Header */}
          <div className="mb-16 border-subtle border-b pb-8">
            <h1 className="mb-8 font-bold text-4xl text-primary leading-tight tracking-tighter md:text-6xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 font-mono text-muted text-sm">
              <span>
                {new Date(
                  post.publishedAt || post._createdAt
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
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

          {/* Main Image */}
          {post.mainImage && (
            <motion.figure
              animate={{ opacity: 1, scale: 1 }}
              className="mb-16"
              initial={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: ANIMATION_DURATION_LONG,
                ease: ANIMATION_EASE_CUBIC,
              }}
            >
              <div className="relative w-full overflow-hidden rounded-sm bg-secondary/5">
                <Image
                  alt={post.mainImage.alt || post.title}
                  className="h-auto w-full object-cover"
                  height={600}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  src={
                    urlFor(post.mainImage).url() ||
                    "/placeholder.svg?height=600&width=1200"
                  }
                  width={1200}
                />
              </div>
            </motion.figure>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <PortableText components={components} value={post.body} />
          </div>
        </article>
      </div>
    </section>
  );
}
