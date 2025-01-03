import { PortableText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

async function getPost(slug) {
  return client.fetch(`*[_type == "post" && slug.current == $slug][0]{
    title,
    content,
    _createdAt
  }`, { slug })
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link 
            href="/blog" 
            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"
        aria-hidden="true"
      />

      <article className="relative container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to blog
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <time 
              dateTime={post._createdAt}
              className="text-zinc-400"
            >
              {new Date(post._createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </header>

          <div className="prose prose-invert max-w-none prose-lg prose-p:text-zinc-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-headings:text-white">
            <PortableText value={post.content} />
          </div>
        </div>
      </article>
    </div>
  )
}

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{
    slug
  }`)

  return posts.map((post) => ({
    slug: post.slug.current
  }))
}
