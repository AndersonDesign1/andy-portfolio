import BlogPost from "./blogpost";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

async function getPost(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
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
}

export async function generateStaticParams() {
  const posts = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "post"]{ slug }`
  );
  return posts.map((post) => ({ slug: post.slug.current }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  return <BlogPost post={post} />;
}
