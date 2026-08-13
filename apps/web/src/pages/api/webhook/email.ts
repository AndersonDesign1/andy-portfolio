import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";

export const prerender = false;

const emailEventSchema = z.object({
  data: z
    .object({
      email_id: z.string().optional(),
      from: z.string().optional(),
      subject: z.string().optional(),
      to: z.array(z.string()).optional(),
    })
    .optional(),
  type: z.string().optional(),
});

export const GET: APIRoute = () =>
  Response.json({ status: "Email webhook active" });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!(apiKey && webhookSecret)) {
    return Response.json(
      { error: "Missing RESEND_API_KEY or RESEND_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  if (!contactEmail) {
    return Response.json({ error: "Missing CONTACT_EMAIL" }, { status: 500 });
  }

  const payload = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!(svixId && svixTimestamp && svixSignature)) {
    return Response.json(
      { error: "Missing signature headers" },
      { status: 401 }
    );
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
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payloadData: z.infer<typeof emailEventSchema>;
  try {
    payloadData = emailEventSchema.parse(JSON.parse(payload));
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (payloadData.type !== "email.received") {
    return Response.json({ ignored: true });
  }

  const { from, to, subject, email_id } = payloadData.data ?? {};
  if (!email_id) {
    return Response.json({ error: "Missing email_id" }, { status: 400 });
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
    return Response.json(
      { error: error instanceof Error ? error.message : "fail" },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
};
