"use client";

import type { ReactNode } from "react";

/**
 * Renders the small Markdown subset the tutor writes: fenced code blocks,
 * inline `code`, **bold**, bullet and numbered lists, and paragraphs.
 * Everything becomes React elements, so model output is never parsed as HTML.
 * Keys are character offsets into the reply, which stay stable while it streams.
 */

/** Fences only open and close at the start of a line, so "```" inside code is kept. */
const FENCE =
  /^ {0,3}```[^\n]*(?:\n|(?![\s\S]))(?<code>[\s\S]*?)(?:^ {0,3}```[ \t]*$|(?![\s\S]))/gmu;

const INLINE = /(?<token>`[^`\n]+`|\*\*[^*\n]+\*\*)/gu;
const BULLET = /^\s*[-*]\s+/u;
const NUMBERED = /^\s*\d+[.)]\s+/u;
const BLANK_LINES = /\n{2,}/u;
const TRAILING_NEWLINE = /\n$/u;

interface Segment {
  text: string;
  offset: number;
}

/** Split `text` on `separator`, keeping each piece's offset in the original. */
const splitWithOffsets = (
  text: string,
  separator: RegExp,
  base: number
): Segment[] => {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const piece of text.split(separator)) {
    const offset = text.indexOf(piece, cursor);

    if (piece.trim()) {
      segments.push({ offset: base + offset, text: piece });
    }

    cursor = offset + piece.length;
  }

  return segments;
};

const inline = (text: string, base: number): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE)) {
    const start = match.index ?? 0;
    const token = match.groups?.token ?? "";
    nodes.push(text.slice(cursor, start));

    if (token.startsWith("`")) {
      nodes.push(
        <code
          className="bg-muted/60 rounded-[3px] px-1 py-px font-mono text-[0.9em]"
          key={base + start}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(
        <strong className="text-primary font-semibold" key={base + start}>
          {token.slice(2, -2)}
        </strong>
      );
    }

    cursor = start + token.length;
  }

  nodes.push(text.slice(cursor));

  return nodes;
};

const list = (lines: Segment[], marker: RegExp, ordered: boolean) => {
  const items = lines.map((line) => (
    <li key={line.offset}>
      {inline(line.text.replace(marker, ""), line.offset)}
    </li>
  ));

  return ordered ? (
    <ol className="list-decimal space-y-1 pl-5" key={lines[0]?.offset}>
      {items}
    </ol>
  ) : (
    <ul className="list-disc space-y-1 pl-5" key={lines[0]?.offset}>
      {items}
    </ul>
  );
};

const prose = (text: string, base: number): ReactNode[] =>
  splitWithOffsets(text, BLANK_LINES, base).map((block) => {
    const lines = splitWithOffsets(block.text, /\n/u, block.offset);

    if (lines.every((line) => BULLET.test(line.text))) {
      return list(lines, BULLET, false);
    }

    if (lines.every((line) => NUMBERED.test(line.text))) {
      return list(lines, NUMBERED, true);
    }

    return (
      <p key={block.offset}>
        {inline(lines.map((line) => line.text).join("\n"), block.offset)}
      </p>
    );
  });

export const ReplyText = ({ text }: { text: string }) => {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(FENCE)) {
    const start = match.index ?? 0;
    const code = (match.groups?.code ?? "").replace(TRAILING_NEWLINE, "");

    nodes.push(
      ...prose(text.slice(cursor, start), cursor),
      <pre
        className="border-subtle bg-secondary overflow-x-auto rounded-sm border px-4 py-3 font-mono text-[0.85em] leading-relaxed"
        key={`code-${start}`}
      >
        <code>{code}</code>
      </pre>
    );

    cursor = start + match[0].length;
  }

  nodes.push(...prose(text.slice(cursor), cursor));

  return <div className="space-y-3 whitespace-pre-wrap">{nodes}</div>;
};
