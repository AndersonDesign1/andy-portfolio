import type { ReactElement } from "react"
import Hero from "@/components/ui/hero"
import Skills from "@/components/ui/skills"
import Experience from "@/components/ui/experience"
import ProjectSection from "@/components/ui/project-overview"

export default function Home(): ReactElement {
  return (
    <main>
      <Hero />
      <Skills />
      <ProjectSection />
      <Experience />
    </main>
  )
}

