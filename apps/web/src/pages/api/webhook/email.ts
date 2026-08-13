export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

export const GET: APIRoute = async () =>
  json({ status: "Email webhook active" });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!(apiKey && webhookSecret)) {
    return json(
      { error: "Missing RESEND_API_KEY or RESEND_WEBHOOK_SECRET" },
      500
    );
  }

  if (!contactEmail) {
    return json({ error: "Missing CONTACT_EMAIL" }, 500);
  }

  const payload = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!(svixId && svixTimestamp && svixSignature)) {
    return json({ error: "Missing signature headers" }, 401);
  }

  const resend = new Resend(apiKey);

  try {
    resend.webhooks.verify({
      headers: {
        id: svixId,
        signature: svixSignature,
        timestamp: svixTimestamp,
      },
      payload,
      webhookSecret,
    });
  } catch {
    return json({ error: "Invalid signature" }, 401);
  }

  let event: {
    data?: {
      email_id?: string;
      from?: string;
      to?: string[];
      subject?: string;
    };
    type?: string;
  };

  try {
    event = JSON.parse(payload) as typeof event;
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  if (event.type !== "email.received") {
    return json({ ignored: true });
  }

  const { from, to, subject, email_id } = event.data ?? {};
  if (!email_id) {
    return json({ error: "Missing email_id" }, 400);
  }

  try {
    const { data: received } = await resend.emails.receiving.get(email_id);
    await resend.emails.send({
      from: "Inbox Forward <contact@andersonjoseph.com>",
      html: `<p><b>From:</b> ${from}<br/><b>To:</b> ${(to || []).join(", ")}</p><hr/>${received?.html || received?.text || ""}`,
      subject: `Fwd: ${subject || "(no subject)"}`,
      to: [contactEmail],
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "fail" },
      500
    );
  }

  return json({ ok: true });
};
