"use client";

import React from "react";
import experienceData from "@/data/experience.json";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  logo: string;
}

interface Certification {
  institution: string;
  degree: string;
  period: string;
  description: string;
  logo: string;
  technologies: string[];
  certificationUrl?: string;
  skills?: string[];
}

interface ExperienceCardProps {
  logo: string;
  title: string;
  role?: string;
  description: string;
  period: string;
  technologies: string[];
  certificationUrl?: string;
  skills?: string[];
}

const ExperienceCard = React.memo(
  ({
    logo,
    title,
    role,
    description,
    period,
    technologies,
    certificationUrl,
    skills,
  }: ExperienceCardProps) => (
    <div className="bg-zinc-900/50 rounded-3xl py-8 px-6 w-full h-full flex flex-col justify-between backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300 min-h-[340px]">
      <div className="space-y-6">
        <div className="flex flex-col items-start gap-4">
          <Image
            src={logo || "/placeholder.svg"}
            alt={title}
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-contain"
            loading="lazy"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-200">{title}</h2>
            {role && <p className="text-gray-400">{role}</p>}
            <p className="text-sm text-gray-500">{period}</p>
            {certificationUrl && (
              <a
                href={certificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-sm text-blue-400 hover:underline"
              >
                View Certification
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
        <p className="text-gray-400 leading-relaxed whitespace-pre-line">
          {description}
        </p>
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mt-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
              >
                {skill}
              </div>
            ))}
          </div>
        )}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mt-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
              >
                {tech}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
);
ExperienceCard.displayName = "ExperienceCard";

const WorkCard = React.memo(
  ({
    logo,
    company,
    role,
    description,
    period,
    technologies,
  }: WorkExperience) => (
    <div className="bg-zinc-900/50 rounded-3xl py-8 px-6 w-full h-full flex flex-col justify-between backdrop-blur-xs border border-gray-800/50 hover:border-white/50 hover:bg-zinc-800/50 transition-all duration-300 min-h-[340px]">
      <div className="space-y-6">
        <div className="flex flex-col items-start gap-4">
          <Image
            src={logo || "/placeholder.svg"}
            alt={company}
            width={48}
            height={48}
            className="w-20 h-20 rounded-xl object-contain"
            loading="lazy"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-200">{company}</h2>
            {role && <p className="text-gray-400">{role}</p>}
            <p className="text-sm text-gray-500">{period}</p>
          </div>
        </div>
        <p className="text-gray-400 leading-relaxed whitespace-pre-line">
          {description}
        </p>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mt-4">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 rounded-full px-4 py-1.5 text-sm text-gray-300 hover:bg-zinc-700 transition-all duration-300"
              >
                {tech}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
);
WorkCard.displayName = "WorkCard";

export const Experience: React.FC = () => {
  const workExperiences = experienceData.work as WorkExperience[];
  const certifications = experienceData.certifications as Certification[];

  return (
    <section className="bg-[#0a0a0a] text-[#ededed] font-cal py-16 flex items-center justify-center relative overflow-hidden">
      {/* Animated Blobs Background */}
      <div className="absolute -inset-[10px] opacity-50 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="container mx-auto px-4 flex flex-col items-center relative z-10 max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Experience</h2>
        <Tabs defaultValue="work" className="w-full flex flex-col items-center">
          <TabsList className="bg-[#1a1a1a] p-1 rounded-full inline-flex w-96 h-16 mb-6">
            <TabsTrigger
              value="work"
              className="px-8 py-4 rounded-full text-lg flex-1 h-14 transition-all data-[state=active]:bg-[#ededed] data-[state=active]:text-[#0a0a0a] data-[state=active]:shadow"
            >
              Work
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="px-8 py-4 rounded-full text-lg flex-1 h-14 transition-all data-[state=active]:bg-[#ededed] data-[state=active]:text-[#0a0a0a] data-[state=active]:shadow"
            >
              Certifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="work">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {workExperiences.map((exp) => (
                <WorkCard key={exp.company + exp.role + exp.period} {...exp} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {certifications.map((exp) => (
                <ExperienceCard
                  key={exp.institution + exp.degree + exp.period}
                  logo={exp.logo}
                  title={exp.institution}
                  role={exp.degree}
                  description={exp.description}
                  period={exp.period}
                  technologies={exp.technologies}
                  certificationUrl={exp.certificationUrl}
                  skills={exp.skills}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        <a href="/Anderson Joseph Resume.pdf" download className="mt-8">
          <Button
            variant="outline"
            className="px-8 py-2 rounded-full border border-[#ededed] text-[#ededed] hover:bg-[#ededed] hover:text-[#0a0a0a] transition-all duration-300"
          >
            Download Resume
          </Button>
        </a>
      </div>
    </section>
  );
};

export default Experience;
