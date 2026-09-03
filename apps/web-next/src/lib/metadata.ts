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
  const baseUrl = "https://www.andersonjoseph.com";
  const ogUrl = new URL(`${baseUrl}/api/og`);
  if (title) {
    ogUrl.searchParams.set("title", title);
  }
  if (description) {
    ogUrl.searchParams.set("description", description);
  }

  // Always use absolute URL for OG images (required by social crawlers)
  let finalImage: string;
  if (title || description) {
    finalImage = ogUrl.toString();
  } else if (image.startsWith("http")) {
    finalImage = image;
  } else {
    finalImage = `${baseUrl}${image}`;
  }

  return {
    authors: [{ name: "Anderson Joseph" }],
    description,
    icons,
    keywords: [
      "Anderson Joseph",
      "Web Developer",
      "SEO Specialist",
      "Web Performance",
      "No-code Developer",
      "Next.js Developer",
      "React Developer",
    ],
    metadataBase: new URL("https://www.andersonjoseph.com"),
    openGraph: {
      description,
      images: [
        {
          alt: title,
          height: 630,
          url: finalImage,
          width: 1200,
        },
      ],
      locale: "en_US",
      siteName: "Anderson Joseph",
      title,
      type: "website",
      url: "https://www.andersonjoseph.com",
    },
    title,
    twitter: {
      card: "summary_large_image",
      creator: "@andersonjoseph",
      description,
      images: [finalImage],
      title,
    },
    ...(noIndex && {
      robots: {
        follow: false,
        index: false,
      },
    }),
  };
}
