export type OgVariant =
  | { kind: "home" }
  | { kind: "blog"; title: string }
  | { client?: string; kind: "case-study"; title: string };

const baseUrl = "https://www.andersonjoseph.com";

export const buildPageMeta = ({
  title = "Anderson Joseph | Product Engineer",
  description = "Anderson Joseph is a product engineer in Nigeria building fast web interfaces, full-stack products, and tools for people and AI agents.",
  og,
}: {
  title?: string;
  description?: string;
  og?: OgVariant;
} = {}) => {
  const ogUrl = new URL(`${baseUrl}/api/og`);

  if (og?.kind === "home") {
    ogUrl.searchParams.set("kind", og.kind);
  } else if (og?.kind === "case-study") {
    ogUrl.searchParams.set("kind", og.kind);
    ogUrl.searchParams.set("title", og.title);

    if (og.client) {
      ogUrl.searchParams.set("client", og.client);
    }
  } else if (og?.kind === "blog") {
    ogUrl.searchParams.set("kind", og.kind);
    ogUrl.searchParams.set("title", og.title);
  } else {
    ogUrl.searchParams.set("title", title);
    ogUrl.searchParams.set("description", description);
  }

  return {
    canonical: baseUrl,
    description,
    ogImage: ogUrl.toString(),
    title,
  };
};
