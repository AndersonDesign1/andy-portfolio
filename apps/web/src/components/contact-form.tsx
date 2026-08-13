"use client";

import { actions } from "astro:actions";
import type React from "react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EMAIL_REGEX } from "@/lib/constants";

const initialForm = { email: "", message: "", name: "", subject: "" };

const ContactForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const validate = () => {
    const e: Record<string, string> = {};
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
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [e.target.name]: "",
      }));
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await actions.sendEmail(formData);
      if (result.error) {
        toast.error(result.error.message || "Failed to send message.");
        return;
      }
      toast.success(result.data?.message || "Message sent!");
      setErrors({});
      setForm(initialForm);
      formRef.current?.reset();
    });
  };

  return (
    <section className="bg-primary min-h-screen pt-40 pb-24 md:pt-48">
      <div className="mx-auto w-full max-w-screen-lg px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-32">
          <div>
            <h1 className="text-primary text-6xl leading-[0.9] font-bold tracking-tighter md:text-8xl">
              Let&apos;s
              <br />
              talk.
            </h1>
            <div className="flex flex-col gap-12 pt-8">
              <p className="text-secondary max-w-sm text-lg leading-relaxed md:text-xl">
                Have a project in mind or want to collaborate? I&apos;m
                currently open to new opportunities.
              </p>
              <div className="flex flex-col gap-4">
                <span className="text-muted font-mono text-sm tracking-widest uppercase">
                  Email
                </span>
                <a
                  className="text-primary hover:text-accent text-xl"
                  href="mailto:contact@andersonjoseph.com"
                >
                  contact@andersonjoseph.com
                </a>
              </div>
            </div>
          </div>

          <form
            className="relative flex flex-col gap-8"
            method="POST"
            noValidate
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-auto -left-[9999px] size-px overflow-hidden opacity-0"
            >
              <label htmlFor="projectMilestone">Project milestone</label>
              <input
                autoComplete="off"
                defaultValue=""
                id="projectMilestone"
                name="projectMilestone"
                tabIndex={-1}
                type="text"
              />
            </div>
            {[
              {
                error: errors.name,
                label: "Name",
                name: "name",
                placeholder: "John Doe…",
                type: "text",
                value: form.name,
              },
              {
                error: errors.email,
                label: "Email",
                name: "email",
                placeholder: "john@example.com…",
                type: "email",
                value: form.email,
              },
              {
                error: undefined,
                label: "Subject",
                name: "subject",
                placeholder: "Project Inquiry…",
                type: "text",
                value: form.subject,
              },
            ].map((field) => (
              <div className="flex flex-col gap-2" key={field.name}>
                <label
                  className="text-muted font-mono text-xs tracking-widest uppercase"
                  htmlFor={field.name}
                >
                  {field.label} {field.label !== "Subject" && "*"}
                </label>
                <Input
                  className={`border-subtle text-primary focus-visible:border-foreground rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 py-2 placeholder:text-neutral-500/60 focus-visible:ring-0 dark:placeholder:text-neutral-400/60 ${
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
                  <p className="font-mono text-xs text-red-500">
                    {field.error}
                  </p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <label
                className="text-muted font-mono text-xs tracking-widest uppercase"
                htmlFor="message"
              >
                Message *
              </label>
              <Textarea
                className={`border-subtle text-primary focus-visible:border-foreground min-h-[150px] resize-none rounded-none border-x-0 border-t-0 border-b bg-transparent px-0 py-2 placeholder:text-neutral-500/60 focus-visible:ring-0 dark:placeholder:text-neutral-400/60 ${
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
                <p className="font-mono text-xs text-red-500">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="pt-8">
              <Button
                className="border-subtle text-primary hover:border-primary hover:bg-secondary/50 w-full border bg-transparent px-8 py-6 transition-transform duration-150 ease-[var(--ease-out)] hover:backdrop-blur-sm md:w-auto"
                disabled={isPending}
                type="submit"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent" />
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
};

export default ContactForm;
