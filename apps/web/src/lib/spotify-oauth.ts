export const SPOTIFY_OAUTH_STATE_COOKIE = "spotify_oauth_state";
export const SPOTIFY_OAUTH_STATE_MAX_AGE_SECONDS = 600;

export const escapeHtml = (text: string): string =>
  text.replaceAll(/[&<>"']/gu, (character) => {
    switch (character) {
      case '"': {
        return "&quot;";
      }
      case "&": {
        return "&amp;";
      }
      case "'": {
        return "&#039;";
      }
      case "<": {
        return "&lt;";
      }
      case ">": {
        return "&gt;";
      }
      default: {
        return character;
      }
    }
  });

export const createOAuthState = (): string => crypto.randomUUID();

export const readCookieValue = (
  cookieHeader: string | null,
  name: string
): string | null => {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawKey, ...rawValueParts] = part.trim().split("=");
    if (rawKey === name) {
      const rawValue = rawValueParts.join("=");
      return rawValue ? decodeURIComponent(rawValue) : null;
    }
  }

  return null;
};

export const buildOAuthStateCookie = (
  state: string,
  secure: boolean
): string => {
  const flags = [
    `${SPOTIFY_OAUTH_STATE_COOKIE}=${encodeURIComponent(state)}`,
    "HttpOnly",
    "Path=/api/spotify",
    "SameSite=Lax",
    `Max-Age=${SPOTIFY_OAUTH_STATE_MAX_AGE_SECONDS}`,
    secure ? "Secure" : "",
  ].filter(Boolean);

  return flags.join("; ");
};

export const clearOAuthStateCookie = (secure: boolean): string => {
  const flags = [
    `${SPOTIFY_OAUTH_STATE_COOKIE}=`,
    "HttpOnly",
    "Path=/api/spotify",
    "SameSite=Lax",
    "Max-Age=0",
    secure ? "Secure" : "",
  ].filter(Boolean);

  return flags.join("; ");
};

export const appendSetCookie = (headers: Headers, cookie: string): Headers => {
  headers.append("Set-Cookie", cookie);
  return headers;
};

export const spotifyOAuthHtmlPage = (
  title: string,
  body: string,
  options?: { setCookie?: string; status?: number }
) => {
  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
  });
  if (options?.setCookie) {
    appendSetCookie(headers, options.setCookie);
  }

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 2rem; line-height: 1.5; max-width: 42rem; }
      code, pre { background: #111; color: #f5f5f5; border-radius: 0.375rem; }
      code { padding: 0.125rem 0.375rem; }
      pre { padding: 1rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
      .muted { color: #666; }
      a { color: inherit; }
    </style>
  </head>
  <body>${body}</body>
</html>`,
    {
      headers,
      status: options?.status ?? 200,
    }
  );
};
