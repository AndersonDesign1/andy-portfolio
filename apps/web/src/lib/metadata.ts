import type { Metadata } from "next";

export function constructMetadata({
  title = "Anderson Joseph | Full Stack Developer & SEO Expert",
  description = "Building digital products with a focus on growth, interaction, and precise engineering.",
  image = "/api/og",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const ogUrl = new URL("https://andersonjoseph.com/api/og");
  if (title) {
    ogUrl.searchParams.set("title", title);
  }
  if (description) {
    ogUrl.searchParams.set("description", description);
  }

  const finalImage = title || description ? ogUrl.toString() : image;

  return {
    title,
    description,
    keywords: [
      "Anderson Joseph",
      "Web Developer",
      "SEO Specialist",
      "Web Performance",
      "No-code Developer",
      "Next.js Developer",
      "React Developer",
    ],
    authors: [{ name: "Anderson Joseph" }],
    openGraph: {
      title,
      description,
      url: "https://andersonjoseph.com",
      siteName: "Anderson Joseph",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [finalImage],
      creator: "@andersonjoseph",
    },
    icons,
    metadataBase: new URL("https://andersonjoseph.com"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
