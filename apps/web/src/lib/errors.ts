export type ErrorTone = "missing" | "client" | "server";

export interface ErrorInfo {
  description: string;
  status: number;
  title: string;
  tone: ErrorTone;
}

type ErrorCopy = Omit<ErrorInfo, "status">;

const KNOWN_ERRORS = {
  400: {
    description:
      "Something about that request didn't parse. Go back, check the link, and try again.",
    title: "That request didn't make sense",
    tone: "client",
  },
  401: {
    description:
      "This page needs you to be signed in, and I couldn't verify who you are.",
    title: "You'll need to sign in first",
    tone: "client",
  },
  403: {
    description:
      "The page exists, but it isn't open to the public. If you think that's a mistake, tell me.",
    title: "This one's off limits",
    tone: "client",
  },
  404: {
    description:
      "It may have moved, been renamed, or the link might be off by a character. Nothing is broken on your end.",
    title: "This page doesn't exist",
    tone: "missing",
  },
  405: {
    description:
      "That address is real, but it doesn't accept the kind of request that was sent to it.",
    title: "Wrong way in",
    tone: "client",
  },
  408: {
    description:
      "The connection stalled before the request finished. Give it another go.",
    title: "That took too long",
    tone: "client",
  },
  429: {
    description:
      "You've sent a lot of requests in a short time. Wait a minute, then try again.",
    title: "Slow down a little",
    tone: "client",
  },
  500: {
    description:
      "That one's on me, not you. Try again in a moment, and if it keeps happening, let me know.",
    title: "Something broke on my end",
    tone: "server",
  },
  502: {
    description:
      "An upstream service sent back something I couldn't use. This usually clears up quickly.",
    title: "A service I rely on stumbled",
    tone: "server",
  },
  503: {
    description:
      "The site is briefly unavailable, most likely a deploy or maintenance. Check back shortly.",
    title: "Back in a moment",
    tone: "server",
  },
  504: {
    description:
      "An upstream service took too long to answer. Refreshing usually does it.",
    title: "A service took too long to reply",
    tone: "server",
  },
} satisfies Record<number, ErrorCopy>;

const FALLBACK_CLIENT: ErrorCopy = {
  description:
    "The request couldn't be completed. Go back and try again, or head home.",
  title: "That didn't work",
  tone: "client",
};

const FALLBACK_SERVER: ErrorCopy = {
  description:
    "Something went wrong while loading this page. Try again in a moment.",
  title: "Something broke on my end",
  tone: "server",
};

const CLIENT_ERROR_START = 400;
const SERVER_ERROR_START = 500;

const isKnownStatus = (status: number): status is keyof typeof KNOWN_ERRORS =>
  status in KNOWN_ERRORS;

/**
 * Turns an HTTP status code into human copy and a visual tone.
 * Unknown 4xx codes fall back to a generic client message, and any other
 * unknown code to a generic server message, so callers never need to guard
 * the input.
 */
export const interpretError = (status: number): ErrorInfo => {
  if (isKnownStatus(status)) {
    return { ...KNOWN_ERRORS[status], status };
  }

  const fallback =
    status >= CLIENT_ERROR_START && status < SERVER_ERROR_START
      ? FALLBACK_CLIENT
      : FALLBACK_SERVER;
  return { ...fallback, status };
};
