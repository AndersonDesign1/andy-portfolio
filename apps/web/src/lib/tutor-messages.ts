import { z } from "zod";

export const MAX_MESSAGE_CHARS = 2000;

/** Tutor replies are capped at 1,500 output tokens; this leaves room for code-heavy answers. */
export const MAX_REPLY_CHARS = 12_000;

/** One text message from the /ai page, trimmed. */
export const chatMessageSchema = z.discriminatedUnion("role", [
  z.strictObject({
    content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
    role: z.literal("user"),
  }),
  z.strictObject({
    content: z.string().trim().min(1).max(MAX_REPLY_CHARS),
    role: z.literal("assistant"),
  }),
]);

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
