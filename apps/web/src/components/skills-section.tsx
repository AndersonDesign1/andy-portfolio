"use client";

interface SkillCategory {
  title: string;
  skills: string[];
}

const skillsData: SkillCategory[] = [
  {
    title: "Development",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Astro",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend & Database",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Prisma", "REST API", "GraphQL"],
  },
  {
    title: "Tools & DevOps",
    skills: [
      "Git",
      "Docker",
      "AWS",
      "Vercel",
      "Cloudflare",
      "Postman",
      "Figma",
    ],
  },
  {
    title: "SEO & Performance",
    skills: [
      "Technical SEO",
      "Google Analytics",
      "Search Console",
      "Core Web Vitals",
      "Ahrefs",
    ],
  },
];

export default function SkillsSection() {
  return (
    <section className="bg-primary py-24 md:py-32">
      <div className="mx-auto max-w-screen-lg px-6 md:px-12">
        <div className="flex items-end justify-between border-subtle border-b pb-8">
          <h2 className="font-mono text-secondary text-sm uppercase tracking-widest">
            Expertise
          </h2>
        </div>

        <div className="pt-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-y-24">
            {skillsData.map((category) => (
              <div className="group" key={category.title}>
                <h3 className="pb-6 font-medium text-primary text-xl">
                  {category.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {category.skills.map((skill) => (
                    <li
                      className="text-base text-secondary transition-colors duration-200 ease-out hover:text-primary"
                      key={skill}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
