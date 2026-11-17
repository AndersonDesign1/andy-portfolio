"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useStickToBottom } from "use-stick-to-bottom";

import { cn } from "@/lib/utils";

/** Within this many pixels of the end counts as "at the bottom". */
const BOTTOM_SLACK = 24;

/**
 * Shared by both scroll areas. `data-lenis-prevent` hands wheel and trackpad
 * gestures back to the browser: the page's Lenis smooth scroll otherwise
 * swallows them, and a nested scroll area can't be scrolled at all.
 */
const SCROLL_AREA =
  "ai-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain focus-visible:outline-none";

const JumpButton = ({ onClick }: { onClick: () => void }) => (
  <button
    aria-label="Jump to the latest"
    className="border-subtle bg-background/90 text-secondary hover:text-primary absolute bottom-3 left-1/2 inline-flex size-9 -translate-x-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-colors"
    onClick={onClick}
    type="button"
  >
    <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
  </button>
);

/**
 * A scroll area that follows new text as it streams (the AI Elements
 * Conversation behaviour), but lets go as soon as the reader scrolls up, and
 * offers a button back to the latest line. Used for the full history.
 */
export const ScrollToLatest = ({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) => {
  const { contentRef, isAtBottom, scrollRef, scrollToBottom } =
    useStickToBottom({ initial: "instant", resize: "smooth" });

  return (
    <div className={cn("relative flex min-h-0 flex-col", className)}>
      <div className={SCROLL_AREA} data-lenis-prevent ref={scrollRef}>
        <div className={contentClassName} ref={contentRef}>
          {children}
        </div>
      </div>
      {!isAtBottom && <JumpButton onClick={() => scrollToBottom()} />}
    </div>
  );
};

interface Edges {
  above: boolean;
  below: boolean;
}

const NO_EDGES: Edges = { above: false, below: false };

const distanceToEnd = (area: HTMLElement) =>
  area.scrollHeight - area.scrollTop - area.clientHeight;

/** Which edges hide text: drives the fades and the jump button. */
const readEdges = (area: HTMLElement): Edges => ({
  above: area.scrollTop > BOTTOM_SLACK,
  below: distanceToEnd(area) > BOTTOM_SLACK,
});

/** Keeps the current object when nothing changed, so React skips the render. */
const sameEdges = (current: Edges, next: Edges) =>
  current.above === next.above && current.below === next.below ? current : next;

/**
 * The latest answer, read the way ChatGPT and Claude present one: a new
 * question is pinned to the top and the reply streams in below it, so a long
 * answer is read from its first line instead of chased to its last. The view
 * only follows new text once the reader scrolls to the bottom themselves (or
 * presses the jump button). Edge fades show there's more above or below.
 */
export const AnchoredScroll = ({
  anchorKey,
  children,
  className,
  contentClassName,
  label,
}: {
  /** Changes with each new question; the view jumps back to its top. */
  anchorKey: string | number | undefined;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  label: string;
}) => {
  const scrollRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  /** The reader parked at the bottom, so new text should keep it in view. */
  const following = useRef(false);
  const [edges, setEdges] = useState<Edges>(NO_EDGES);

  // A new question: start reading from the top, not following.
  useLayoutEffect(() => {
    const area = scrollRef.current;

    following.current = false;

    if (area) {
      area.scrollTo({ top: 0 });
      setEdges((current) => sameEdges(current, readEdges(area)));
    }
  }, [anchorKey]);

  useEffect(() => {
    const area = scrollRef.current;
    const content = contentRef.current;

    if (!(area && content)) {
      return;
    }

    const measure = () =>
      setEdges((current) => sameEdges(current, readEdges(area)));

    // As the reply grows, keep the end in view only for a reader who chose it.
    const observer = new ResizeObserver(() => {
      if (following.current) {
        area.scrollTop = area.scrollHeight;
      }

      measure();
    });

    // Only the reader's own wheel, touch, keys or scrollbar drag decide
    // whether to follow; the programmatic scrolls here never trigger these.
    const onUserScroll = () =>
      requestAnimationFrame(() => {
        following.current = distanceToEnd(area) <= BOTTOM_SLACK;
      });

    // One abort() removes every listener.
    const listeners = new AbortController();
    const options = { passive: true, signal: listeners.signal };

    observer.observe(content);
    observer.observe(area);
    area.addEventListener("scroll", measure, options);
    area.addEventListener("wheel", onUserScroll, options);
    area.addEventListener("touchmove", onUserScroll, options);
    area.addEventListener("keydown", onUserScroll, options);
    area.addEventListener("pointerup", onUserScroll, options);

    return () => {
      observer.disconnect();
      listeners.abort();
    };
  }, []);

  const jumpToLatest = () => {
    const area = scrollRef.current;

    following.current = true;
    area?.scrollTo({ behavior: "smooth", top: area.scrollHeight });
  };

  // A <section> with a label is a named region; browsers make an overflowing
  // scroll area keyboard-focusable, so arrows and Page Up/Down work too.
  return (
    <div className={cn("relative flex min-h-0 flex-col", className)}>
      <section
        aria-label={label}
        className={cn(
          SCROLL_AREA,
          edges.above && "ai-fade-top",
          edges.below && "ai-fade-bottom"
        )}
        data-lenis-prevent
        ref={scrollRef}
      >
        <div className={contentClassName} ref={contentRef}>
          {children}
        </div>
      </section>
      {edges.below && <JumpButton onClick={jumpToLatest} />}
    </div>
  );
};
