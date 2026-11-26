"use client";

import { useEffect } from "react";

import { PlainReply } from "@/components/ai/plain-reply";

/**
 * The Markdown renderer (Streamdown + Shiki) is ~140 KB gzipped, so it loads
 * after the page (see `preloadReplyRenderer`) instead of with it. If its
 * chunk fails to load (offline, blocked), replies stay plain text instead of
 * the error taking down the page.
 */
export const loadReplyText = async () => {
  try {
    const module = await import("@/components/ai/reply-text");

    return { default: module.ReplyText };
  } catch {
    return { default: PlainReply };
  }
};

/** Starts fetching the renderer early (on idle) so the first reply is formatted. */
const preloadReplyRenderer = () => {
  loadReplyText();
};

/**
 * Fetches the reply renderer once the page is idle, before the first answer.
 * (Older Safari has no requestIdleCallback; a short timeout stands in.)
 */
export const usePreloadReplyRenderer = () => {
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const handle = requestIdleCallback(preloadReplyRenderer, {
        timeout: 4000,
      });

      return () => cancelIdleCallback(handle);
    }

    const timer = setTimeout(preloadReplyRenderer, 1500);

    return () => clearTimeout(timer);
  }, []);
};
