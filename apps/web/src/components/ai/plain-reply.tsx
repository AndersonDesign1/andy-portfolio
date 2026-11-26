"use client";

/** A reply as plain text: shown while the renderer loads, or if it can't. */
export const PlainReply = ({ text }: { text: string; streaming?: boolean }) => (
  <p className="whitespace-pre-wrap">{text}</p>
);
