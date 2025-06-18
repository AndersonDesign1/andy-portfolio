import { notFound } from "next/navigation";
import caseStudiesDataJson from "@/data/case-studies.json";
import CaseStudyPage from "@/components/case-study-page";
import type { CaseStudiesData, CaseStudy } from "@/types/case-study";

const caseStudiesData: CaseStudiesData = caseStudiesDataJson;

export async function generateStaticParams() {
  return Object.keys(caseStudiesData.caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const cs: CaseStudy | undefined = caseStudiesData.caseStudies[params.slug];
  return cs
    ? {
        title: `${cs.hero.title} - Case Study`,
        description: cs.hero.overview,
      }
    : { title: "Case Study Not Found" };
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const cs: CaseStudy | undefined = caseStudiesData.caseStudies[params.slug];
  if (!cs) notFound();
  return <CaseStudyPage caseStudy={cs} />;
}
