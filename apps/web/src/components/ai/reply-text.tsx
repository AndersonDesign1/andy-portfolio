"use client";

import { code } from "@streamdown/code";
import { Streamdown } from "streamdown";

import { codeThemeDark, codeThemeLight } from "@/lib/code-themes";

const plugins = { code };

/** Copy on code blocks and tables; no download buttons, which are noise in a chat answer. */
const controls = {
  code: { copy: true, download: false },
  table: { copy: true, download: false, fullscreen: false },
};

/** Grayscale code themes adjusted to pass WCAG AA (light, dark); see lib/code-themes. */
const SHIKI_THEMES: [typeof codeThemeLight, typeof codeThemeDark] = [
  codeThemeLight,
  codeThemeDark,
];

/**
 * A reply as Markdown, via Streamdown (the renderer behind AI Elements'
 * Message). While text streams it closes unfinished bold, lists and code
 * fences, so raw `**` or half a code block never flashes on screen. Code
 * blocks get Shiki highlighting and a copy button. Output is sanitized and
 * raw HTML from the model is not rendered.
 */
export const ReplyText = ({
  text,
  streaming = false,
}: {
  text: string;
  streaming?: boolean;
}) => (
  <Streamdown
    className="ai-reply"
    controls={controls}
    isAnimating={streaming}
    plugins={plugins}
    shikiTheme={SHIKI_THEMES}
    skipHtml
  >
    {text}
  </Streamdown>
);
