import Link from 'next/link'
import { client } from '@/sanity/lib/client'

async function getPosts() {
  return client.fetch(`*[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    content,
    _createdAt
  }`)
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"
        aria-hidden="true"
      />
      <div className="relative container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-zinc-400 mb-12">Thoughts, learnings, and insights about web development.</p>
          
          <div className="space-y-8">
            {posts.map((post) => (
              <Link 
                key={post._id} 
                href={`/blog/${post.slug.current}`}
                className="block group"
              >
                <article className="p-6 rounded-lg bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 hover:border-zinc-600/50 transition-all">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-zinc-400">
                      {new Date(post._createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-zinc-300 line-clamp-2">
                      {post.content?.[0]?.children?.[0]?.text || 'Read more...'}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}