import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const ANIMATION_DELAY_MULTIPLIER = 0.1;

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
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
}

interface BlogListProps {
  posts: Post[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="min-h-screen bg-light-bg pt-24 transition-colors duration-300 dark:bg-dark-bg">
      <div className="mx-auto max-w-screen-xl px-4 py-20 sm:px-8 md:px-16 lg:px-[150px]">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 pb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-bold text-4xl text-light-heading dark:text-dark-heading">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-light-text dark:text-dark-text">
            Thoughts, insights, and lessons learned from my journey in web
            development and SEO.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className="group overflow-hidden rounded-lg bg-light-bg shadow-sm transition-all duration-300 hover:shadow-md dark:bg-dark-bg"
              initial={{ opacity: 0, y: 20 }}
              key={post._id}
              transition={{
                duration: 0.5,
                delay: index * ANIMATION_DELAY_MULTIPLIER,
              }}
            >
              <Link href={`/blog/${post.slug.current}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  {post.mainImage && (
                    <Image
                      alt={post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={post.mainImage.asset.url}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 text-light-mini text-sm dark:text-dark-mini">
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.categories && post.categories.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{post.categories[0].title}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-semibold text-light-heading text-xl transition-colors duration-300 group-hover:text-blue-600 dark:text-dark-heading dark:group-hover:text-blue-400">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-light-text leading-relaxed dark:text-dark-text">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
