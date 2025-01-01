import { PortableText } from '@portabletext/react'
import { client } from '../../../lib/sanity.client'

async function getPost(slug) {
  return client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug })
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">{new Date(post.date).toLocaleDateString()}</p>
      <div className="prose max-w-none">
        <PortableText value={post.content} />
      </div>
    </div>
  )
}