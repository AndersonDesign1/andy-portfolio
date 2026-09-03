"use server";

import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

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

const WORD_COUNT_REGEX = /\s+/;

const feedbackSchema = z.object({
  benefits: z
    .string()
    .min(5, "Please tell me how this helps you")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 30;
    }, "Please provide at least 30 words about the benefits."),
  brandDescription: z
    .string()
    .min(10, "Please provide a bit more detail (at least 10 characters)")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 80;
    }, "Please provide at least 80 words about your brand/project so I can understand it fully."),
  domainStatus: z
    .enum(["yes", "no", "need_help"])
    .optional()
    .refine((val) => !!val, {
      message: "Please select an option",
    }),
  email: z.email("Invalid email address"),
  features: z.string().min(5, "Please list at least one feature"),
  name: z.string().optional(),
});

export async function submitGiveawayFeedback(formData: FormData) {
  const rawData = {
    benefits: formData.get("benefits"),
    brandDescription: formData.get("brandDescription"),
    domainStatus: formData.get("domainStatus"),
    email: formData.get("email"),
    features: formData.get("features"),
    name: formData.get("name"),
  };

  const result = feedbackSchema.safeParse(rawData);

  if (!result.success) {
    return {
      message: result.error.issues[0]?.message || "Invalid input",
      success: false,
    };
  }

  const { name, email, brandDescription, features, domainStatus, benefits } =
    result.data;

  // Sanitize all user inputs to prevent XSS
  const safeName = name ? escapeHtml(name) : "N/A";
  const safeEmail = escapeHtml(email);
  const safeBrandDescription = escapeHtml(brandDescription).replace(
    /\n/g,
    "<br/>"
  );
  const safeFeatures = escapeHtml(features).replace(/\n/g, "<br/>");
  const safeDomainStatus = escapeHtml(domainStatus ?? "");
  const safeBenefits = escapeHtml(benefits).replace(/\n/g, "<br/>");

  try {
    await resend.emails.send({
      from: "Giveaway Feedback <giveaway@andersonjoseph.com>",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>📝 New Feedback Received</h2>
          <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
          
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Brand / Project Description:</strong></p>
            <p style="white-space: pre-wrap;">${safeBrandDescription}</p>
            
            <p><strong>Desired Features:</strong></p>
            <p style="white-space: pre-wrap;">${safeFeatures}</p>
            
            <p><strong>Domain Status:</strong> ${safeDomainStatus}</p>
            
            <p><strong>Expected Benefits:</strong></p>
            <p style="white-space: pre-wrap;">${safeBenefits}</p>
          </div>
        </div>
      `,
      replyTo: email,
      subject: `📝 New Giveaway Feedback from ${safeName === "N/A" ? safeEmail : safeName}`,
      to: ["josanderson25@gmail.com"],
    });

    return {
      message: "Feedback sent successfully! Thank you.",
      success: true,
    };
  } catch (_error) {
    return {
      message: "Something went wrong. Please try again.",
      success: false,
    };
  }
}
