import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import BlogPost from "@/components/blogpost";
import { getGraft } from "@/lib/graft";
import { constructMetadata } from "@/lib/metadata";

async function getPost(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag("post");

  return getGraft().getContent("posts", slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return constructMetadata({
      description: "Read this blog post",
      title: "Blog Post",
    });
  }

  return constructMetadata({
    description:
      post.data.seoDescription || post.data.excerpt || "Read this blog post",
    title: post.data.seoTitle || post.data.title,
  });
}

export async function generateStaticParams() {
  const posts = await getGraft().listContent("posts");
  return posts.map((post) => ({ slug: post.slug }));
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

  return (
    <BlogPost
      post={{
        body: post.body,
        data: {
          categories: post.data.categories,
          mainImage: post.data.mainImage,
          publishedAt: post.data.publishedAt,
          title: post.data.title,
        },
      }}
    />
  );
}
