import { client } from "@andy-portfolio/sanity-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPost from "@/components/blogpost";

export const revalidate = 60;

async function getPost(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        excerpt,
        body,
        _createdAt,
        publishedAt,
        mainImage{
          asset->,
          alt,
          caption
        },
        categories[]->{
          _id,
          title,
          slug,
          description
        }
      }`,
      { slug }
    );
  } catch (_error) {
    return null;
  }
}

import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return constructMetadata({
      title: "Blog Post",
      description: "Read this blog post",
    });
  }

  return constructMetadata({
    title: post.title,
    description: post.excerpt || "Read this blog post",
  });
}

export async function generateStaticParams() {
  try {
    const posts = await client.fetch<{ slug: { current: string } }[]>(
      `*[_type == "post" && defined(slug.current)]{ slug }`
    );
    return posts.map((post) => ({ slug: post.slug.current }));
  } catch (_error) {
    return [];
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
