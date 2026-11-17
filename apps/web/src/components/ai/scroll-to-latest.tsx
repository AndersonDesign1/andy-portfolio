"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { useStickToBottom } from "use-stick-to-bottom";

import { cn } from "@/lib/utils";

/**
 * A scroll area that follows new text as it streams (the AI Elements
 * Conversation behaviour), but lets go as soon as the reader scrolls up, and
 * offers a button back to the latest line.
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
      <div className="min-h-0 flex-1 overflow-y-auto" ref={scrollRef}>
        <div className={contentClassName} ref={contentRef}>
          {children}
        </div>
      </div>
      {!isAtBottom && (
        <button
          aria-label="Jump to the latest"
          className="border-subtle bg-background/90 text-secondary hover:text-primary absolute bottom-3 left-1/2 inline-flex size-9 -translate-x-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-colors"
          onClick={() => scrollToBottom()}
          type="button"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
        </button>
      )}
    </div>
  );
};
