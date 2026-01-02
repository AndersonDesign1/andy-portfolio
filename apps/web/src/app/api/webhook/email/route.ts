import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailReceivedEvent {
  type: "email.received";
  created_at: string;
  data: {
    email_id: string;
    created_at: string;
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    message_id: string;
    attachments: Array<{
      id: string;
      filename: string;
      content_type: string;
      content_disposition: string;
      content_id?: string;
    }>;
  };
}

interface AttachmentWithUrl {
  filename: string;
  download_url: string;
}

// Helper: Fetch and download attachments
async function fetchAttachments(
  emailId: string
): Promise<Array<{ filename: string; content: string }>> {
  const attachments: Array<{ filename: string; content: string }> = [];

  const { data: attachmentsResponse } =
    await resend.emails.receiving.attachments.list({ emailId });

  if (!attachmentsResponse?.data?.length) {
    return attachments;
  }

  for (const attachment of attachmentsResponse.data as AttachmentWithUrl[]) {
    try {
      const response = await fetch(attachment.download_url);
      const buffer = Buffer.from(await response.arrayBuffer());
      attachments.push({
        filename: attachment.filename,
        content: buffer.toString("base64"),
      });
    } catch {
      // Silently skip failed attachment downloads
    }
  }

  return attachments;
}

// Helper: Build forwarded email HTML
function buildForwardedHtml(
  from: string,
  to: string[],
  subject: string,
  html?: string,
  text?: string
): string {
  const content = html || text?.replace(/\n/g, "<br/>") || "No content";
  return `
    <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
      <p style="margin: 0 0 10px 0;"><strong>Original From:</strong> ${from}</p>
      <p style="margin: 0 0 10px 0;"><strong>Original To:</strong> ${to.join(", ")}</p>
      <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
    </div>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
    ${content}
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature (if secret is configured)
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
      const svixId = request.headers.get("svix-id");
      const svixTimestamp = request.headers.get("svix-timestamp");
      const svixSignature = request.headers.get("svix-signature");

      if (!(svixId && svixTimestamp && svixSignature)) {
        return NextResponse.json(
          { error: "Missing signature headers" },
          { status: 401 }
        );
      }

      try {
        resend.webhooks.verify({
          payload: body,
          headers: {
            id: svixId,
            timestamp: svixTimestamp,
            signature: svixSignature,
          },
          webhookSecret,
        });
      } catch {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(body) as EmailReceivedEvent;

    if (event.type !== "email.received") {
      return NextResponse.json({ message: "Event type not handled" });
    }

    const { email_id, from, subject, to } = event.data;

    // Fetch email content using Resend SDK
    const { data: email, error: emailError } =
      await resend.emails.receiving.get(email_id);

    if (emailError || !email) {
      return NextResponse.json(
        { error: "Failed to fetch email" },
        { status: 500 }
      );
    }

    // Fetch attachments
    const attachments = await fetchAttachments(email_id);

    // Forward the email
    const { error } = await resend.emails.send({
      from: "hello@andersonjoseph.com",
      to: ["josanderson25@gmail.com"],
      subject: `[Forwarded] ${subject}`,
      html: buildForwardedHtml(
        from,
        to,
        subject,
        email.html ?? undefined,
        email.text ?? undefined
      ),
      text: `From: ${from}\nTo: ${to.join(", ")}\nSubject: ${subject}\n\n${email.text || "No content"}`,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to forward" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ status: "Email webhook active" });
}
