export type OgVariant =
  | { kind: "blog"; title: string }
  | { client?: string; kind: "case-study"; title: string };

const baseUrl = "https://www.andersonjoseph.com";

export const buildPageMeta = ({
  title = "Anderson Joseph | Full Stack Developer & SEO Expert",
  description = "Building digital products with a focus on growth, interaction, and precise engineering.",
  og,
}: {
  title?: string;
  description?: string;
  og?: OgVariant;
} = {}) => {
  const ogUrl = new URL(`${baseUrl}/api/og`);

  if (og?.kind === "case-study") {
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
