import BlogList from "./bloglist";
import { client } from "@/sanity/lib/client";
import type { Metadata } from "next";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Blog | Andy Portfolio",
  description:
    "Insights, tutorials, and stories from my journey in engineering, design, and business.",
};

async function getPosts() {
  try {
    return await client.fetch(
      `*[_type == "post"] | order(publishedAt desc){
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
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
