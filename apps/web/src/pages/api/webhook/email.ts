export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ status: "Email webhook active" }), {
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
      status: 500,
    });
  }

  const resend = new Resend(apiKey);
  const payload = await request.json().catch(() => null);
  if (payload?.type !== "email.received") {
    return new Response(JSON.stringify({ ignored: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { from, to, subject, email_id } = payload.data ?? {};
  try {
    const { data: received } = await resend.emails.receiving.get(email_id);
    await resend.emails.send({
      from: "Inbox Forward <contact@andersonjoseph.com>",
      html: `<p><b>From:</b> ${from}<br/><b>To:</b> ${(to || []).join(", ")}</p><hr/>${received?.html || received?.text || ""}`,
      subject: `Fwd: ${subject || "(no subject)"}`,
      to: [process.env.CONTACT_EMAIL ?? "josanderson25@gmail.com"],
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "fail",
      }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
