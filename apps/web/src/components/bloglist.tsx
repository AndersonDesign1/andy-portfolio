"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  ANIMATION_DELAY_STAGGER,
  ANIMATION_DURATION_MEDIUM,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
};
type SanityPost = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  _createdAt: string;
  publishedAt?: string;
  categories?: (Category | null)[];
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION_MEDIUM,
      ease: ANIMATION_EASE_CUBIC,
      delay: i * ANIMATION_DELAY_STAGGER,
    },
  }),
  hover: {
    x: 6,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function BlogList({ posts }: { posts: SanityPost[] }) {
  const { ref: blogRef } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="min-h-screen bg-primary py-24 md:py-32 pt-48 md:pt-64"
      ref={blogRef}
    >
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="mb-24 flex items-end justify-between border-b border-subtle pb-8">
          <div>
            <h1 className="text-primary text-sm font-mono tracking-widest uppercase mb-4">
              Writing
            </h1>
            <p className="text-secondary text-lg md:text-xl max-w-md leading-relaxed">
              Thoughts, tutorials, and insights on engineering, design, and growing digital products.
            </p>
          </div>
          <span className="text-muted text-sm font-mono mb-1">
            {posts.length} Posts
          </span>
        </div>

        <div className="flex flex-col">
          {posts.map((post, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              key={post.slug.current}
              className="group border-b border-subtle last:border-none"
            >
              <Link
                href={`/blog/${post.slug.current}`}
                className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-16 py-8 md:py-12"
              >
                <span className="font-mono text-sm text-muted shrink-0 w-24">
                  {new Date(post.publishedAt || post._createdAt).getFullYear()}
                </span>
                
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-secondary text-sm max-w-xl leading-relaxed opacity-0 transform -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 h-0 group-hover:h-auto overflow-hidden">
                      {post.excerpt}
                    </p>
                  )}
                  {/* Mobile excerpt static if needed, but keeping it clean for now */}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
