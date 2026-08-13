export const buildPageMeta = ({
  title = "Anderson Joseph | Full Stack Developer & SEO Expert",
  description = "Building digital products with a focus on growth, interaction, and precise engineering.",
}: {
  title?: string;
  description?: string;
} = {}) => {
  const baseUrl = "https://www.andersonjoseph.com";
  const ogUrl = new URL(`${baseUrl}/api/og`);
  ogUrl.searchParams.set("title", title);
  ogUrl.searchParams.set("description", description);

  return {
    canonical: baseUrl,
    description,
    ogImage: ogUrl.toString(),
    title,
  };
};
