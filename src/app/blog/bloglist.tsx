import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { formatDate } from "@/lib/utils";

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
    <div className="pt-24 min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-[150px] py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-light-heading dark:text-dark-heading mb-4">
            Blog
          </h1>
          <p className="text-lg text-light-text dark:text-dark-text max-w-2xl mx-auto">
            Thoughts, insights, and lessons learned from my journey in web
            development and SEO.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-light-bg dark:bg-dark-bg rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link href={`/blog/${post.slug.current}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  {post.mainImage && (
                    <Image
                      src={post.mainImage.asset.url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-light-mini dark:text-dark-mini mb-3">
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.categories && post.categories.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{post.categories[0].title}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-light-heading dark:text-dark-heading mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-light-text dark:text-dark-text leading-relaxed">
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
