"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, message: "All fields are required." };
  }

  try {
    await resend.emails.send({
      from: "Contact Form <contact@andersonjoseph.com>", // must be a verified sender/domain
      to: ["hello@andersonjoseph.com"], // your receiving email
      subject: subject || "New Contact Form Submission",
      replyTo: email, // <-- correct property for Resend
      html: `
        <h2>New Contact Form Submission</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });
    return {
      success: true,
      message: "Message sent! I'll get back to you soon.",
    };
  } catch (error) {
    // Optionally log the error for debugging
    console.error("Resend error:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
