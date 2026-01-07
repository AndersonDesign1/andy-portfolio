"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import Link from "next/link";
import type React from "react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { submitGiveawayEntry } from "@/app/actions/submit-giveaway-entry";
import {
  CountdownDisplay,
  useGiveawayStatus,
} from "@/components/giveaway-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const websiteTypes = [
  { value: "portfolio", label: "Portfolio" },
  { value: "blog", label: "Personal Blog" },
  { value: "business", label: "Business Website" },
  { value: "landing", label: "Landing Page" },
  { value: "other", label: "Other" },
];

const WORD_COUNT_REGEX = /\s+/;

// Zod schema for form validation
const entrySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  websiteType: z.string().min(1, "Please select a website type"),
  projectName: z.string().optional(),
  description: z
    .string()
    .min(1, "Please tell me about your project")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 30;
    }, "Please provide at least 30 words about your project"),
});

type EntryFormData = z.infer<typeof entrySchema>;

const initialForm: EntryFormData = {
  name: "",
  email: "",
  websiteType: "",
  projectName: "",
  description: "",
};

export default function GiveawayEntryForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { status, timeLeft } = useGiveawayStatus();

  function validate(): boolean {
    const result = entrySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { [k: string]: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((err) => ({ ...err, [e.target.name]: "" }));
    }
  }

  function handleSelectChange(value: string) {
    setForm((f) => ({ ...f, websiteType: value }));
    if (errors.websiteType) {
      setErrors((err) => ({ ...err, websiteType: "" }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    startTransition(async () => {
      if (!formRef.current) {
        toast.error("Form reference not available. Please try again.");
        return;
      }

      const result = await submitGiveawayEntry(new FormData(formRef.current));
      if (result.success) {
        toast.success(result.message);
        setForm(initialForm);
        formRef.current.reset();
      } else {
        toast.error(
          result.message || "Failed to submit entry. Please try again."
        );
      }
    });
  }

  return (
    <section className="min-h-screen bg-primary pt-48 pb-24 md:pt-64">
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        {/* Back Navigation */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 text-secondary text-sm transition-opacity duration-300 hover:opacity-70"
            href="/giveaway"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Giveaway
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-32">
          {/* Header */}
          <div>
            <h1 className="mb-8 font-bold text-5xl text-primary leading-[0.95] tracking-tighter md:text-7xl">
              Enter the
              <br />
              Giveaway
            </h1>
            <p className="max-w-sm text-lg text-secondary leading-relaxed md:text-xl">
              Fill out the form below to enter. Don't forget to read the{" "}
              <Link
                className="text-primary transition-opacity hover:opacity-70"
                href="/giveaway"
              >
                instructions
              </Link>{" "}
              if you haven't already!
            </p>

            {/* Countdown */}
            {timeLeft && (
              <div className="mt-8">
                <p className="mb-3 font-mono text-muted text-sm uppercase tracking-widest">
                  {status === "pending"
                    ? "Giveaway starts in"
                    : "Time remaining — Hurry!"}
                </p>
                <CountdownDisplay timeLeft={timeLeft} />
              </div>
            )}

            <div className="mt-12 space-y-6">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-muted text-sm uppercase tracking-widest">
                  Questions?
                </span>
                <a
                  className="text-lg text-primary transition-opacity hover:opacity-70"
                  href="mailto:hello@andersonjoseph.com"
                >
                  hello@andersonjoseph.com
                </a>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-12 rounded-sm border border-subtle bg-secondary/30 p-6">
              <p className="mb-3 font-mono text-muted text-xs uppercase tracking-widest">
                Important
              </p>
              <p className="text-secondary text-sm leading-relaxed">
                Your project must be legitimate. No scams, fraudulent schemes,
                or unethical projects will qualify. I'm here to help real people
                and real businesses get online.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            {/* Name */}
            <div className="space-y-2">
              <label
                className="font-mono text-muted text-xs uppercase tracking-widest"
                htmlFor="name"
              >
                Name *
              </label>
              <Input
                className={`rounded-none border-subtle border-x-0 border-t-0 border-b bg-transparent px-0 py-2 text-primary placeholder:text-neutral-500/60 focus-visible:border-foreground focus-visible:ring-0 dark:placeholder:text-neutral-400/60 ${
                  errors.name ? "border-red-500" : ""
                }`}
                id="name"
                name="name"
                onChange={handleChange}
                placeholder="Your name"
                type="text"
                value={form.name}
              />
              {errors.name && (
                <p className="mt-1 font-mono text-red-500 text-xs">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="font-mono text-muted text-xs uppercase tracking-widest"
                htmlFor="email"
              >
                Email *
              </label>
              <Input
                className={`rounded-none border-subtle border-x-0 border-t-0 border-b bg-transparent px-0 py-2 text-primary placeholder:text-neutral-500/60 focus-visible:border-foreground focus-visible:ring-0 dark:placeholder:text-neutral-400/60 ${
                  errors.email ? "border-red-500" : ""
                }`}
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                type="email"
                value={form.email}
              />
              {errors.email && (
                <p className="mt-1 font-mono text-red-500 text-xs">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Website Type - Using shadcn Select */}
            <div className="space-y-2">
              <label
                className="font-mono text-muted text-xs uppercase tracking-widest"
                htmlFor="websiteType"
              >
                Website Type *
              </label>
              <Select
                onValueChange={handleSelectChange}
                value={form.websiteType}
              >
                <SelectTrigger
                  className={`w-full border-subtle bg-transparent text-primary ${
                    errors.websiteType ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select website type..." />
                </SelectTrigger>
                <SelectContent>
                  {websiteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Hidden input for FormData */}
              <input
                name="websiteType"
                type="hidden"
                value={form.websiteType}
              />
              {errors.websiteType && (
                <p className="mt-1 font-mono text-red-500 text-xs">
                  {errors.websiteType}
                </p>
              )}
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <label
                className="font-mono text-muted text-xs uppercase tracking-widest"
                htmlFor="projectName"
              >
                Project / Business Name
              </label>
              <Input
                className="rounded-none border-subtle border-x-0 border-t-0 border-b bg-transparent px-0 py-2 text-primary placeholder:text-neutral-500/60 focus-visible:border-foreground focus-visible:ring-0 dark:placeholder:text-neutral-400/60"
                id="projectName"
                name="projectName"
                onChange={handleChange}
                placeholder="Optional for personal sites"
                type="text"
                value={form.projectName}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                className="font-mono text-muted text-xs uppercase tracking-widest"
                htmlFor="description"
              >
                Tell me about your project *
              </label>
              <Textarea
                className={`min-h-[120px] resize-none rounded-none border-subtle border-x-0 border-t-0 border-b bg-transparent px-0 py-2 text-primary placeholder:text-neutral-500/60 focus-visible:border-foreground focus-visible:ring-0 dark:placeholder:text-neutral-400/60 ${
                  errors.description ? "border-red-500" : ""
                }`}
                id="description"
                name="description"
                onChange={handleChange}
                placeholder="What's your website about? What do you want to achieve?"
                rows={4}
                value={form.description}
              />
              {errors.description && (
                <p className="mt-1 font-mono text-red-500 text-xs">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Button
                className="w-full border border-subtle bg-transparent px-8 py-6 text-primary transition-opacity duration-300 hover:opacity-70 md:w-auto"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Entry"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
