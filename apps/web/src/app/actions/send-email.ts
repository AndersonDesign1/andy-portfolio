"use server";

import { checkBotId } from "botid/server";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);
const BLOCKED_SUBMISSION_MESSAGE =
  "We couldn't send your message. Please try again later.";

export interface ContactSubmissionState {
  success: boolean;
  message: string;
  status: "idle" | "success" | "error";
}

export const INITIAL_CONTACT_SUBMISSION_STATE: ContactSubmissionState = {
  success: false,
  message: "",
  status: "idle",
};

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  subject: z
    .string()
    .max(200)
    .optional()
    .default("New Contact Form Submission"),
  message: z.string().min(1, "Message is required").max(5000),
});

const honeypotSchema = z.object({
  projectMilestone: z.string().trim().max(0).default(""),
});

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export async function sendEmail(
  _previousState: ContactSubmissionState,
  formData: FormData
): Promise<ContactSubmissionState> {
  const verification = await checkBotId({
    advancedOptions: {
      checkLevel: "basic",
    },
  });

  if (verification.isBot) {
    return {
      success: false,
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
    };
  }

  const honeypot = honeypotSchema.safeParse({
    projectMilestone: formData.get("projectMilestone") ?? "",
  });

  if (!honeypot.success) {
    return {
      success: false,
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
    };
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message || "Invalid input.",
      status: "error",
    };
  }

  const { name, email, subject, message } = result.data;

  // Sanitize for HTML email template to prevent XSS
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || "");
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  try {
    await resend.emails.send({
      from: "Contact Form <contact@andersonjoseph.com>",
      to: [env.CONTACT_EMAIL ?? "josanderson25@gmail.com"],
      subject: safeSubject,
      replyTo: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${safeName}</p>
        <p><b>Email:</b> ${safeEmail}</p>
        <p><b>Subject:</b> ${safeSubject}</p>
        <p><b>Message:</b><br/>${safeMessage}</p>
      `,
    });
    return {
      success: true,
      message: "Message sent! I'll get back to you soon.",
      status: "success",
    };
  } catch (_error) {
    return {
      success: false,
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
    };
  }
}
