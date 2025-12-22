"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PortableText } from "@portabletext/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

// PortableText block types
type PortableTextBlock = {
  _type: string;
  _key: string;
  [key: string]: unknown;
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  body?: PortableTextBlock[];
  _createdAt: string;
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
    caption?: string;
  };
  categories?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    description?: string;
  }>;
};

type BlogPostProps = {
  post: Post;
};

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <div className="min-h-screen bg-light-bg pt-24 transition-colors duration-300 dark:bg-dark-bg">
      <div className="mx-auto max-w-screen-xl px-4 py-20 sm:px-8 md:px-16 lg:px-[150px]">
        {/* Back Navigation */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 text-light-mini text-sm transition-colors duration-300 hover:text-light-heading dark:text-dark-mini dark:hover:text-dark-heading"
            href="/blog"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 font-bold text-4xl text-light-heading lg:text-5xl dark:text-dark-heading"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {post.title}
          </motion.h1>

          {/* Meta Information */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center gap-4 text-light-mini text-sm dark:text-dark-mini"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span>
              {new Date(post.publishedAt || post._createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
            {post.categories && post.categories.length > 0 && (
              <>
                <span>•</span>
                <span>{post.categories[0].title}</span>
              </>
            )}
          </motion.div>

          {/* Featured Image */}
          {post.mainImage && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Image
                alt={post.title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                src={post.mainImage.asset.url}
              />
            </motion.div>
          )}

          {/* Article Body */}
          {post.body && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg max-w-none prose-a:text-blue-600 prose-headings:text-light-heading prose-p:text-light-text prose-strong:text-light-heading prose-a:dark:text-blue-400 prose-headings:dark:text-dark-heading prose-p:dark:text-dark-text prose-strong:dark:text-dark-heading"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <PortableText value={post.body} />
            </motion.div>
          )}
        </motion.article>
      </div>
    </div>
  );
}
