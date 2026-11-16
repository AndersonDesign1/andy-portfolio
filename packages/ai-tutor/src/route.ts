import type { ModelMessage } from "ai";

const ASSIGNMENT_WORDS =
  /\b(assignment|homework|hw|graded|due (today|tomorrow|tonight)|deadline)\b/i;

const CODE_LINE =
  /[;{}]\s*$|=>|\b(function|const|let|var|return|if|for|while|class|import|console\.log)\b/;

function textOf(message: ModelMessage): string {
  if (!Array.isArray(message.content)) {
    return message.content;
  }

  return message.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("\n");
}

/** True when the text looks like pasted code: a fenced block or two or more code-like lines. */
export function looksLikeCode(text: string): boolean {
  if (text.includes("```")) {
    return true;
  }

  return text.split("\n").filter((line) => CODE_LINE.test(line)).length >= 2;
}

/**
 * "homework" when the latest student message pastes code or talks about graded work.
 * Those go to the models that best kept the no-full-solutions rule in testing.
 */
export function classifyRequest(
  messages: ModelMessage[]
): "general" | "homework" {
  const lastUser = messages.findLast((m) => m.role === "user");

  if (!lastUser) {
    return "general";
  }

  const text = textOf(lastUser);

  return looksLikeCode(text) || ASSIGNMENT_WORDS.test(text)
    ? "homework"
    : "general";
}
