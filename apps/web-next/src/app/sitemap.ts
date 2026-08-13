import { client } from "@andy-portfolio/sanity-config";
import type { MetadataRoute } from "next";
import caseStudiesData from "../data/case-studies.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://andersonjoseph.com";

  // Static routes
  const routes = ["", "/about", "/projects", "/contact", "/blog"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Case Studies
  const caseStudies = Object.keys(caseStudiesData.caseStudies).map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog Posts
  const posts = await client.fetch<
    Array<{ slug: { current: string }; _updatedAt: string }>
  >(`*[_type == "post"]{ "slug": slug, _updatedAt }`);

  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug.current}`,
    lastModified: post._updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...caseStudies, ...blogPosts];
}
