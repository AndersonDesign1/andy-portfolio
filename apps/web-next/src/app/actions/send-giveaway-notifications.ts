"use server";

import { Resend } from "resend";
// import giveawayData from "@/data/giveaway-results.json";
import { GiveawayConsolationEmail } from "@/emails/giveaway-consolation";
import { GiveawayWinnerEmail } from "@/emails/giveaway-winner";
import { getResendEnv } from "@/lib/env";

const getResend = () => new Resend(getResendEnv().RESEND_API_KEY);

interface Participant {
  category: string;
  email: string;
  name: string;
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
    const resend = getResend();
    if (testEmail) {
      // Send one of each to the test email
      await resend.emails.send({
        from: "Anderson Joseph <contact@andersonjoseph.com>",
        react: GiveawayWinnerEmail({ name: "Tester" }),
        subject: "TEST: You won my giveaway!",
        to: [testEmail],
      });

      await resend.emails.send({
        from: "Anderson Joseph <contact@andersonjoseph.com>",
        react: GiveawayConsolationEmail({ name: "Tester" }),
        subject: "Free website giveaway update",
        to: [testEmail],
      });

      return {
        message: `Test emails sent to ${testEmail}`,
        success: true,
      };
    }

    // Batch send winners
    const winnerRequests = winners.map((winner) => ({
      from: "Anderson Joseph <contact@andersonjoseph.com>",
      react: GiveawayWinnerEmail({ name: winner.name }),
      subject: "You won my giveaway! 🎉",
      to: [winner.email],
    }));

    // Batch send consolation
    const consolationRequests = consolation.map((p) => ({
      from: "Anderson Joseph <contact@andersonjoseph.com>",
      react: GiveawayConsolationEmail({ name: p.name }),
      subject: "Free website giveaway update",
      to: [p.email],
    }));

    if (winnerRequests.length > 0) {
      await resend.batch.send(winnerRequests);
    }

    if (consolationRequests.length > 0) {
      await resend.batch.send(consolationRequests);
    }

    return {
      message: "All notifications sent successfully!",
      stats: {
        consolation: consolationRequests.length,
        winners: winnerRequests.length,
      },
      success: true,
    };
  } catch (error) {
    console.error("Failed to send notifications:", error);
    return {
      message: "Failed to send notifications. Check server logs.",
      success: false,
    };
  }
}
