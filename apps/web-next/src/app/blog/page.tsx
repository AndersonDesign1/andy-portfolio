import { client } from "@andy-portfolio/sanity-config";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import BlogList from "@/components/bloglist";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Blog",
  description:
    "Thoughts on web development, SEO strategies, and lessons learned from building digital products.",
});

async function getPosts() {
  "use cache";
  cacheLife("days");
  cacheTag("post");

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
