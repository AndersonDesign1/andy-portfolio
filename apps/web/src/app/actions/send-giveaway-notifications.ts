"use server";

import { Resend } from "resend";
// import giveawayData from "@/data/giveaway-results.json";
import { GiveawayConsolationEmail } from "@/emails/giveaway-consolation";
import { GiveawayWinnerEmail } from "@/emails/giveaway-winner";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

interface Participant {
  name: string;
  email: string;
  category: string;
}

export async function sendGiveawayNotifications(testEmail?: string): Promise<{
  success: boolean;
  message: string;
  stats?: { winners: number; consolation: number };
}> {
  // giveawayData is currently removed. To use this action, restore giveaway-results.json
  // or provide an alternative data source.
  const participants: Participant[] = []; 

  const winners = participants.filter((p) => p.category !== "Disqualified");
  const consolation = participants.filter((p) => p.category === "Disqualified");

  try {
    if (testEmail) {
      // Send one of each to the test email
      await resend.emails.send({
        from: "Anderson Joseph <hello@andersonjoseph.com>",
        to: [testEmail],
        subject: "TEST: You won my giveaway!",
        react: GiveawayWinnerEmail({ name: "Tester" }),
      });

      await resend.emails.send({
        from: "Anderson Joseph <hello@andersonjoseph.com>",
        to: [testEmail],
        subject: "Free website giveaway update",
        react: GiveawayConsolationEmail({ name: "Tester" }),
      });

      return {
        success: true,
        message: `Test emails sent to ${testEmail}`,
      };
    }

    // Batch send winners
    const winnerRequests = winners.map((winner) => ({
      from: "Anderson Joseph <hello@andersonjoseph.com>",
      to: [winner.email],
      subject: "You won my giveaway! 🎉",
      react: GiveawayWinnerEmail({ name: winner.name }),
    }));

    // Batch send consolation
    const consolationRequests = consolation.map((p) => ({
      from: "Anderson Joseph <hello@andersonjoseph.com>",
      to: [p.email],
      subject: "Free website giveaway update",
      react: GiveawayConsolationEmail({ name: p.name }),
    }));

    if (winnerRequests.length > 0) {
      await resend.batch.send(winnerRequests);
    }

    if (consolationRequests.length > 0) {
      await resend.batch.send(consolationRequests);
    }

    return {
      success: true,
      message: "All notifications sent successfully!",
      stats: {
        winners: winnerRequests.length,
        consolation: consolationRequests.length,
      },
    };
  } catch (error) {
    console.error("Failed to send notifications:", error);
    return {
      success: false,
      message: "Failed to send notifications. Check server logs.",
    };
  }
}
