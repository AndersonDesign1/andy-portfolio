"use client";

import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
  CountdownDisplay,
  useGiveawayStatus,
} from "@/components/giveaway-banner";
import {
  ANIMATION_DURATION_MEDIUM,
  ANIMATION_EASE_CUBIC,
} from "@/lib/constants";

const faqs = [
  {
    question: "Can I build a full SaaS under this free plan?",
    answer:
      "Not under the free giveaway, but I'd love to help! Reach out to me on my contact page and I'll offer you a discounted rate for your SaaS project.",
    hasContactLink: true,
  },
  {
    question: "What kind of websites qualify?",
    answer:
      "Both personal and business websites are welcome! Whether it's a portfolio, blog, landing page, or a website for your business — you're eligible to enter. However, your project must be legitimate. No scams, shady schemes, or anything unethical will qualify.",
  },
  {
    question: "How do I enter the giveaway?",
    answer:
      "Simple! Just fill out the entry form with your details. Once you're selected as a winner, I'll guide you through getting your domain set up.",
  },
  {
    question: "When does the giveaway end?",
    answer:
      "The giveaway ends on January 9th, 2026 at 12:00 PM (Nigeria time). That's just one week — so hurry up and enter!",
  },
  {
    question: "What's included in the free website?",
    answer:
      "Everything! Design, development, hosting, and basic SEO optimization. Winners will be guided through purchasing their domain, then I handle the rest.",
  },
  {
    question: "Does my business or project need to be legit?",
    answer:
      "Absolutely. I'm only building websites for legitimate projects. Scams, fraudulent businesses, or anything that could harm others will not qualify. This is about helping real people and real businesses get online.",
  },
  {
    question: "I have more questions. How can I reach you?",
    answer:
      "Feel free to reach out through my contact page or connect with me on any of my social media links in the footer. I'm happy to answer any questions!",
    hasContactLink: true,
  },
];

function FAQItem({
  question,
  answer,
  hasContactLink,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  hasContactLink?: boolean;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-subtle border-b">
      <button
        className="flex w-full items-center justify-between py-6 text-left"
        onClick={onClick}
        type="button"
      >
        <span className="font-medium text-lg text-primary">{question}</span>
        <ChevronDown
          className={`size-5 text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <motion.div
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
        initial={false}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <p className="pb-6 text-secondary leading-relaxed">
          {answer}
          {hasContactLink && (
            <>
              {" "}
              <Link
                className="text-primary transition-opacity hover:opacity-70"
                href="/contact"
              >
                Contact me <ArrowRight className="inline size-4" />
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}

export default function GiveawayPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { status, timeLeft } = useGiveawayStatus();

  return (
    <div className="min-h-screen bg-primary pt-48 md:pt-64">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <motion.div
            animate="visible"
            className="flex flex-col gap-8"
            initial="hidden"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.h1
              className="font-bold text-6xl text-primary leading-[0.9] tracking-tighter md:text-8xl lg:text-9xl"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: ANIMATION_DURATION_MEDIUM,
                    ease: ANIMATION_EASE_CUBIC,
                  },
                },
              }}
            >
              New Year,
              <br />
              Free Websites.
            </motion.h1>
            <motion.p
              className="max-w-2xl text-secondary text-xl leading-relaxed md:text-2xl"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: ANIMATION_DURATION_MEDIUM,
                    ease: ANIMATION_EASE_CUBIC,
                  },
                },
              }}
            >
              Celebrating 2026 by giving back. I'm building free websites for a
              few lucky winners — no catch, just good vibes.
            </motion.p>

            {/* Countdown */}
            {timeLeft && (
              <motion.div
                className="pt-12"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: ANIMATION_DURATION_MEDIUM,
                      ease: ANIMATION_EASE_CUBIC,
                    },
                  },
                }}
              >
                <p className="pb-4 font-mono text-muted text-sm uppercase tracking-widest">
                  {status === "pending"
                    ? "Giveaway starts in"
                    : "Time remaining"}
                </p>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                  <CountdownDisplay timeLeft={timeLeft} />
                  <p className="text-secondary text-sm md:text-base">
                    Read till the end to see how to enter{" "}
                    <ArrowRight className="inline size-4" />
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <h2 className="border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
                Why I&apos;m Doing This
              </h2>
              <p className="text-lg text-secondary leading-relaxed">
                2025 was a year of growth. I rebuilt my portfolio, worked with
                amazing clients, and received incredible feedback on my work.
              </p>
              <p className="text-lg text-secondary leading-relaxed">
                This giveaway is my way of saying{" "}
                <span className="text-primary">thank you</span> — and helping
                others kickstart their online presence without worrying about
                the cost.
              </p>
              <p className="text-lg text-secondary leading-relaxed">
                Whether you&apos;re starting a blog, showcasing your portfolio,
                or launching a business — I want to help you get online.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <h2 className="border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
                What You Get
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  "Custom website design & development",
                  "Hosting included (I'll handle it)",
                  "Basic SEO optimization",
                  "Mobile-responsive design",
                  "1 month of post-launch support",
                ].map((item) => (
                  <li
                    className="flex items-start gap-3 text-lg text-secondary"
                    key={item}
                  >
                    <Check className="mt-1 size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-primary">How It Works</h3>
                <p className="text-secondary leading-relaxed">
                  Enter the giveaway by filling out the form. If you&apos;re
                  selected as a winner, I&apos;ll reach out and guide you
                  through purchasing your domain. Then I handle everything else!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <h2 className="border-subtle border-b pb-4 font-mono text-secondary text-sm uppercase tracking-widest">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl pt-12">
            {faqs.map((faq, index) => (
              <FAQItem
                answer={faq.answer}
                hasContactLink={faq.hasContactLink}
                isOpen={openFaq === index}
                key={faq.question}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                question={faq.question}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 pb-32">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-4xl text-primary tracking-tighter md:text-5xl">
                Ready to enter?
              </h2>
              <p className="max-w-md text-lg text-secondary">
                Fill out the form and you&apos;re in. Hurry — only one week
                left!
              </p>
            </div>
            <Link
              className="group inline-flex items-center gap-2 rounded-sm border border-subtle px-8 py-4 font-medium text-base text-primary transition-opacity duration-300 hover:opacity-70"
              href="/giveaway/enter"
            >
              Enter Giveaway
              <ArrowRight className="size-4 text-muted transition-colors duration-300 group-hover:text-primary" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
