"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { submitGiveawayFeedback } from "@/app/actions/submit-giveaway-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const WORD_COUNT_REGEX = /\s+/u;

const feedbackSchema = z.object({
  benefits: z
    .string()
    .min(5, "Please tell me how this helps you")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 30;
    }, "Please provide at least 30 words about the benefits."),
  brandDescription: z
    .string()
    .min(10, "Please provide a bit more detail (at least 10 characters)")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 80;
    }, "Please provide at least 80 words about your brand/project so I can understand it fully."),
  domainStatus: z.enum(["yes", "no", "need_help"]),
  email: z.email("Invalid email address"),
  features: z.string().min(5, "Please list at least one feature"),
  name: z.string().optional(),
});

export default function GiveawayFeedbackPage() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values = {
      benefits: formData.get("benefits"),
      brandDescription: formData.get("brandDescription"),
      domainStatus: formData.get("domainStatus"),
      email: formData.get("email"),
      features: formData.get("features"),
      name: formData.get("name"),
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
        window.scrollTo({ behavior: "smooth", top: 0 });
      } else {
        toast.error(res.message);
      }
    });
  }

  if (isSubmitted) {
    return (
      <section className="bg-primary min-h-screen pt-32 pb-24 md:pt-48">
        <div className="mx-auto w-full max-w-screen-md px-6 text-center md:px-12">
          <div className="giveaway-feedback-success flex flex-col items-center justify-center gap-6">
            <div className="bg-secondary/10 rounded-full p-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-primary text-4xl font-bold md:text-5xl">
              Thank You!
            </h1>
            <p className="text-secondary mx-auto max-w-lg text-lg">
              Your feedback has been received. This information will help me
              verify that you're a perfect candidate for the free website. I'll
              be reviewing everything soon!
            </p>
            <div className="pt-8">
              <Link
                className="border-primary text-primary inline-flex items-center gap-2 border-b pb-1 transition-opacity hover:opacity-70"
                href="/"
              >
                <HugeiconsIcon
                  color="currentColor"
                  icon={ArrowLeft01Icon}
                  size={16}
                  strokeWidth={1.5}
                />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary min-h-screen pt-32 pb-24 md:pt-48">
      <div className="mx-auto flex w-full max-w-screen-md flex-col gap-12 px-6 md:px-12">
        {/* Back Link */}
        <div className="giveaway-feedback-back-link">
          <Link
            className="text-secondary inline-flex items-center gap-2 text-sm transition-opacity duration-300 hover:opacity-70"
            href="/giveaway"
          >
            <HugeiconsIcon
              color="currentColor"
              icon={ArrowLeft01Icon}
              size={16}
              strokeWidth={1.5}
            />
            Back to Giveaway
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-primary text-4xl leading-tight font-bold md:text-5xl">
            Help Me Build Your Vision
          </h1>
          <p className="text-secondary text-lg leading-relaxed">
            I want to make sure the winner gets a website that truly impacts
            their goals. Please fill out this quick form to tell me more about
            what you need.
          </p>
        </div>

        <form className="flex flex-col gap-12" onSubmit={handleSubmit}>
          {/* Basics */}
          <div className="flex flex-col gap-6">
            <h2 className="border-subtle text-primary border-b pb-2 text-xl font-semibold">
              The Basics
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-primary" htmlFor="name">
                  Name (Optional)
                </Label>
                <Input
                  className="border-subtle focus-visible:border-foreground bg-transparent focus-visible:ring-0"
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
                  className="border-subtle focus-visible:border-foreground bg-transparent focus-visible:ring-0"
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
            <h2 className="border-subtle text-primary border-b pb-2 text-xl font-semibold">
              Project Details
            </h2>

            <div className="flex flex-col gap-2">
              <Label className="text-primary" htmlFor="brandDescription">
                Describe what the website should do for you or your brand * (min
                80 words)
              </Label>
              <Textarea
                className="border-subtle focus-visible:border-foreground min-h-[100px] resize-y bg-transparent focus-visible:ring-0"
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
                className="border-subtle focus-visible:border-foreground min-h-[100px] resize-y bg-transparent focus-visible:ring-0"
                id="features"
                name="features"
                placeholder="e.g. A gallery, a contact form, a blog..."
                required
              />
            </div>

            <div className="flex flex-col gap-5">
              <p
                className="text-primary text-sm font-medium"
                id="domain-status-label"
              >
                Do you have a domain name?
              </p>
              <RadioGroup
                aria-labelledby="domain-status-label"
                className="flex flex-col gap-4"
                defaultValue="no"
                name="domainStatus"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="domain-yes" value="yes" />
                  <Label
                    className="text-secondary font-normal"
                    htmlFor="domain-yes"
                  >
                    Yes, I already have one
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="domain-no" value="no" />
                  <Label
                    className="text-secondary font-normal"
                    htmlFor="domain-no"
                  >
                    No, not yet
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem id="domain-help" value="need_help" />
                  <Label
                    className="text-secondary font-normal"
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
                className="border-subtle focus-visible:border-foreground min-h-[100px] resize-y bg-transparent focus-visible:ring-0"
                id="benefits"
                name="benefits"
                placeholder="e.g. It will help me get more clients by showcasing my work more professionally..."
                required
              />
            </div>
          </div>

          <Button
            className="border-subtle text-primary w-full border bg-transparent px-8 py-6 transition-opacity hover:opacity-70 md:w-auto"
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
