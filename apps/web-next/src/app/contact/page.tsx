import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Contact",
  description: "Want to work together? Send me a message.",
});

export default function ContactPage() {
  return <ContactForm />;
}
