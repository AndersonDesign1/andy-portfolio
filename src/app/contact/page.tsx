"use client";

import React, { useState, useTransition, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendEmail } from "@/app/actions/sendEmail";

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function validateForm() {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    startTransition(async () => {
      const result = await sendEmail(new FormData(formRef.current!));
      if (result.success) {
        toast.success(result.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
        formRef.current?.reset();
      } else {
        toast.error(
          result.message || "Failed to send message. Please try again."
        );
      }
    });
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] },
    },
  };

  return (
    <section className="pt-36 flex min-h-screen items-center justify-center bg-light-bg dark:bg-dark-bg transition-colors duration-300 py-16">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-10"
        >
          <motion.h1
            className="text-3xl font-semibold text-light-heading dark:text-dark-heading mb-4 text-center transition-colors duration-300"
            variants={itemVariants}
          >
            Get In Touch
          </motion.h1>
          <motion.p
            className="text-base text-light-text dark:text-dark-text leading-relaxed max-w-2xl text-center mx-auto"
            variants={itemVariants}
          >
            Have a project in mind or want to collaborate? I'd love to hear from
            you. Let's discuss how we can bring your ideas to life.
          </motion.p>
        </motion.div>
        {/* Form */}
        <motion.form
          ref={formRef}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name Field */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label
              htmlFor="name"
              className="text-sm font-medium text-light-heading dark:text-dark-heading"
            >
              Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              className={
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label
              htmlFor="email"
              className="text-sm font-medium text-light-heading dark:text-dark-heading"
            >
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={
                errors.email ? "border-red-500 focus:border-red-500" : ""
              }
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </motion.div>

          {/* Subject Field */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <label
              htmlFor="subject"
              className="text-sm font-medium text-light-heading dark:text-dark-heading"
            >
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What's this about?"
            />
          </motion.div>

          {/* Message Field */}
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
              value={formData.message}
              onChange={handleInputChange}
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

          {/* Submit Button */}
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
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
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
