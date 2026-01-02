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

import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs: CaseStudy | undefined = caseStudiesData.caseStudies[slug];

  return constructMetadata({
    title: cs ? `${cs.hero.title} - Case Study` : "Case Study Not Found",
    description: cs?.hero.overview || "Anderson Joseph Case Study",
  });
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
