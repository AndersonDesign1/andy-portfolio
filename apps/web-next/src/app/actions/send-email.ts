"use server";

import { checkBotId } from "botid/server";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);
const BLOCKED_SUBMISSION_MESSAGE =
  "We couldn't send your message. Please try again later.";

export interface ContactSubmissionState {
  message: string;
  status: "idle" | "success" | "error";
  success: boolean;
}

export const INITIAL_CONTACT_SUBMISSION_STATE: ContactSubmissionState = {
  message: "",
  status: "idle",
  success: false,
};

const contactSchema = z.object({
  email: z.email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(5000),
  name: z.string().min(1, "Name is required").max(100),
  subject: z
    .string()
    .max(200)
    .optional()
    .default("New Contact Form Submission"),
});

const honeypotSchema = z.object({
  projectMilestone: z.string().trim().max(0).default(""),
});

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "'": "&#039;",
    '"': "&quot;",
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
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
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
      success: false,
    };
  }

  const honeypot = honeypotSchema.safeParse({
    projectMilestone: formData.get("projectMilestone") ?? "",
  });

  if (!honeypot.success) {
    return {
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
      success: false,
    };
  }

  const rawData = {
    email: formData.get("email"),
    message: formData.get("message"),
    name: formData.get("name"),
    subject: formData.get("subject") || undefined,
  };

  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    return {
      message: result.error.issues[0]?.message || "Invalid input.",
      status: "error",
      success: false,
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
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${safeName}</p>
        <p><b>Email:</b> ${safeEmail}</p>
        <p><b>Subject:</b> ${safeSubject}</p>
        <p><b>Message:</b><br/>${safeMessage}</p>
      `,
      replyTo: email,
      subject: safeSubject,
      to: [env.CONTACT_EMAIL ?? "josanderson25@gmail.com"],
    });
    return {
      message: "Message sent! I'll get back to you soon.",
      status: "success",
      success: true,
    };
  } catch (_error) {
    return {
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
      success: false,
    };
  }
}
