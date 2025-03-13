import type React from "react"
import ContactForm from "@/app/contact/contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Anderson Joseph | Web Developer & SEO Specialist",
  description:
    "Get in touch with Anderson Joseph for expert web development, SEO services, and digital strategies to elevate your business online.",
  openGraph: {
    url: "https://andersonjoseph.com/contact",
  },
  keywords:
    "Contact Anderson Joseph, Web Developer Contact, SEO Specialist Contact, Digital Marketing Expert, Business Growth Consultation",
}

export default function ContactPage(): React.ReactElement {
  return <ContactForm />
}

