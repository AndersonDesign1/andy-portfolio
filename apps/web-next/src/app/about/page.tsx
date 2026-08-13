import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "About",
  description:
    "Full stack developer with a passion for growth-focused digital products. Experienced in Next.js, React, and SEO optimization.",
});

export default function About() {
  return <AboutPage />;
}
