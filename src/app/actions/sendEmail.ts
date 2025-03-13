"use server"

import { Resend } from "resend"

/**
 * Interface for the response from the email sending function
 */
interface EmailResponse {
  success: boolean
  message: string
}

/**
 * Initialize Resend client with API key
 */
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Server action to send an email using Resend
 * @param formData - Form data containing name, email, and message
 * @returns Response object with success status and message
 */
export async function sendEmail(formData: FormData): Promise<EmailResponse> {
  console.log("Server action started") // Added logging
  try {
    const name = formData.get("name") as string | null
    const email = formData.get("email") as string | null
    const message = formData.get("message") as string | null

    console.log("Form data received:", { name, email, message }) // Added logging

    // Validate inputs
    if (!name || !email || !message) {
      return {
        success: false,
        message: "All fields are required",
      }
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return {
        success: false,
        message: "Email service is not properly configured",
      }
    }

    console.log("Attempting to send email...") // Added logging
    const data = await resend.emails.send({
      from: "Anderson Joseph <hello@andersonjoseph.com>", // This is the sender
      to: ["hello@andersonjoseph.com"], // Changed to your desired recipient
      replyTo: email, // Changed from reply_to to replyTo
      subject: `Portfolio Contact: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    })

    console.log("Resend response:", data) // Added logging

    if ("error" in data && data.error) {
      console.error("Resend error:", data.error) // Added logging
      return {
        success: false,
        message: data.error.message || "Failed to send email",
      }
    }

    return {
      success: true,
      message: "Email sent successfully!",
    }
  } catch (error: unknown) {
    console.error("Error sending email:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to send email"
    return {
      success: false,
      message: errorMessage,
    }
  }
}

