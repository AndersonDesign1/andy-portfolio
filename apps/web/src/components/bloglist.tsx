"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}
interface SanityPost {
  title: string;
  slug: { current: string };
  excerpt?: string;
  _createdAt: string;
  publishedAt?: string;
  categories?: (Category | null)[];
}

export default function BlogList({ posts }: { posts: SanityPost[] }) {
  const { ref: blogRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="min-h-screen bg-primary py-24 pt-48 md:py-32 md:pt-64"
      ref={blogRef}
    >
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="mb-24 flex items-end justify-between border-subtle border-b pb-8">
          <div>
            <h1 className="mb-4 font-mono text-primary text-sm uppercase tracking-widest">
              Writing
            </h1>
            <p className="max-w-md text-lg text-secondary leading-relaxed md:text-xl">
              Thoughts, tutorials, and insights on engineering, design, and
              growing digital products.
            </p>
          </div>
          <span className="mb-1 font-mono text-muted text-sm">
            {posts.length} Posts
          </span>
        </div>

        <div className="flex flex-col">
          {posts.map((post, i) => (
            <motion.div
              className="group border-subtle border-b last:border-none"
              initial={{ opacity: 0, y: 20 }}
              key={post.slug.current}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Link
                className="flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-16 md:py-12"
                href={`/blog/${post.slug.current}`}
              >
                <span className="w-24 shrink-0 font-mono text-muted text-sm">
                  {new Date(post.publishedAt || post._createdAt).getFullYear()}
                </span>

                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-2xl text-primary tracking-tight transition-opacity duration-200 group-hover:opacity-60 md:text-3xl">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="max-w-xl text-base text-secondary leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
