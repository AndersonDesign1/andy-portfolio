"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { m } from "motion/react";
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
  { label: "Portfolio", value: "portfolio" },
  { label: "Personal Blog", value: "blog" },
  { label: "Business Website", value: "business" },
  { label: "Landing Page", value: "landing" },
  { label: "Other", value: "other" },
];

const WORD_COUNT_REGEX = /\s+/;

// Zod schema for form validation
const entrySchema = z.object({
  description: z
    .string()
    .min(1, "Please tell me about your project")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 30;
    }, "Please provide at least 30 words about your project"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  projectName: z.string().optional(),
  websiteType: z.string().min(1, "Please select a website type"),
});

type EntryFormData = z.infer<typeof entrySchema>;
type EntryFormErrors = Partial<Record<keyof EntryFormData, string>>;

const initialForm: EntryFormData = {
  description: "",
  email: "",
  name: "",
  projectName: "",
  websiteType: "",
};

function GiveawayEntrySidebar({
  status,
  timeLeft,
}: {
  status: ReturnType<typeof useGiveawayStatus>["status"];
  timeLeft: ReturnType<typeof useGiveawayStatus>["timeLeft"];
}) {
  return (
    <div>
      <h1 className="font-bold text-5xl text-primary leading-[0.95] tracking-tighter md:text-7xl">
        Enter the
        <br />
        Giveaway
      </h1>
      <div className="flex flex-col gap-8 pt-8">
        <p className="max-w-sm text-lg text-secondary leading-relaxed md:text-xl">
          Fill out the form below to enter. Don&apos;t forget to read the{" "}
          <Link
            className="text-primary transition-opacity hover:opacity-70"
            href="/giveaway"
          >
            instructions
          </Link>{" "}
          if you haven&apos;t already!
        </p>

        {timeLeft && (
          <div>
            <p className="pb-3 font-mono text-muted text-sm uppercase tracking-widest">
              {status === "pending"
                ? "Giveaway starts in"
                : "Time remaining — Hurry!"}
            </p>
            <CountdownDisplay timeLeft={timeLeft} />
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-muted text-sm uppercase tracking-widest">
            Questions?
          </span>
          <a
            className="text-lg text-primary transition-opacity hover:opacity-70"
            href="mailto:contact@andersonjoseph.com"
          >
            contact@andersonjoseph.com
          </a>
        </div>
      </div>

      <div className="mt-12 rounded-sm border border-subtle bg-secondary/30 p-6">
        <p className="mb-3 font-mono text-muted text-xs uppercase tracking-widest">
          Important
        </p>
        <p className="text-secondary text-sm leading-relaxed">
          Your project must be legitimate. No scams, fraudulent schemes, or
          unethical projects will qualify. I&apos;m here to help real people and
          real businesses get online.
        </p>
      </div>
    </div>
  );
}

function GiveawayEntryFields({
  form,
  errors,
  isPending,
  onChange,
  onSelectChange,
}: {
  form: EntryFormData;
  errors: EntryFormErrors;
  isPending: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (value: string) => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
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
          onChange={onChange}
          placeholder="Your name"
          type="text"
          value={form.name}
        />
        {errors.name && (
          <p className="mt-1 font-mono text-red-500 text-xs">{errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
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
          onChange={onChange}
          placeholder="you@example.com"
          type="email"
          value={form.email}
        />
        {errors.email && (
          <p className="mt-1 font-mono text-red-500 text-xs">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          className="font-mono text-muted text-xs uppercase tracking-widest"
          htmlFor="websiteType"
        >
          Website Type *
        </label>
        <Select onValueChange={onSelectChange} value={form.websiteType}>
          <SelectTrigger
            className={`w-full border-subtle bg-transparent text-primary ${
              errors.websiteType ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select website type…" />
          </SelectTrigger>
          <SelectContent>
            {websiteTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input name="websiteType" type="hidden" value={form.websiteType} />
        {errors.websiteType && (
          <p className="mt-1 font-mono text-red-500 text-xs">
            {errors.websiteType}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
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
          onChange={onChange}
          placeholder="Optional for personal sites"
          type="text"
          value={form.projectName}
        />
      </div>

      <div className="flex flex-col gap-2">
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
          onChange={onChange}
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
              Submitting…
            </span>
          ) : (
            "Submit Entry"
          )}
        </Button>
      </div>
    </>
  );
}

export default function GiveawayEntryForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<EntryFormErrors>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { status, timeLeft } = useGiveawayStatus();

  function validate(): boolean {
    const result = entrySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: EntryFormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof EntryFormData;
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
    const fieldName = e.target.name as keyof EntryFormData;

    setForm((f) => ({ ...f, [fieldName]: e.target.value }));
    if (errors[fieldName]) {
      setErrors((err) => ({ ...err, [fieldName]: "" }));
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
        <m.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            className="inline-flex items-center gap-2 text-secondary text-sm transition-opacity duration-300 hover:opacity-70"
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
        </m.div>

        <div className="grid grid-cols-1 gap-16 pt-12 md:grid-cols-2 md:gap-32">
          <GiveawayEntrySidebar status={status} timeLeft={timeLeft} />

          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <GiveawayEntryFields
              errors={errors}
              form={form}
              isPending={isPending}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
            />
          </form>
        </div>
      </div>
    </section>
  );
}
