import Hero from '@/components/ui/hero'
import Skills from '@/components/ui/skills';
import { Experience } from '@/components/ui/experience'

export default function Home() {
  return (
    <main>
      <Hero />
      <Experience />
      <Skills />
    </main>
  )
}