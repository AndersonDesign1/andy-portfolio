import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container mx-auto px-6 py-24 md:py-40 relative z-10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-6">
            <p className="text-gray-300 font-mono text-lg animate-fade-in">
              Hello, my name is
            </p>
            <h1 className="text-6xl md:text-8xl font-bold text-white animate-slide-up">
              Anderson Joseph.
            </h1>
            <p className="text-4xl md:text-6xl text-gray-300 font-light animate-slide-up delay-200">
              I design and build meaningful experiences.
            </p>
          </div>
          
          <p className="text-2xl text-white max-w-4xl animate-fade-in delay-300">
            Full Stack Developer | SEO Specialist | No-Code Advocate
          </p>
          
          <p className="text-gray-300 max-w-4xl text-xl leading-relaxed animate-fade-in delay-400">
            I am a digital creator passionate about building innovative solutions 
            and sharing knowledge with the developer community.
          </p>

          <div className="flex gap-6 pt-6 animate-fade-in delay-500">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6">
              Contact Me
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black text-lg px-8 py-6">
              LinkedIn
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}