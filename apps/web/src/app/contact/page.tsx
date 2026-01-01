import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact | Andy Portfolio",
  description:
    "Get in touch for collaborations, project inquiries, or just to say hello.",
};

export default function ContactPage() {
  return <ContactForm />;
}
