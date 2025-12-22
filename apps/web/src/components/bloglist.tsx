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
      className="min-h-screen bg-light-bg py-20 pt-36 transition-colors duration-300 dark:bg-dark-bg"
      ref={blogRef}
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-8">
        <motion.div
          animate="visible"
          initial="hidden"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-left sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            transition={{
              duration: ANIMATION_DURATION_MEDIUM,
              ease: ANIMATION_EASE_CUBIC,
            }}
          >
            <h2 className="mb-4 font-bold text-3xl text-light-heading transition-colors duration-300 dark:text-dark-heading">
              Blog
            </h2>
            <p className="max-w-2xl text-base text-light-text leading-relaxed transition-colors duration-300 dark:text-dark-text">
              Insights, tutorials, and stories from my journey in engineering,
              design, and business.
            </p>
          </motion.div>
          <div className="flex flex-col gap-8 sm:gap-12">
            {posts.map((post, i) => (
              <motion.div
                animate="visible"
                className="group"
                custom={i}
                initial="hidden"
                key={post.slug.current}
                variants={cardVariants}
                whileHover="hover"
              >
                <Link
                  className="group block h-full"
                  href={`/blog/${post.slug.current}`}
                >
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.categories
                        ?.filter(
                          (cat): cat is Category =>
                            !!cat && !!cat.slug && !!cat.slug.current
                        )
                        .map((cat) => (
                          <Link
                            className="inline-block rounded-full bg-blue-900 px-2 py-0.5 font-medium text-blue-200 text-xs transition hover:bg-blue-800 sm:px-3"
                            href={`/blog/category/${cat.slug.current}`}
                            key={cat._id}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {cat.title}
                          </Link>
                        ))}
                    </div>
                  )}
                  <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-bold text-2xl text-light-heading transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <span className="text-light-mini text-sm transition-colors duration-300 dark:text-dark-mini">
                      {new Date(
                        post.publishedAt || post._createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="mb-2 text-base text-light-text dark:text-dark-text">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-light-mini text-sm transition-colors duration-300 hover:underline dark:text-dark-mini">
                    Read more <span aria-hidden>→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
