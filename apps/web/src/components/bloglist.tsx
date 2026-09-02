"use client";

export interface BlogListPost {
  excerpt: string;
  publishedAt: string;
  slug: string;
  title: string;
}

const BlogList = ({ posts }: { posts: BlogListPost[] }) => (
  <section className="bg-primary min-h-screen py-24 pt-40 md:py-32 md:pt-48">
    <div className="mx-auto max-w-screen-lg px-6 md:px-12">
      <div className="border-subtle mb-24 flex items-end justify-between border-b pb-8">
        <div>
          <h1 className="text-primary mb-4 font-mono text-sm tracking-widest uppercase">
            Writing
          </h1>
          <p className="text-secondary max-w-md text-lg leading-relaxed md:text-xl">
            Thoughts, tutorials, and insights on engineering, design, and
            growing digital products.
          </p>
        </div>
        <span className="text-muted mb-1 font-mono text-sm">
          {posts.length} Posts
        </span>
      </div>

      <div className="flex flex-col">
        {posts.map((post) => (
          <div
            className="group border-subtle border-b last:border-none"
            key={post.slug}
          >
            <a
              className="flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-16 md:py-12"
              href={`/blog/${post.slug}`}
            >
              <span className="text-muted w-24 shrink-0 font-mono text-sm">
                {new Date(post.publishedAt).getFullYear()}
              </span>

              <div className="flex flex-col gap-2">
                <h2 className="text-primary text-2xl font-semibold tracking-tight transition-opacity duration-200 ease-out group-hover:opacity-60 md:text-3xl">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-secondary max-w-xl text-base leading-relaxed">
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

export default BlogList;
