import Link from 'next/link'
import { client } from '../../lib/sanity.client'

async function getPosts() {
  return client.fetch(`*[_type == "post"] | order(date desc) {
    _id,
    title,
    slug,
    excerpt,
    date
  }`)
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug.current}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">{post.title}</h2>
              <p className="text-gray-500 text-sm mb-4 font-medium">{new Date(post.date).toLocaleDateString()}</p>
              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
