export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  failed?: boolean;
  /** Cut off by Stop: shown, but not sent back as history. */
  stopped?: boolean;
}

export type ChatStatus = "idle" | "thinking" | "answering";

/** Reads a streamed plain-text reply, calling `onText` with the text so far. */
export const readStream = (
  body: ReadableStream<Uint8Array>,
  onText: (text: string) => void
): Promise<string> => {
  const reader = body.getReader();
  const decoder = new TextDecoder();

  // Chunks arrive in order, so each read waits for the previous one.
  const pump = async (text: string): Promise<string> => {
    const chunk = await reader.read();

    if (chunk.done) {
      const final = text + decoder.decode();

      if (final !== text) {
        onText(final);
      }

      return final;
    }

    const next = text + decoder.decode(chunk.value, { stream: true });
    onText(next);

    return pump(next);
  };

  return pump("");
};

const GENERIC_FAILURE =
  "Andy's AI couldn't answer just now. Try again in a moment.";

/**
 * The visitor-facing error text for a failed request. Only the API's own
 * plain-text messages are shown; an HTML error page (or anything else) never is.
 */
export const failureText = async (response: Response): Promise<string> => {
  const type = response.headers.get("content-type") ?? "";

  if (!type.startsWith("text/plain")) {
    return GENERIC_FAILURE;
  }

  const body = await response.text();
  const message = body.trim();

  return message && message.length <= 300 ? message : GENERIC_FAILURE;
};
