import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import caseStudies from '@/data/case-studies.json';
import { Button } from '@/components/ui/button';
import { cva } from "class-variance-authority"
import Script from 'next/script';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#0a0a0a] text-[#ededed] shadow-sm hover:bg-[#1a1a1a]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        tab: "inline-flex items-center justify-center whitespace-nowrap rounded-full h-10 px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        custom: "bg-[#3498db] text-white hover:bg-[#2980b9]",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-full",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export async function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export default function CaseStudyDetail({ params }) {
  const project = caseStudies.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  // Define the JSON-LD schema for SEO
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    name: project.title,
    description: project.description,
    image: project.imageUrl,
    url: project.website,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://andersonjoseph.com/case-study/${project.slug}`
    },
    author: {
      '@type': 'Person',
      name: 'Anderson Joseph',
      url: 'https://andersonjoseph.com'
    },
    datePublished: '2024-09-01'
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 mt-24">
      {/* Inject JSON-LD into the head for SEO */}
      <Script
        id="case-study-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 font-montserrat">{project.title}</h1>
          <Button variant="default" size="lg" className="rounded-full w-full sm:w-auto px-4 py-2 sm:px-8 sm:py-3" asChild>
            <Link href={project.website} target="_blank" rel="noopener noreferrer">
              View Live Project
            </Link>
          </Button>
        </div>

        <div className="mb-8 relative h-48 sm:h-64 md:h-96">
          <Image
            src={project.imageUrl || '/placeholder.svg'}
            alt={`${project.title} - Case Study Project Screenshot`}
            fill
            className="object-cover rounded-lg shadow-xl"
            priority
          />
        </div>
        <div className="space-y-8 sm:space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Project Overview</h2>
            <p className="font-inter text-lg leading-relaxed">{project.description}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Technologies Used</h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-zinc-800/50 text-sm rounded-full text-gray-300 hover:bg-zinc-700/50 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Challenges</h2>
            <ul className="list-none pl-0 space-y-2 sm:space-y-3">
              {project.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start font-inter text-lg">
                  <span className="text-white mr-2 sm:mr-3">▹</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Solutions</h2>
            <ul className="list-none pl-0 space-y-2 sm:space-y-3">
              {project.solutions.map((solution, index) => (
                <li key={index} className="flex items-start font-inter text-lg">
                  <span className="text-white mr-2 sm:mr-3">▹</span>
                  {solution}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Outcomes</h2>
            <p className="font-inter text-lg leading-relaxed">{project.outcomes}</p>
          </section>
        </div>
        <div className="mt-8 sm:mt-12">
          <Button variant="default" size="default" className="rounded-full" asChild>
            <Link href="/">
              <span className="mr-2">←</span>
              Back to Case Studies
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
