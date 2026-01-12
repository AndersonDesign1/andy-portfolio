"use client";

import type React from "react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { sendEmail } from "@/app/actions/send-email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EMAIL_REGEX } from "@/lib/constants";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function validate() {
    const e: { [k: string]: string } = {};
    if (!form.name.trim()) {
      e.name = "Name is required";
    }
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!EMAIL_REGEX.test(form.email)) {
      e.email = "Please enter a valid email address";
    }
    if (!form.message.trim()) {
      e.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      e.message = "Message must be at least 10 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((err) => ({ ...err, [e.target.name]: "" }));
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

      const result = await sendEmail(new FormData(formRef.current));
      if (result.success) {
        toast.success(result.message);
        setForm(initialForm);
        formRef.current.reset();
      } else {
        toast.error(
          result.message || "Failed to send message. Please try again."
        );
      }
    });
  }

  return (
    <section className="min-h-screen bg-primary pt-48 pb-24 md:pt-64">
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-32">
          {/* Header */}
          <div>
            <h1 className="font-bold text-6xl text-primary leading-[0.9] tracking-tighter md:text-8xl">
              Let&apos;s
              <br />
              talk.
            </h1>
            <div className="flex flex-col gap-12 pt-8">
              <p className="max-w-sm text-lg text-secondary leading-relaxed md:text-xl">
                Have a project in mind or want to collaborate? I&apos;m
                currently open to new opportunities.
              </p>

              <div className="flex flex-col gap-4">
                <span className="font-mono text-muted text-sm uppercase tracking-widest">
                  Email
                </span>
                <a
                  className="text-primary text-xl transition-colors hover:text-accent"
                  href="mailto:hello@andersonjoseph.com"
                >
                  hello@andersonjoseph.com
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            {[
              {
                label: "Name",
                name: "name",
                type: "text",
                value: form.name,
                error: errors.name,
                placeholder: "John Doe",
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                value: form.email,
                error: errors.email,
                placeholder: "john@example.com",
              },
              {
                label: "Subject",
                name: "subject",
                type: "text",
                value: form.subject,
                error: undefined,
                placeholder: "Project Inquiry",
              },
            ].map((field) => (
              <div className="flex flex-col gap-2" key={field.name}>
                <label
                  className="font-mono text-muted text-xs uppercase tracking-widest"
                  htmlFor={field.name}
                >
                  {field.label} {field.label !== "Subject" && "*"}
                </label>
                <Input
                  className={`rounded-none border-subtle border-x-0 border-t-0 border-b bg-transparent px-0 py-2 text-primary placeholder:text-neutral-500/60 focus-visible:border-foreground focus-visible:ring-0 dark:placeholder:text-neutral-400/60 ${
                    field.error ? "border-red-500" : ""
                  }`}
                  id={field.name}
                  name={field.name}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={field.value}
                />
                {field.error && (
                  <p className="mt-1 font-mono text-red-500 text-xs">
                    {field.error}
                  </p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <label
                className="font-mono text-muted text-xs uppercase tracking-widest"
                htmlFor="message"
              >
                Message *
              </label>
              <Textarea
                className={`min-h-[150px] resize-none rounded-none border-subtle border-x-0 border-t-0 border-b bg-transparent px-0 py-2 text-primary placeholder:text-neutral-500/60 focus-visible:border-foreground focus-visible:ring-0 dark:placeholder:text-neutral-400/60 ${
                  errors.message ? "border-red-500" : ""
                }`}
                id="message"
                name="message"
                onChange={handleChange}
                placeholder="Tell me about your project…"
                rows={4}
                value={form.message}
              />
              {errors.message && (
                <p className="mt-1 font-mono text-red-500 text-xs">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="pt-8">
              <Button
                className="w-full border border-subtle bg-transparent px-8 py-6 text-primary transition-all duration-300 hover:border-primary hover:bg-secondary/50 hover:backdrop-blur-sm md:w-auto"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Sending…
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
