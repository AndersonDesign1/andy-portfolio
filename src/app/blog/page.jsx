import Link from 'next/link'
import { client } from '@/sanity/lib/client'

export async function generateMetadata() {
  return {
    title: "Anderson Joseph's Blog | Insights on Web Dev & SEO",
    description: "Discover expert tips, strategies, and insights on web development, SEO, and digital marketing to grow your business and enhance your online presence.",
    url: "https://andersonjoseph.com/blog",
    content: "Anderson Joseph's Blog | Web Development, SEO Insights, and Digital Marketing Strategies.",
    keywords: "Anderson Joseph Blog, Web Development Tips, SEO Strategies, Digital Marketing Insights, Business Growth Online"
  };
}

async function getPosts() {
  return client.fetch(`*[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    content,
    _createdAt
  }`)
}

export default async function Page() {
  const posts = await getPosts();

  return (
    <section className="w-full min-h-screen bg-black text-white relative overflow-hidden pt-24">
      {/* Animated background pattern */}
      <div className="absolute inset-0 z-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px),
              linear-gradient(to right, #333 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Animated gradient orbs */}
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-200">I post about the web, SEO, marketing, personal life and any other thing I want to</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post._id} href={`/blog/${post.slug.current}`}>
              <article className="bg-zinc-900/50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-bold mb-2 text-gray-200">{post.title}</h2>
                <p className="text-gray-400 mb-4">
                  {new Date(post._createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-300 line-clamp-2">
                  {post.content?.[0]?.children?.[0]?.text || 'Read more...'}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}