import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let's build something great together. Reach out for project inquiries, collaborations, or just to connect.",
  openGraph: {
    title: "Contact | Andy Joseph",
    description:
      "Let's build something great together. Reach out for project inquiries, collaborations, or just to connect.",
    url: "https://www.andersonjoseph.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Andy Joseph",
    description:
      "Let's build something great together. Reach out for project inquiries, collaborations, or just to connect.",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
