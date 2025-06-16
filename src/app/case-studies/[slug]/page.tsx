import { notFound } from "next/navigation";
import caseStudiesData from "@/data/case-studies.json";
import CaseStudyPage from "@/components/case-study-page";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return Object.keys(caseStudiesData.caseStudies).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const caseStudy =
    caseStudiesData.caseStudies[
      params.slug as keyof typeof caseStudiesData.caseStudies
    ];

  if (!caseStudy) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${caseStudy.hero.title} - Case Study`,
    description: caseStudy.hero.overview,
  };
}

export default function CaseStudy({ params }: CaseStudyPageProps) {
  const caseStudy =
    caseStudiesData.caseStudies[
      params.slug as keyof typeof caseStudiesData.caseStudies
    ];

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyPage caseStudy={caseStudy} />;
}
