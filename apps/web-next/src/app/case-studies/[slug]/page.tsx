import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/case-study-page";
import { getGraft } from "@/lib/graft";
import { constructMetadata } from "@/lib/metadata";
import { toCaseStudy } from "@/lib/portfolio";

export async function generateStaticParams() {
  const documents = await getGraft().listContent("case-studies");
  return documents.map((document) => ({ slug: document.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = await getGraft().getContent("case-studies", slug);

  return constructMetadata({
    description: document?.data.hero.overview || "Anderson Joseph Case Study",
    title: document
      ? `${document.data.hero.title} - Case Study`
      : "Case Study Not Found",
  });
}

export default async function CaseStudyPageComponent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const graft = getGraft();
  const document = await graft.getContent("case-studies", slug);

  if (!document) {
    notFound();
  }

  const caseStudy = toCaseStudy(document);
  const studies = await graft.listContent("case-studies");
  const ordered = studies.toSorted(
    (left, right) => left.data.order - right.data.order
  );
  const currentIndex = ordered.findIndex((entry) => entry.slug === slug);
  const prev = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
  const next =
    currentIndex !== -1 && currentIndex < ordered.length - 1
      ? ordered[currentIndex + 1]
      : undefined;

  const navigation = {
    next: next ? { slug: next.slug, title: next.data.hero.title } : undefined,
    prev: prev ? { slug: prev.slug, title: prev.data.hero.title } : undefined,
  };

  return <CaseStudyPage caseStudy={caseStudy} navigation={navigation} />;
}
