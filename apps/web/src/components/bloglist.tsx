"use client";

interface Category {
  _id: string;
  description?: string;
  slug: { current: string };
  title: string;
}
interface SanityPost {
  _createdAt: string;
  categories?: (Category | null)[];
  excerpt?: string;
  publishedAt?: string;
  slug: { current: string };
  title: string;
}

export default function BlogList({ posts }: { posts: SanityPost[] }) {
  return (
    <section className="min-h-screen bg-primary py-24 pt-40 md:py-32 md:pt-48">
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
          {posts.map((post) => (
            <div
              className="group border-subtle border-b last:border-none"
              key={post.slug.current}
            >
              <a
                className="flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-16 md:py-12"
                href={`/blog/${post.slug.current}`}
              >
                <span className="w-24 shrink-0 font-mono text-muted text-sm">
                  {new Date(post.publishedAt || post._createdAt).getFullYear()}
                </span>

                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold text-2xl text-primary tracking-tight transition-opacity duration-200 ease-out group-hover:opacity-60 md:text-3xl">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="max-w-xl text-base text-secondary leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
