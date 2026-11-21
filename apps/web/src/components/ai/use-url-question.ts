"use client";

import { useRef, useState, useSyncExternalStore } from "react";

import { MAX_CHARS } from "@/components/ai/chat-limits";

const noSubscribe = () => () => {
  // The address only changes through this hook, so there's nothing to watch.
};

const readQuestion = () =>
  new URLSearchParams(window.location.search)
    .get("q")
    ?.trim()
    .slice(0, MAX_CHARS) || null;

/**
 * A question passed as `?q=` (from the Ask pill on the other pages).
 * `pending` is true when the visit started with one, so the guide can stay
 * closed. `take()` hands it over once, and drops it from the address so a
 * reload doesn't ask it again.
 */
export const useUrlQuestion = () => {
  const fromUrl = useSyncExternalStore(noSubscribe, readQuestion, () => null);
  /** Latched: the address loses ?q= once it's taken. */
  const [question, setQuestion] = useState<string | null>(null);
  const taken = useRef(false);

  if (fromUrl && question === null) {
    setQuestion(fromUrl);
  }

  const take = () => {
    if (taken.current || !question) {
      return null;
    }

    taken.current = true;
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    window.history.replaceState(window.history.state, "", url);

    return question;
  };

  return { pending: question !== null, take };
};
