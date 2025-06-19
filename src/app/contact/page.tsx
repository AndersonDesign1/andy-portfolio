"use client";

import React, { useState, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendEmail } from "@/app/actions/sendEmail";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] },
  },
};

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function validate() {
    const e: { [k: string]: string } = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((err) => ({ ...err, [e.target.name]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    startTransition(async () => {
      const result = await sendEmail(new FormData(formRef.current!));
      if (result.success) {
        toast.success(result.message);
        setForm(initialForm);
        formRef.current?.reset();
      } else {
        toast.error(
          result.message || "Failed to send message. Please try again."
        );
      }
    });
  }

  return (
    <section className="pt-36 flex min-h-screen items-center justify-center bg-light-bg dark:bg-dark-bg transition-colors duration-300 py-16">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="mb-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-semibold text-light-heading dark:text-dark-heading mb-4 text-center"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base text-light-text dark:text-dark-text leading-relaxed max-w-2xl text-center mx-auto"
          >
            Have a project in mind or want to collaborate? I&apos;d love to hear
            from you. Let&apos;s discuss how we can bring your ideas to life.
          </motion.p>
        </motion.div>
        <motion.form
          ref={formRef}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          onSubmit={handleSubmit}
          className="space-y-6"
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
            <motion.div
              key={field.name}
              className="space-y-2"
              variants={itemVariants}
            >
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-light-heading dark:text-dark-heading"
              >
                {field.label}
              </label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={field.value}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={
                  field.error ? "border-red-500 focus:border-red-500" : ""
                }
                aria-describedby={
                  field.error ? `${field.name}-error` : undefined
                }
              />
              {field.error && (
                <p id={`${field.name}-error`} className="text-sm text-red-500">
                  {field.error}
                </p>
              )}
            </motion.div>
          ))}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label
              htmlFor="message"
              className="text-sm font-medium text-light-heading dark:text-dark-heading"
            >
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project or how I can help..."
              rows={6}
              className={
                errors.message ? "border-red-500 focus:border-red-500" : ""
              }
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-red-500">
                {errors.message}
              </p>
            )}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            <Button
              type="submit"
              disabled={isPending}
              className="w-full px-8 py-3 text-base"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
