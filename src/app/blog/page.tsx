import BlogList from "@/components/bloglist";
import { client } from "@/sanity/lib/client";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60; // ISR: revalidate every 60 seconds

// Using generateMetadata enables streaming for performance
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog | Andy Portfolio",
    description:
      "Insights, tutorials, and stories from my journey in engineering, design, and SEO.",
    openGraph: {
      title: "Blog | Andy Portfolio",
      description:
        "Insights, tutorials, and stories from my journey in engineering, design, and SEO.",
      url: "https://www.andersonjoseph.com/blog",
      type: "website",
      images: ["/Andy.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Andy Portfolio",
      description:
        "Insights, tutorials, and stories from my journey in engineering, design, and SEO.",
      images: ["/Andy.webp"],
    },
  };
}

// Sanity Live Preview
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  // Check the secret and next parameters
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  // Enable Draft Mode by setting the cookies
  const draft = await draftMode();
  draft.enable();

  // Redirect to the path from the fetched post
  // If no slug is provided, redirect to the blog list
  if (slug) {
    redirect(`/blog/${slug}`);
  } else {
    redirect("/blog");
  }
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
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogList posts={posts} />;
}
