"use client";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ANIMATION_DURATION_LONG, ANIMATION_EASE_CUBIC } from "@/lib/constants";
import { urlFor } from "@andy-portfolio/sanity-config";

// PortableText block types
type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

type SanityImage = {
  asset: { _ref: string; _type: string };
  alt?: string;
  caption?: string;
};

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
};

type SanityPost = {
  title: string;
  body: PortableTextBlock[];
  _createdAt: string;
  publishedAt?: string;
  mainImage?: SanityImage;
  categories?: (Category | null)[];
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <motion.figure
        animate={{ opacity: 1, scale: 1 }}
        className="my-10"
        initial={{ opacity: 0, scale: 1.05 }}
        transition={{
          duration: ANIMATION_DURATION_LONG,
          ease: ANIMATION_EASE_CUBIC,
        }}
      >
        <div className="relative w-full overflow-hidden rounded-lg">
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
          <figcaption className="mt-4 text-center text-gray-400 text-sm italic">
            {value.caption}
          </figcaption>
        )}
      </motion.figure>
    ),
    code: ({ value }) => (
      <motion.pre
        animate={{ opacity: 1, y: 0 }}
        className="my-6 overflow-x-auto rounded-lg bg-zinc-800 p-4"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.4 }}
      >
        <code className="font-mono text-gray-200 text-sm">{value.code}</code>
      </motion.pre>
    ),
  },
  block: {
    h1: ({ children }) => (
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 mb-4 font-bold text-4xl text-light-heading dark:text-dark-heading"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children }) => (
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 mb-4 font-bold text-3xl text-light-heading dark:text-dark-heading"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.h2>
    ),
    h3: ({ children }) => (
      <motion.h3
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 mb-3 font-bold text-2xl text-light-heading dark:text-dark-heading"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.h3>
    ),
    normal: ({ children }) => (
      <motion.p
        animate={{ opacity: 1 }}
        className="mb-6 text-light-text leading-relaxed dark:text-dark-text"
        initial={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.p>
    ),
    blockquote: ({ children }) => (
      <motion.blockquote
        animate={{ opacity: 1, x: 0 }}
        className="my-6 border-blue-500 border-l-4 pl-4 text-light-text italic dark:text-dark-text"
        initial={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = value.href.startsWith("/")
        ? undefined
        : "noreferrer noopener";
      return (
        <a
          className="text-blue-400 underline transition-colors hover:text-blue-300"
          href={value.href}
          rel={rel}
          target={value.href.startsWith("/") ? undefined : "_blank"}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-gray-200 text-sm">
        {children}
      </code>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-light-heading dark:text-dark-heading">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="text-light-text italic dark:text-dark-text">{children}</em>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-inside list-disc space-y-2 pl-4 text-light-text dark:text-dark-text">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-inside list-decimal space-y-2 pl-4 text-light-text dark:text-dark-text">
        {children}
      </ol>
    ),
  },
};

export default function BlogPost({ post }: { post: SanityPost }) {
  const { ref: postRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="min-h-screen bg-light-bg pt-28 pb-20 transition-colors duration-300 dark:bg-dark-bg"
      ref={postRef}
    >
      <div className="mx-auto max-w-screen-md px-6">
        <Link
          className="mb-10 inline-flex items-center font-medium text-light-mini transition-colors duration-300 hover:text-blue-400 dark:text-dark-mini"
          href="/blog"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Blog
        </Link>

        <article className="mx-auto max-w-4xl">
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 font-extrabold text-4xl text-light-heading tracking-tight md:text-6xl dark:text-dark-heading"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {post.title}
          </motion.h1>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {post.categories
                ?.filter(
                  (cat): cat is Category =>
                    !!cat && !!cat.slug && !!cat.slug.current
                )
                .map((cat) => (
                  <Link
                    className="inline-block rounded-full bg-blue-900 px-3 py-1 font-medium text-blue-200 text-xs transition hover:bg-blue-800"
                    href={`/blog/category/${cat.slug.current}`}
                    key={cat._id}
                  >
                    {cat.title}
                  </Link>
                ))}
            </motion.div>
          )}

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-lg text-light-mini dark:text-dark-mini"
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {new Date(post.publishedAt || post._createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </motion.p>

          {post.mainImage && (
            <motion.figure
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10"
              initial={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: ANIMATION_DURATION_LONG,
                ease: ANIMATION_EASE_CUBIC,
              }}
            >
              <div className="relative w-full overflow-hidden rounded-xl">
                <Image
                  alt={post.mainImage.alt || post.title}
                  className="h-auto w-full object-contain"
                  height={600}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  src={
                    urlFor(post.mainImage).url() ||
                    "/placeholder.svg?height=600&width=1200"
                  }
                  width={800}
                />
              </div>
              {post.mainImage.caption && (
                <figcaption className="mt-4 text-center text-gray-400 text-sm italic">
                  {post.mainImage.caption}
                </figcaption>
              )}
            </motion.figure>
          )}

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PortableText components={components} value={post.body} />
          </motion.div>
        </article>
      </div>
    </section>
  );
}
