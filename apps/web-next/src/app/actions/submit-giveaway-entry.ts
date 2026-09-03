"use server";

import { Resend } from "resend";
import { z } from "zod";
import GiveawayFeedback from "@/emails/giveaway-feedback";
import { getResendEnv } from "@/lib/env";

const getResend = () => new Resend(getResendEnv().RESEND_API_KEY);

const WORD_COUNT_REGEX = /\s+/;

const entrySchema = z.object({
  description: z
    .string()
    .min(1, "Please tell me about your project")
    .refine((val) => {
      const wordCount = val.trim().split(WORD_COUNT_REGEX).length;
      return wordCount >= 30;
    }, "Please provide at least 30 words about your project")
    .refine((val) => val.length <= 5000, "Description is too long"),
  email: z.email("Invalid email address"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100),
  projectName: z.string().max(200).optional(),
  websiteType: z.string().min(1, "Please select a website type"),
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

const websiteTypeLabels: Record<string, string> = {
  blog: "Personal Blog",
  business: "Business Website",
  landing: "Landing Page",
  other: "Other",
  portfolio: "Portfolio",
};

export async function submitGiveawayEntry(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const rawData = {
    description: formData.get("description"),
    email: formData.get("email"),
    name: formData.get("name"),
    projectName: formData.get("projectName") || undefined,
    websiteType: formData.get("websiteType"),
  };

  const result = entrySchema.safeParse(rawData);

  if (!result.success) {
    return {
      message: result.error.issues[0]?.message || "Invalid input.",
      success: false,
    };
  }

  const { name, email, websiteType, projectName, description } = result.data;

  // Sanitize for HTML email template
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeWebsiteType =
    websiteTypeLabels[websiteType] || escapeHtml(websiteType);
  const safeProjectName = projectName
    ? escapeHtml(projectName)
    : "Not provided";
  const safeDescription = escapeHtml(description).replace(/\n/g, "<br/>");

  try {
    const resend = getResend();
    // Send notification to you
    await resend.emails.send({
      from: "Giveaway <giveaway@andersonjoseph.com>",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 16px;">
            🎁 New Giveaway Entry
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 12px;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 0 0 12px;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 0 0 12px;"><strong>Website Type:</strong> ${safeWebsiteType}</p>
            <p style="margin: 0;"><strong>Project/Business Name:</strong> ${safeProjectName}</p>
          </div>
          
          <div style="margin-top: 24px;">
            <h3 style="color: #1a1a1a;">Project Description</h3>
            <div style="background: #fff; border: 1px solid #e5e5e5; padding: 16px; border-radius: 8px;">
              ${safeDescription}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 32px;">
            Reply directly to this email to contact the entrant.
          </p>
        </div>
      `,
      replyTo: email,
      subject: `🎁 New Giveaway Entry: ${safeName}`,
      to: ["josanderson25@gmail.com"],
    });

    // Send confirmation to the entrant
    await resend.emails.send({
      from: "Anderson Joseph <contact@andersonjoseph.com>",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Hey ${safeName}! 👋</h2>
          
          <p style="color: #333; line-height: 1.6;">
            Thank you for entering my website giveaway! Your entry has been received and is now in the running.
          </p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px; color: #1a1a1a;">Your Entry Details</h3>
            <p style="margin: 0 0 8px;"><strong>Website Type:</strong> ${safeWebsiteType}</p>
            <p style="margin: 0;"><strong>Project:</strong> ${safeProjectName}</p>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            I'll review all entries and announce the winner soon. If you're selected, I'll reach out to this email address to get started on your free website!
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            In the meantime, feel free to check out my portfolio at 
            <a href="https://andersonjoseph.com" style="color: #0066cc;">andersonjoseph.com</a>.
          </p>
          
          <p style="color: #333; line-height: 1.6;">
            Good luck! 🍀
          </p>
          
          <p style="color: #333;">
            — Anderson
          </p>
        </div>
      `,
      subject: "Your Giveaway Entry Has Been Received! 🎉",
      to: [email],
    });

    // Send Feedback Request Email
    await resend.emails.send({
      from: "Anderson Joseph <contact@andersonjoseph.com>",
      react: GiveawayFeedback({ name }),
      subject: "One quick thing...",
      to: [email],
    });

    return {
      message:
        "Entry submitted! I'll be in touch if you're selected. Good luck! 🎉",
      success: true,
    };
  } catch (_error) {
    return {
      message: "Failed to submit entry. Please try again later.",
      success: false,
    };
  }
}
