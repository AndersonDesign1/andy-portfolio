import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { checkBotId } from "botid/server";
import { Resend } from "resend";

import { getResendEnv } from "@/lib/env";

const BLOCKED = "We couldn't send your message. Please try again later.";

const escapeHtml = (text: string): string =>
  text.replaceAll(/[&<>"']/gu, (character) => {
    switch (character) {
      case '"': {
        return "&quot;";
      }
      case "&": {
        return "&amp;";
      }
      case "'": {
        return "&#039;";
      }
      case "<": {
        return "&lt;";
      }
      case ">": {
        return "&gt;";
      }
      default: {
        return character;
      }
    }
  });

export const server = {
  sendEmail: defineAction({
    accept: "form",
    handler: async (input, context) => {
      if (input.projectMilestone) {
        throw new ActionError({ code: "BAD_REQUEST", message: BLOCKED });
      }

      const hasBotIdHeader = Boolean(context.request.headers.get("x-is-human"));

      if (hasBotIdHeader) {
        try {
          const verification = await checkBotId({
            advancedOptions: { checkLevel: "basic" },
          });
          if (verification.isBot) {
            throw new ActionError({ code: "FORBIDDEN", message: BLOCKED });
          }
        } catch (error) {
          if (error instanceof ActionError) {
            throw error;
          }
          // BotID unavailable — continue with honeypot only.
        }
      }

      const { CONTACT_EMAIL, RESEND_API_KEY } = getResendEnv();
      const resend = new Resend(RESEND_API_KEY);
      const to = CONTACT_EMAIL ?? "josanderson25@gmail.com";
      const subject = input.subject || "New Contact Form Submission";

      await resend.emails.send({
        from: "Contact Form <contact@andersonjoseph.com>",
        html: `
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${escapeHtml(input.name)}</p>
          <p><b>Email:</b> ${escapeHtml(input.email)}</p>
          <p><b>Subject:</b> ${escapeHtml(subject)}</p>
          <p><b>Message:</b><br/>${escapeHtml(input.message).replaceAll("\n", "<br/>")}</p>
        `,
        replyTo: input.email,
        subject: escapeHtml(subject),
        to: [to],
      });

      return {
        message: "Message sent! I'll get back to you soon.",
        ok: true as const,
      };
    },
    input: z.object({
      email: z.email(),
      message: z.string().min(1).max(5000),
      name: z.string().min(1).max(100),
      projectMilestone: z.string().optional(),
      subject: z.string().max(200).optional(),
    }),
  }),
};
