import type { ModelMessage } from "ai";

const ASSIGNMENT_WORDS =
  /\b(assignment|homework|hw|graded|due (today|tomorrow|tonight)|deadline)\b/i;

/**
 * Syntax that only appears in code, so prose that happens to use words like
 * "if", "for" or "return" is not mistaken for a pasted snippet. Covers
 * brace-style languages (JavaScript, Java, C) and indentation-style ones
 * (Python), since the course language is configurable:
 * - a line ending in `;`, `{` or `}`, or containing `=>`
 * - a declaration or control statement with its syntax:
 *   `const x =`, `function f(`, `if (`, `def f(`, `class Name`
 * - a lowercase control line ending in a colon: `for i in range(3):`, `else:`
 * - an indented `return`, `yield`, `break`, `continue`, `pass` or `raise` line
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
  /^\s*(?:if|elif|else|for|while|try|except|finally|with)\b[^:]*:\s*$/,
  /^\s+(?:return|yield|break|continue|pass|raise)\b/,
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

/** An image or file part, e.g. a screenshot of code that the text checks can't read. */
function hasMedia(message: ModelMessage): boolean {
  return (
    Array.isArray(message.content) &&
    message.content.some(
      (part) => part.type === "image" || part.type === "file"
    )
  );
}

/**
 * How many of the student's most recent messages decide the route. A homework
 * chat stays on the homework route for follow-ups like "what does handle
 * errors mean?", which carry no code or assignment words of their own.
 */
const HOMEWORK_MEMORY_TURNS = 3;

/** Code, an attachment (likely a screenshot of code), or talk of graded work. */
function isHomeworkTurn(message: ModelMessage): boolean {
  if (hasMedia(message)) {
    return true;
  }

  const text = textOf(message);

  return looksLikeCode(text) || ASSIGNMENT_WORDS.test(text);
}

/**
 * "homework" when any of the student's last few messages pastes code, attaches
 * an image or file, or talks about graded work, so follow-ups in the same chat
 * keep the route. Those go to the models that best kept the no-full-solutions
 * rule in testing. The tutor itself rejects media before calling a model; the
 * media check keeps the classifier safe for callers that use it on its own.
 */
export function classifyRequest(
  messages: ModelMessage[]
): "general" | "homework" {
  const recentStudentTurns = messages
    .filter((m) => m.role === "user")
    .slice(-HOMEWORK_MEMORY_TURNS);

  return recentStudentTurns.some(isHomeworkTurn) ? "homework" : "general";
}
