import type { ModelMessage } from "ai";

const ASSIGNMENT_WORDS =
  /\b(assignment|homework|hw|graded|due (today|tomorrow|tonight)|deadline)\b/i;

/**
 * Syntax that only appears in code, so prose that happens to use words like
 * "if", "for" or "return" is not mistaken for a pasted snippet:
 * - a line ending in `;`, `{` or `}`, or containing `=>`
 * - a declaration or control statement with its syntax:
 *   `const x =`, `function f(`, `if (`, `def f(`, `class Name`
 * - an assignment such as `x = 1` or `total += price` (not `==`)
 * - a bare call on its own line, such as `print(x)` or `console.log("hi");`
 */
const CODE_SYNTAX = [
  /[;{}]\s*$|=>/,
  /^\s*(?:const|let|var)\s+[\w$[{]/,
  /^\s*(?:async\s+)?function\b\s*[\w$]*\s*\(/,
  /^\s*(?:if|for|while|switch|catch)\s*\(/,
  /^\s*(?:def|class)\s+[\w$]+/,
  /^\s*(?:import|export)\s+[\w${*"']/,
  /^\s*[\w$.[\]]+\s*[-+*/%]?=(?!=)\s*\S/,
  /^\s*[\w$.]+\([^()]*\)\s*;?\s*$/,
];

function isCodeLine(line: string): boolean {
  return CODE_SYNTAX.some((pattern) => pattern.test(line));
}

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

  return text.split("\n").filter(isCodeLine).length >= 2;
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
