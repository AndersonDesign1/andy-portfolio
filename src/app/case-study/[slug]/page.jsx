import Image from 'next/image';
import Link from 'next/link';
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
        tab: "inline-flex items-center justify-center whitespace-nowrap rounded-full h-10 px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
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
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

async function getProject(slug) {
  const projects = {
    "kyrus-recycling": {
      title: "Kyrus Recycling",
      description: "A web application incentivizing users to recycle waste by offering monetary rewards, promoting environmental awareness and sustainable practices.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      challenges: [
        "Encouraging user engagement and sign-ups for a niche recycling incentive program",
        "Building a scalable web application within tight deadlines",
        "Ensuring seamless functionality and user experience across devices"
      ],
      solutions: [
        "Designed and developed the web application using modern full-stack development practices, ensuring scalability and reliability",
        "Integrated a user-friendly interface with responsive design for optimal usability",
        "Implemented robust backend systems to track recycling activities and rewards"
      ],
      outcomes: "The project resulted in over 500 user sign-ups within the first month, raised environmental awareness, and significantly boosted waste recycling efforts in the community.",
      technologies: ["React", "Node.js", "MongoDB", "CSS", "HTML", "JavaScript", "GitHub"]
    },
    "welup-digital": {
      title: "Welup Digital",
      description: "Responsive websites ensuring usability, design consistency, and modern SEO techniques.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      challenges: [
        "Ensuring consistent design across various devices and screen sizes",
        "Implementing modern SEO techniques without compromising user experience",
        "Balancing performance with rich, interactive features"
      ],
      solutions: [
        "Developed a responsive design system using modern CSS techniques and media queries",
        "Implemented server-side rendering and dynamic meta tags for improved SEO",
        "Utilized code splitting and lazy loading to optimize performance without sacrificing functionality"
      ],
      outcomes: "The project led to a 50% increase in mobile traffic, a 40% improvement in search engine rankings, and a 35% increase in user engagement metrics.",
      technologies: ["React", "Next.js", "TailwindCSS", "JavaScript", "HTML", "CSS"]
    }
  };

  return projects[slug] || null;
}


export default async function CaseStudyDetail({ params }) {
  const project = await getProject(params.slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Case Study Not Found</h1>
          <p className="mb-8">Sorry, we couldn't find the case study you're looking for.</p>
          <Button variant="default" size="default" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 font-montserrat">{project.title}</h1>
        <div className="mb-8 relative h-64 md:h-96">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover rounded-lg shadow-xl"
            priority
          />
        </div>
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Project Overview</h2>
            <p className="font-inter text-lg leading-relaxed">{project.description}</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Technologies Used</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-zinc-800/50 text-sm rounded-full text-gray-300 hover:bg-zinc-700/50 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Challenges</h2>
            <ul className="list-none pl-0 space-y-3">
              {project.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start font-inter text-lg">
                  <span className="text-white mr-3">▹</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 font-montserrat text-white">Solutions</h2>
            <ul className="list-none pl-0 space-y-3">
              {project.solutions.map((solution, index) => (
                <li key={index} className="flex items-start font-inter text-lg">
                  <span className="text-white mr-3">▹</span>
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
        <div className="mt-12">
          <Button variant="default" size="default" asChild>
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