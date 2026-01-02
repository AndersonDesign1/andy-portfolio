import { client } from "@andy-portfolio/sanity-config";
import type { Metadata } from "next";
import BlogList from "@/components/bloglist";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog",
    description:
      "Thoughts on web development, SEO strategies, and lessons learned from building digital products.",
    openGraph: {
      title: "Blog | Andy Joseph",
      description:
        "Thoughts on web development, SEO strategies, and lessons learned from building digital products.",
      url: "https://www.andersonjoseph.com/blog",
      type: "website",
      images: ["/Andy.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Andy Joseph",
      description:
        "Thoughts on web development, SEO strategies, and lessons learned from building digital products.",
      images: ["/Andy.webp"],
    },
  };
}

async function getPosts() {
  try {
    return await client.fetch(
      `*[_type == "post"] | order(publishedAt desc){
        _id,
        title,
        slug,
        excerpt,
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
      }`
    );
  } catch (_error) {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
