"use client";

import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import {
  CountdownDisplay,
  useGiveawayStatus,
} from "@/components/giveaway-banner";

const faqs = [
  {
    answer:
      "Not under the free giveaway, but I'd love to help! Reach out to me on my contact page and I'll offer you a discounted rate for your SaaS project.",
    hasContactLink: true,
    question: "Can I build a full SaaS under this free plan?",
  },
  {
    answer:
      "Both personal and business websites are welcome! Whether it's a portfolio, blog, landing page, or a website for your business — you're eligible to enter. However, your project must be legitimate. No scams, shady schemes, or anything unethical will qualify.",
    question: "What kind of websites qualify?",
  },
  {
    answer:
      "Simple! Just fill out the entry form with your details. Once you're selected as a winner, I'll guide you through getting your domain set up.",
    question: "How do I enter the giveaway?",
  },
  {
    answer:
      "The giveaway ends on January 9th, 2026 at 12:00 PM (Nigeria time). That's just one week — so hurry up and enter!",
    question: "When does the giveaway end?",
  },
  {
    answer:
      "Everything! Design, development, hosting, and basic SEO optimization. Winners will be guided through purchasing their domain, then I handle the rest.",
    question: "What's included in the free website?",
  },
  {
    answer:
      "Absolutely. I'm only building websites for legitimate projects. Scams, fraudulent businesses, or anything that could harm others will not qualify. This is about helping real people and real businesses get online.",
    question: "Does my business or project need to be legit?",
  },
  {
    answer:
      "Feel free to reach out through my contact page or connect with me on any of my social media links in the footer. I'm happy to answer any questions!",
    hasContactLink: true,
    question: "I have more questions. How can I reach you?",
  },
];

const FAQItem = ({
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
}) => (
  <div className="border-subtle border-b">
    <button
      className="flex w-full items-center justify-between py-6 text-left"
      onClick={onClick}
      type="button"
    >
      <span className="text-primary text-lg font-medium">{question}</span>
      <HugeiconsIcon
        className={`text-muted transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
        color="currentColor"
        icon={ArrowDown01Icon}
        size={20}
        strokeWidth={1.5}
      />
    </button>
    <div
      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <p className="text-secondary pb-6 leading-relaxed">
          {answer}
          {hasContactLink && (
            <>
              {" "}
              <a
                className="text-primary transition-opacity hover:opacity-70"
                href="/contact"
              >
                Contact me{" "}
                <HugeiconsIcon
                  className="inline"
                  color="currentColor"
                  icon={ArrowRight01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  </div>
);

const GiveawayPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { status, timeLeft } = useGiveawayStatus();

  return (
    <div className="bg-primary min-h-screen pt-48 md:pt-64">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <div className="flex flex-col gap-8">
            <h1 className="text-primary text-6xl leading-[0.9] font-bold tracking-tighter md:text-8xl lg:text-9xl">
              New Year,
              <br />
              Free Websites.
            </h1>
            <p className="text-secondary max-w-2xl text-xl leading-relaxed md:text-2xl">
              Celebrating 2026 by giving back. I&apos;m building free websites
              for a few lucky winners — no catch, just good vibes.
            </p>

            {/* Countdown */}
            {timeLeft && (
              <div className="pt-12">
                <p className="text-muted pb-4 font-mono text-sm tracking-widest uppercase">
                  {status === "pending"
                    ? "Giveaway starts in"
                    : "Time remaining"}
                </p>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                  <CountdownDisplay timeLeft={timeLeft} />
                  <p className="text-secondary text-sm md:text-base">
                    Read till the end to see how to enter{" "}
                    <HugeiconsIcon
                      className="inline"
                      color="currentColor"
                      icon={ArrowRight01Icon}
                      size={16}
                      strokeWidth={1.5}
                    />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="mx-auto max-w-screen-xl px-6 md:px-12">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
                Why I&apos;m Doing This
              </h2>
              <p className="text-secondary text-lg leading-relaxed">
                2025 was a year of growth. I rebuilt my portfolio, worked with
                amazing clients, and received incredible feedback on my work.
              </p>
              <p className="text-secondary text-lg leading-relaxed">
                This giveaway is my way of saying{" "}
                <span className="text-primary">thank you</span> — and helping
                others kickstart their online presence without worrying about
                the cost.
              </p>
              <p className="text-secondary text-lg leading-relaxed">
                Whether you&apos;re starting a blog, showcasing your portfolio,
                or launching a business — I want to help you get online.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
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
                    className="text-secondary flex items-start gap-3 text-lg"
                    key={item}
                  >
                    <HugeiconsIcon
                      className="text-primary mt-1"
                      color="currentColor"
                      icon={Tick01Icon}
                      size={16}
                      strokeWidth={1.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4">
                <h3 className="text-primary font-medium">How It Works</h3>
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
          <h2 className="border-subtle text-secondary border-b pb-4 font-mono text-sm tracking-widest uppercase">
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
              <h2 className="text-primary text-4xl font-bold tracking-tighter md:text-5xl">
                Ready to enter?
              </h2>
              <p className="text-secondary max-w-md text-lg">
                Fill out the form and you&apos;re in. Hurry — only one week
                left!
              </p>
            </div>
            <a
              className="group border-subtle text-primary inline-flex items-center gap-2 rounded-sm border px-8 py-4 text-base font-medium transition-opacity duration-300 hover:opacity-70"
              href="/giveaway/enter"
            >
              Enter Giveaway
              <HugeiconsIcon
                className="text-muted group-hover:text-primary transition-colors duration-300"
                color="currentColor"
                icon={ArrowRight01Icon}
                size={16}
                strokeWidth={1.5}
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiveawayPage;
