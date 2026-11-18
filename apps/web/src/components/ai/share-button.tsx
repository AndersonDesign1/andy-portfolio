"use client";

import {
  Cancel01Icon,
  Copy01Icon,
  Share08Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { number, object, optional, string } from "zod/mini";

import { sharePairs } from "@/components/ai/chat-storage";
import { failureText } from "@/components/ai/chat-stream";
import type { ChatMessage } from "@/components/ai/chat-stream";

type ShareState =
  | { type: "idle" }
  | { type: "creating" }
  | { type: "ready"; url: string; hours: number }
  | { type: "error"; message: string };

const ROW_BUTTON =
  "text-muted hover:text-primary hover:bg-secondary/60 inline-flex min-h-11 items-center gap-1.5 rounded-sm px-2.5 text-xs transition-colors disabled:opacity-40 sm:min-h-8";

const linkSchema = object({
  expiresInHours: optional(number()),
  url: string(),
});

/** The link from /api/tutor/share. */
const readLink = async (response: Response) => {
  const data = linkSchema.parse(await response.json());

  return { hours: data.expiresInHours ?? 24, url: data.url };
};

/** The phone's (or OS's) share menu is available. */
const canNativeShare = () => "share" in navigator;

/**
 * "Share" under the latest answer: saves the chat as a link that lasts a day,
 * then shows it in a small sheet to copy or hand to the phone's share menu.
 * (Copy and share need a fresh tap: browsers block them after a network wait.)
 */
export const ShareButton = ({
  messages,
  busy,
}: {
  messages: ChatMessage[];
  busy: boolean;
}) => {
  const [state, setState] = useState<ShareState>({ type: "idle" });
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  /** The link already made for this exact chat, so sharing twice reuses it. */
  const made = useRef<{ key: string; url: string; hours: number }>(null);
  const pairs = sharePairs(messages);
  const key = JSON.stringify(pairs);
  const open = state.type === "ready" || state.type === "error";

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = setTimeout(() => setCopied(false), 1500);

    return () => clearTimeout(timer);
  }, [copied]);

  const share = async () => {
    if (made.current?.key === key) {
      setState({ ...made.current, type: "ready" });

      return;
    }

    setState({ type: "creating" });

    try {
      const response = await fetch("/api/tutor/share", {
        body: JSON.stringify({ messages: pairs }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        setState({ message: await failureText(response), type: "error" });

        return;
      }

      const link = await readLink(response);
      made.current = { key, ...link };
      setState({ ...link, type: "ready" });
    } catch {
      setState({
        message: "Couldn't create a link. Check your connection and try again.",
        type: "error",
      });
    }
  };

  const close = () => setState({ type: "idle" });

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked: the link is selectable in the field.
    }
  };

  const nativeShare = async (url: string) => {
    try {
      await navigator.share({ title: "A chat with Andy's AI", url });
      close();
    } catch {
      // Dismissed, or not allowed: the sheet stays open with Copy.
    }
  };

  return (
    <>
      <button
        className={ROW_BUTTON}
        disabled={busy || pairs.length === 0 || state.type === "creating"}
        onClick={share}
        type="button"
      >
        <HugeiconsIcon icon={Share08Icon} size={14} />
        {state.type === "creating" ? "Creating link…" : "Share"}
      </button>

      <dialog
        aria-labelledby="ai-share-title"
        className="bg-background text-primary border-subtle fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-lg border p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[26rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg"
        onClose={close}
        ref={dialogRef}
      >
        <div className="flex flex-col gap-4 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <header className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold" id="ai-share-title">
              {state.type === "error" ? "Couldn't share" : "Share this chat"}
            </h2>
            <button
              aria-label="Close"
              className="text-muted hover:text-primary hover:bg-secondary -mr-2 inline-flex size-11 items-center justify-center rounded-sm transition-colors sm:size-9"
              onClick={close}
              type="button"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </button>
          </header>

          {state.type === "error" && (
            <p className="text-secondary text-sm">{state.message}</p>
          )}

          {state.type === "ready" && (
            <>
              <p className="text-secondary text-sm">
                Anyone with the link can read this chat and carry it on. It
                stops working in {state.hours} hours.
              </p>
              <input
                aria-label="Share link"
                className="border-subtle bg-secondary text-primary w-full rounded-sm border px-3 py-2.5 text-sm"
                onFocus={(event) => event.currentTarget.select()}
                readOnly
                value={state.url}
              />
              <div className="flex gap-2">
                <button
                  className="border-foreground/20 hover:bg-muted inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-colors"
                  onClick={() => copy(state.url)}
                  type="button"
                >
                  <HugeiconsIcon
                    icon={copied ? Tick02Icon : Copy01Icon}
                    size={16}
                  />
                  {copied ? "Copied" : "Copy link"}
                </button>
                {canNativeShare() && (
                  <button
                    className="bg-foreground text-background inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium"
                    onClick={() => nativeShare(state.url)}
                    type="button"
                  >
                    <HugeiconsIcon icon={Share08Icon} size={16} />
                    Share…
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
};
