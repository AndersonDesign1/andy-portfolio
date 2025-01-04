import { Button } from "@/components/ui/button"
import Link from "next/link"

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
            <p className="text-2xl md:text-4xl text-gray-300 font-light animate-slide-up delay-200">
              I help brands get more visibility and optimise their websites to generate more revenue
            </p>
          </div>
          
          <p className="text-2xl text-white max-w-4xl animate-fade-in delay-300">
            Full Stack Developer | SEO Specialist | No-Code Developer
          </p>

          <div className="flex gap-6 pt-6 animate-fade-in delay-500">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6">
                Contact Me
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black text-lg px-8 py-6">
                About Me
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}