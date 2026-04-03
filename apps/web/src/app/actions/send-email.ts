"use server";

import { checkBotId } from "botid/server";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);
const BLOCKED_SUBMISSION_MESSAGE =
  "We couldn't send your message. Please try again later.";
const MIN_SUBMISSION_AGE_MS = 3000;
const WORD_REGEX = /[A-Za-z]+(?:['-][A-Za-z]+)*/g;
const VOWEL_REGEX = /[aeiouy]/;
const CONSONANT_CLUSTER_REGEX = /[bcdfghjklmnpqrstvwxyz]{5,}/;
const WHITESPACE_REGEX = /\s/;
const SENTENCE_PUNCTUATION_REGEX = /[.!?,]/;

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

const submissionMetadataSchema = z.object({
  website: z.string().trim().max(0).default(""),
  submittedAt: z.coerce.number().int().positive(),
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

function extractWords(text: string): string[] {
  return text.match(WORD_REGEX) ?? [];
}

function isReadableWord(word: string): boolean {
  const normalized = word.toLowerCase();

  return (
    normalized.length >= 2 &&
    VOWEL_REGEX.test(normalized) &&
    !CONSONANT_CLUSTER_REGEX.test(normalized)
  );
}

function isSuspiciousSubmission({
  name,
  subject,
  message,
}: {
  name: string;
  subject?: string;
  message: string;
}): boolean {
  const readableNameWords = extractWords(name).filter(isReadableWord);
  const readableMessageWords = extractWords(message).filter(isReadableWord);
  const trimmedSubject = subject?.trim() ?? "";
  const trimmedMessage = message.trim();

  if (readableNameWords.length === 0 || readableMessageWords.length === 0) {
    return true;
  }

  if (
    !WHITESPACE_REGEX.test(trimmedMessage) &&
    trimmedMessage.length >= 14 &&
    !SENTENCE_PUNCTUATION_REGEX.test(trimmedMessage)
  ) {
    return true;
  }

  return (
    Boolean(trimmedSubject) &&
    !WHITESPACE_REGEX.test(trimmedSubject) &&
    trimmedSubject.length >= 10 &&
    !WHITESPACE_REGEX.test(trimmedMessage) &&
    trimmedMessage.length >= 10
  );
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

  const metadata = submissionMetadataSchema.safeParse({
    website: formData.get("website") ?? "",
    submittedAt: formData.get("submittedAt") ?? "",
  });

  if (!metadata.success) {
    return {
      success: false,
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
    };
  }

  const submissionAgeMs = Date.now() - metadata.data.submittedAt;

  if (submissionAgeMs < MIN_SUBMISSION_AGE_MS) {
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

  if (isSuspiciousSubmission({ name, subject, message })) {
    return {
      success: false,
      message: BLOCKED_SUBMISSION_MESSAGE,
      status: "error",
    };
  }

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
