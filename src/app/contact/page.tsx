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

export default function ContactPage() {
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
    <section className="flex min-h-screen items-center justify-center bg-light-bg py-16 pt-36 transition-colors duration-300 dark:bg-dark-bg">
      <div className="mx-auto w-full max-w-lg px-4 sm:px-8">
        <div className="fade-in slide-in-from-bottom-4 mb-10 animate-in duration-500">
          <h1 className="mb-4 text-center font-semibold text-2xl text-light-heading sm:text-3xl dark:text-dark-heading">
            Get In Touch
          </h1>
          <p className="mx-auto max-w-2xl text-center text-base text-light-text leading-relaxed dark:text-dark-text">
            Have a project in mind or want to collaborate? I&apos;d love to hear
            from you. Let&apos;s discuss how we can bring your ideas to life.
          </p>
        </div>
        <form
          className="fade-in slide-in-from-bottom-4 animate-in space-y-6 delay-200 duration-500"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          {[
            {
              label: "Name *",
              name: "name",
              type: "text",
              value: form.name,
              error: errors.name,
              placeholder: "Your full name",
            },
            {
              label: "Email *",
              name: "email",
              type: "email",
              value: form.email,
              error: errors.email,
              placeholder: "your.email@example.com",
            },
            {
              label: "Subject",
              name: "subject",
              type: "text",
              value: form.subject,
              error: undefined,
              placeholder: "What's this about?",
            },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <label
                className="font-medium text-light-heading text-sm dark:text-dark-heading"
                htmlFor={field.name}
              >
                {field.label}
              </label>
              <Input
                aria-describedby={
                  field.error ? `${field.name}-error` : undefined
                }
                className={
                  field.error ? "border-red-500 focus:border-red-500" : ""
                }
                id={field.name}
                name={field.name}
                onChange={handleChange}
                placeholder={field.placeholder}
                type={field.type}
                value={field.value}
              />
              {field.error && (
                <p className="text-red-500 text-sm" id={`${field.name}-error`}>
                  {field.error}
                </p>
              )}
            </div>
          ))}
          <div className="space-y-2">
            <label
              className="font-medium text-light-heading text-sm dark:text-dark-heading"
              htmlFor="message"
            >
              Message *
            </label>
            <Textarea
              aria-describedby={errors.message ? "message-error" : undefined}
              className={
                errors.message ? "border-red-500 focus:border-red-500" : ""
              }
              id="message"
              name="message"
              onChange={handleChange}
              placeholder="Tell me about your project or how I can help..."
              rows={6}
              value={form.message}
            />
            {errors.message && (
              <p className="text-red-500 text-sm" id="message-error">
                {errors.message}
              </p>
            )}
          </div>
          <Button
            className="w-full px-8 py-3 text-base transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
