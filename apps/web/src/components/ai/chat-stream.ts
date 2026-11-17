export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  failed?: boolean;
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

/** The student-visible error text for a failed request. */
export const failureText = async (response: Response): Promise<string> => {
  const body = await response.text();
  const message = body.trim();

  return message || "Something went wrong. Try again in a moment.";
};
