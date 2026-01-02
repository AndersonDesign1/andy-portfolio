import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Contact",
  description:
    "Let's build something great together. Reach out for project inquiries, collaborations, or just to connect.",
});

export default function ContactPage() {
  return <ContactForm />;
}
