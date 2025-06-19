"use client";
import { motion } from "framer-motion";
import Link from "next/link";

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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1],
      delay: i * 0.12,
    },
  }),
  hover: {
    x: 6,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function BlogList({ posts }: { posts: SanityPost[] }) {
  return (
    <section className="py-20 pt-36 bg-light-bg dark:bg-dark-bg transition-colors duration-300 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
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
            className="text-left mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.25, 0, 1] }}
          >
            <h2 className="text-3xl font-bold mb-4 text-light-heading dark:text-dark-heading transition-colors duration-300">
              Blog
            </h2>
            <p className="text-base text-light-text dark:text-dark-text transition-colors duration-300 max-w-2xl leading-relaxed">
              Insights, tutorials, and stories from my journey in engineering,
              design, and business.
            </p>
          </motion.div>
          <div className="flex flex-col gap-8 sm:gap-12">
            {posts.map((post, i) => (
              <motion.div
                key={post.slug.current}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="group"
              >
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="block h-full group"
                >
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.categories
                        ?.filter(
                          (cat): cat is Category =>
                            !!cat && !!cat.slug && !!cat.slug.current
                        )
                        .map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/blog/category/${cat.slug.current}`}
                            className="inline-block bg-blue-900 text-blue-200 px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium hover:bg-blue-800 transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {cat.title}
                          </Link>
                        ))}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-light-heading dark:text-dark-heading group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {post.title}
                    </h3>
                    <span className="text-sm text-light-mini dark:text-dark-mini transition-colors duration-300">
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
                    <p className="text-base text-light-text dark:text-dark-text mb-2">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-sm hover:underline text-light-mini dark:text-dark-mini transition-colors duration-300">
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
