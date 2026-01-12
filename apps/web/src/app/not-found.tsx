import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-6">
      <div className="relative flex flex-col items-center gap-4 text-center">
        {/* Large subtle background 404 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-bold text-[12rem] text-foreground/[0.03] leading-none md:text-[20rem]"
        >
          404
        </span>

        <h1 className="z-10 font-bold text-4xl text-primary tracking-tight md:text-5xl">
          Page not found
        </h1>

        <p className="z-10 max-w-sm text-secondary text-sm md:text-base">
          The page you&apos;re looking for doesn&apos;t exist. It might have
          been moved or deleted…
        </p>

        <div className="z-10 mt-8 flex">
          <Button asChild className="group h-11 px-8" variant="outline">
            <Link href="/projects" prefetch>
              <ArrowLeft className="mr-2 size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Explore my work
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
