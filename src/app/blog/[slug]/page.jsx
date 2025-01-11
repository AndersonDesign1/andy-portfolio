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
          <Link href="/blog">
            <a className="text-blue-500 hover:underline">Go back to blog</a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-zinc-900 text-white">
      {/* Animated Blobs Background */}
      <div className="absolute -inset-[10px] opacity-50">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="container mx-auto px-6 py-24 md:py-40 relative z-10">
        <Link href="/blog">
          <a className="flex items-center text-blue-500 hover:underline mb-8">
            <ArrowLeft className="mr-2" />
            Back to Blog
          </a>
        </Link>
        <article className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">{post.title}</h1>
          <p className="text-gray-400">
            {new Date(post._createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <div className="prose prose-invert">
            <PortableText value={post.content} />
          </div>
        </article>
      </div>
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
