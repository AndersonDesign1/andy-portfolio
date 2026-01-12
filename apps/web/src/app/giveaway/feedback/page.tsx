"use client";

import { ArrowLeftIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { submitGiveawayFeedback } from "@/app/actions/submit-giveaway-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const WORD_COUNT_REGEX = /\s+/;

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  brandDescription: z
    .string()
    .min(10, "Please provide a bit more detail (at least 10 characters)")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 80;
    }, "Please provide at least 80 words about your brand/project so I can understand it fully."),
  features: z.string().min(5, "Please list at least one feature"),
  domainStatus: z.enum(["yes", "no", "need_help"]),
  benefits: z
    .string()
    .min(5, "Please tell me how this helps you")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 30;
    }, "Please provide at least 30 words about the benefits."),
});

export default function GiveawayFeedbackPage() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values = {
      name: formData.get("name"),
      email: formData.get("email"),
      brandDescription: formData.get("brandDescription"),
      features: formData.get("features"),
      domainStatus: formData.get("domainStatus"),
      benefits: formData.get("benefits"),
    };

    const result = feedbackSchema.safeParse(values);
    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message || "Please check your inputs"
      );
      return;
    }

    startTransition(async () => {
      const res = await submitGiveawayFeedback(formData);
      if (res.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res.message);
      }
    });
  }

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-primary pt-32 pb-24 md:pt-48">
        <div className="mx-auto w-full max-w-screen-md px-6 text-center md:px-12">
          <motion.div
            animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          >
            <div className="rounded-full bg-secondary/10 p-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="font-bold text-4xl text-primary md:text-5xl">
              Thank You!
            </h1>
            <p className="mx-auto max-w-lg text-lg text-secondary">
              Your feedback has been received. This information will help me
              verify that you're a perfect candidate for the free website. I'll
              be reviewing everything soon!
            </p>
            <div className="pt-8">
              <Link
                className="inline-flex items-center gap-2 border-primary border-b pb-1 text-primary transition-opacity hover:opacity-70"
                href="/"
              >
                <ArrowLeftIcon className="size-4" />
                Return to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-primary pt-32 pb-24 md:pt-48">
      <div className="mx-auto flex w-full max-w-screen-md flex-col gap-12 px-6 md:px-12">
        {/* Back Link */}
        <motion.div
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 0.4 }
          }
        >
          <Link
            className="inline-flex items-center gap-2 text-secondary text-sm transition-opacity duration-300 hover:opacity-70"
            href="/giveaway"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Giveaway
          </Link>
        </motion.div>

        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-4xl text-primary leading-tight md:text-5xl">
            Help Me Build Your Vision
          </h1>
          <p className="text-lg text-secondary leading-relaxed">
            I want to make sure the winner gets a website that truly impacts
            their goals. Please fill out this quick form to tell me more about
            what you need.
          </p>
        </div>

        <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
          {/* Basics */}
          <div className="flex flex-col gap-6">
            <h2 className="border-subtle border-b pb-2 font-semibold text-primary text-xl">
              The Basics
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-primary" htmlFor="name">
                  Name (Optional)
                </Label>
                <Input
                  className="border-subtle bg-transparent focus-visible:border-foreground focus-visible:ring-0"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-primary" htmlFor="email">
                  Email Address *
                </Label>
                <Input
                  className="border-subtle bg-transparent focus-visible:border-foreground focus-visible:ring-0"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="flex flex-col gap-6">
            <h2 className="border-subtle border-b pb-2 font-semibold text-primary text-xl">
              Project Details
            </h2>

            <div className="flex flex-col gap-2">
              <Label className="text-primary" htmlFor="brandDescription">
                Describe what the website should do for you or your brand * (min
                80 words)
              </Label>
              <Textarea
                className="min-h-[100px] resize-y border-subtle bg-transparent focus-visible:border-foreground focus-visible:ring-0"
                id="brandDescription"
                name="brandDescription"
                placeholder="e.g. I need a portfolio to show my design work... (Please be descriptive)"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-primary" htmlFor="features">
                What specific features do you want? *
              </Label>
              <Textarea
                className="min-h-[100px] resize-y border-subtle bg-transparent focus-visible:border-foreground focus-visible:ring-0"
                id="features"
                name="features"
                placeholder="e.g. A gallery, a contact form, a blog..."
                required
              />
            </div>

            <div className="flex flex-col gap-5">
              <Label className="text-primary">Do you have a domain name?</Label>
              <RadioGroup
                className="flex flex-col gap-4"
                defaultValue="no"
                name="domainStatus"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="domain-yes" value="yes" />
                  <Label
                    className="font-normal text-secondary"
                    htmlFor="domain-yes"
                  >
                    Yes, I already have one
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="domain-no" value="no" />
                  <Label
                    className="font-normal text-secondary"
                    htmlFor="domain-no"
                  >
                    No, not yet
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="domain-help" value="need_help" />
                  <Label
                    className="font-normal text-secondary"
                    htmlFor="domain-help"
                  >
                    No, and I need help choosing one
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-primary" htmlFor="benefits">
                How will this website benefit you? * (min 30 words)
              </Label>
              <Textarea
                className="min-h-[100px] resize-y border-subtle bg-transparent focus-visible:border-foreground focus-visible:ring-0"
                id="benefits"
                name="benefits"
                placeholder="e.g. It will help me get more clients by showcasing my work more professionally..."
                required
              />
            </div>
          </div>

          <Button
            className="w-full border border-subtle bg-transparent px-8 py-6 text-primary transition-opacity hover:opacity-70 md:w-auto"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Sending..." : "Send Feedback"}
          </Button>
        </form>
      </div>
    </section>
  );
}
