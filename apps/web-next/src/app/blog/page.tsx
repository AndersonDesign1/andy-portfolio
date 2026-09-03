import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import BlogList from "@/components/bloglist";
import { getGraft } from "@/lib/graft";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  description:
    "Thoughts on web development, SEO strategies, and lessons learned from building digital products.",
  title: "Blog",
});

async function getPosts() {
  "use cache";
  cacheLife("days");
  cacheTag("post");

  const documents = await getGraft().listContent("posts");
  return documents
    .map((document) => ({
      excerpt: document.data.excerpt,
      publishedAt: document.data.publishedAt,
      slug: document.slug,
      title: document.data.title,
    }))
    .toSorted(
      (left, right) =>
        Date.parse(right.publishedAt) - Date.parse(left.publishedAt)
    );
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
