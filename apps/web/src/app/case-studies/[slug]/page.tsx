import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/case-study-page";
import caseStudiesDataJson from "@/data/case-studies.json" with {
  type: "json",
};
import type { CaseStudiesData, CaseStudy } from "@/types/case-study";

const caseStudiesData: CaseStudiesData = caseStudiesDataJson;

export async function generateStaticParams() {
  return Object.keys(caseStudiesData.caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs: CaseStudy | undefined = caseStudiesData.caseStudies[slug];
  return cs
    ? {
        title: `${cs.hero.title} - Case Study`,
        description: cs.hero.overview,
      }
    : { title: "Case Study Not Found" };
}

export default async function CaseStudyPageComponent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs: CaseStudy | undefined = caseStudiesData.caseStudies[slug];

  if (!cs) {
    notFound();
  }

  const slugs = Object.keys(caseStudiesData.caseStudies);
  const currentIndex = slugs.indexOf(slug);

  const prevSlug = currentIndex > 0 ? slugs[currentIndex - 1] : undefined;
  const nextSlug =
    currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : undefined;

  const navigation = {
    prev: prevSlug
      ? {
          slug: prevSlug,
          title: caseStudiesData.caseStudies[prevSlug].hero.title,
        }
      : undefined,
    next: nextSlug
      ? {
          slug: nextSlug,
          title: caseStudiesData.caseStudies[nextSlug].hero.title,
        }
      : undefined,
  };

  return <CaseStudyPage caseStudy={cs} navigation={navigation} />;
}
