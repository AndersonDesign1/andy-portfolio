import type { MetadataRoute } from "next";
import { getGraft } from "@/lib/graft";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://andersonjoseph.com";
  const graft = getGraft();

  const routes = ["", "/about", "/projects", "/contact", "/blog"].map(
    (route) => ({
      changeFrequency: "monthly" as const,
      lastModified: new Date().toISOString(),
      priority: route === "" ? 1 : 0.8,
      url: `${baseUrl}${route}`,
    })
  );

  const caseStudyDocuments = await graft.listContent("case-studies");
  const caseStudies = caseStudyDocuments.map((document) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date().toISOString(),
    priority: 0.7,
    url: `${baseUrl}/case-studies/${document.slug}`,
  }));

  const posts = await graft.listContent("posts");
  const blogPosts = posts.map((post) => ({
    changeFrequency: "weekly" as const,
    lastModified: post.data.publishedAt,
    priority: 0.6,
    url: `${baseUrl}/blog/${post.slug}`,
  }));

  return [...routes, ...caseStudies, ...blogPosts];
}
