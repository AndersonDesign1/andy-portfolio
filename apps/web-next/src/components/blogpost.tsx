import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MdxBody } from "@usegraft/sdk-next";
import Image from "next/image";
import Link from "next/link";
import { blogMdxComponents } from "@/components/blog-mdx";

interface BlogPostView {
  body: string;
  data: {
    categories?: string[];
    mainImage?: {
      alt: string;
      caption?: string;
      src: string;
    };
    publishedAt: string;
    title: string;
  };
}

const BlogPost = ({ post }: { post: BlogPostView }) => {
  const { categories, mainImage, publishedAt, title } = post.data;
  const displayDate = new Date(publishedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="bg-primary min-h-screen pt-40 pb-24 md:pt-48">
      <div className="mx-auto max-w-screen-md px-6">
        <Link
          className="text-muted hover:text-primary inline-flex items-center gap-2 font-mono text-sm transition-colors"
          href="/blog"
        >
          <HugeiconsIcon
            color="currentColor"
            icon={ArrowLeft01Icon}
            size={16}
            strokeWidth={1.5}
          />
          Back to Writing
        </Link>
        <div className="pt-12">
          <article>
            <div className="border-subtle border-b pb-8">
              <h1 className="text-primary pb-8 text-4xl leading-tight font-bold tracking-tighter md:text-6xl">
                {title}
              </h1>

              <div className="text-muted flex flex-wrap items-center gap-6 font-mono text-sm">
                <span>{displayDate}</span>
                {(categories?.length ?? 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <span>/</span>
                    <span>{categories?.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {mainImage ? (
              <figure className="pt-16 pb-12 md:pb-16">
                <div className="bg-secondary/5 relative w-full overflow-hidden rounded-sm">
                  <Image
                    alt={mainImage.alt || title}
                    className="h-auto w-full object-cover"
                    height={600}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    src={mainImage.src}
                    width={1200}
                  />
                </div>
                {mainImage.caption ? (
                  <figcaption className="text-muted pt-4 text-center font-mono text-sm">
                    {mainImage.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            <div className="flex max-w-none flex-col gap-6">
              <MdxBody
                components={blogMdxComponents}
                source={post.body}
                trust="restricted"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
