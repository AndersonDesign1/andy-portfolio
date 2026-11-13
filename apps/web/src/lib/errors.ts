export type ErrorTone = "missing" | "client" | "server";

export interface ErrorInfo {
  description: string;
  /** Short mono label shown next to the status dot, e.g. "Not found". */
  label: string;
  status: number;
  title: string;
  tone: ErrorTone;
}

type ErrorCopy = Omit<ErrorInfo, "status">;

const KNOWN_ERRORS = {
  400: {
    description:
      "Something about that request didn't parse. Go back, check the link, and try again.",
    label: "Bad request",
    title: "That request didn't make sense",
    tone: "client",
  },
  401: {
    description:
      "This page needs you to be signed in, and I couldn't verify who you are.",
    label: "Unauthorized",
    title: "You'll need to sign in first",
    tone: "client",
  },
  403: {
    description:
      "The page exists, but it isn't open to the public. If you think that's a mistake, tell me.",
    label: "Forbidden",
    title: "This one's off limits",
    tone: "client",
  },
  404: {
    description:
      "It may have moved, been renamed, or the link might be off by a character. Nothing is broken on your end.",
    label: "Not found",
    title: "This page doesn't exist",
    tone: "missing",
  },
  405: {
    description:
      "That address is real, but it doesn't accept the kind of request that was sent to it.",
    label: "Method not allowed",
    title: "Wrong way in",
    tone: "client",
  },
  408: {
    description:
      "The connection stalled before the request finished. Give it another go.",
    label: "Request timeout",
    title: "That took too long",
    tone: "client",
  },
  429: {
    description:
      "You've sent a lot of requests in a short time. Wait a minute, then try again.",
    label: "Too many requests",
    title: "Slow down a little",
    tone: "client",
  },
  500: {
    description:
      "That one's on me, not you. Try again in a moment, and if it keeps happening, let me know.",
    label: "Server error",
    title: "Something broke on my end",
    tone: "server",
  },
  502: {
    description:
      "An upstream service sent back something I couldn't use. This usually clears up quickly.",
    label: "Bad gateway",
    title: "A service I rely on stumbled",
    tone: "server",
  },
  503: {
    description:
      "The site is briefly unavailable, most likely a deploy or maintenance. Check back shortly.",
    label: "Service unavailable",
    title: "Back in a moment",
    tone: "server",
  },
  504: {
    description:
      "An upstream service took too long to answer. Refreshing usually does it.",
    label: "Gateway timeout",
    title: "A service took too long to reply",
    tone: "server",
  },
} satisfies Record<number, ErrorCopy>;

const FALLBACK_CLIENT: ErrorCopy = {
  description:
    "The request couldn't be completed. Go back and try again, or head home.",
  label: "Request error",
  title: "That didn't work",
  tone: "client",
};

const FALLBACK_SERVER: ErrorCopy = {
  description:
    "Something went wrong while loading this page. Try again in a moment.",
  label: "Server error",
  title: "Something broke on my end",
  tone: "server",
};

const SERVER_ERROR_START = 500;

const isKnownStatus = (status: number): status is keyof typeof KNOWN_ERRORS =>
  status in KNOWN_ERRORS;

/**
 * Turns an HTTP status code into human copy and a visual tone.
 * Unknown codes below 500 fall back to a generic client message, and
 * codes from 500 up to a generic server message, so callers never need to
 * guard the input.
 */
export const interpretError = (status: number): ErrorInfo => {
  if (isKnownStatus(status)) {
    return { ...KNOWN_ERRORS[status], status };
  }

  const fallback =
    status >= SERVER_ERROR_START ? FALLBACK_SERVER : FALLBACK_CLIENT;
  return { ...fallback, status };
};
