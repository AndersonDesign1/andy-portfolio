import BlogList from "./bloglist";
import { client } from "@/sanity/lib/client";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getPosts() {
  return client.fetch(
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
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
