import type React from "react"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { client } from "@/sanity/lib/client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { urlFor } from "@/sanity/lib/image"
import Image from "next/image"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface SanityImage {
  asset: {
    _ref: string
    _type: string
  }
  alt?: string
  caption?: string
}

interface SanityPost {
  title: string
  body: any[]
  _createdAt: string
  mainImage?: SanityImage
}

interface PageParams {
  params: {
    slug: string
  }
}

interface PortableTextImageValue {
  _type: string
  asset: {
    _ref: string
    _type: string
  }
  alt?: string
  caption?: string
}

interface PortableTextCodeValue {
  _type: string
  code: string
  language?: string
}

async function getPost(slug: string): Promise<SanityPost | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      _createdAt,
      mainImage{
        asset->,
        alt,
        caption
      }
    }`,
    { slug },
  )
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-10">
        <div className="relative w-full h-[500px] border-4 border-zinc-700">
          <Image
            src={urlFor(value as SanityImageSource).url() || "/placeholder.svg"}
            alt={value.alt || "Blog post image"}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        {value.caption && (
          <figcaption className="mt-4 text-center text-sm text-gray-400 italic">{value.caption}</figcaption>
        )}
      </figure>
    ),
    code: ({ value }) => (
      <pre className="bg-zinc-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm font-mono text-gray-200">{value.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4 text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4 text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3 text-white">{children}</h3>,
    normal: ({ children }) => <p className="text-gray-300 leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-300">{children}</blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/") ? "noreferrer noopener" : undefined
      return (
        <a href={value.href} rel={rel} className="text-blue-400 hover:text-blue-300 transition-colors">
          {children}
        </a>
      )
    },
    code: ({ children }) => (
      <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-gray-200 font-mono text-sm">{children}</code>
    ),
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300 pl-4">{children}</ul>,
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-300 pl-4">{children}</ol>
    ),
  },
}

export default async function BlogPostPage({ params }: PageParams): Promise<React.ReactElement> {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-6">Post not found</h1>
            <Link href="/blog" className="text-gray-400 hover:text-gray-300">
              Back to blog
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="relative min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-24 md:py-36 relative">
          <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-gray-300 font-medium mb-10">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Blog
          </Link>

          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">{post.title}</h1>

            <p className="text-gray-400 text-lg mb-8">
              {new Date(post._createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {post.mainImage && (
              <figure className="mb-10">
                <div className="relative aspect-video overflow-hidden rounded-xl border-4 border-zinc-700">
                  <Image
                    src={urlFor(post.mainImage as SanityImageSource).url() || "/placeholder.svg"}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {post.mainImage.caption && (
                  <figcaption className="mt-4 text-center text-sm text-gray-400 italic">
                    {post.mainImage.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="prose prose-invert prose-lg max-w-none">
              <PortableText value={post.body} components={components} />
            </div>
          </article>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading post:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-6">Error loading post</h1>
          <Link href="/blog" className="text-gray-400 hover:text-gray-300">
            Back to blog
          </Link>
        </div>
      </div>
    )
  }
}

interface SanitySlug {
  slug: {
    current: string
  }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await client.fetch<SanitySlug[]>(`*[_type == "post"]{
    slug
  }`)

  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

