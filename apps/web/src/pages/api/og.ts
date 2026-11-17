// Pinned to @vercel/og 0.11.x: 1.x bundles a harfbuzz build that calls
// `require("fs")` from ESM, so under Node the stream dies after the headers
// and crawlers receive a 0-byte PNG.
import { ImageResponse } from "@vercel/og";
import type { APIRoute } from "astro";
import { createElement } from "react";
import type { ReactElement, ReactNode } from "react";

export const prerender = false;

const SIZE = { height: 630, width: 1200 };
const DOMAIN = "andersonjoseph.com";
const DEFAULT_TITLE = "Anderson Joseph";
const DEFAULT_DESCRIPTION = "Full Stack Developer & SEO Specialist";

type Style = Record<string, string | number>;

const el = (type: string, style: Style, children?: ReactNode): ReactElement =>
  createElement(type, { style }, children);

const frame = (children: ReactNode): ReactElement =>
  el(
    "div",
    {
      alignItems: "flex-start",
      backgroundColor: "#050505",
      color: "#ededed",
      display: "flex",
      flexDirection: "column",
      fontFamily: "sans-serif",
      height: "100%",
      justifyContent: "space-between",
      padding: "80px",
      width: "100%",
    },
    children
  );

const domain = (): ReactElement =>
  el("div", { color: "#737373", fontSize: 24 }, DOMAIN);

const footerText = (text: string): ReactElement =>
  el("div", { color: "#a3a3a3", fontSize: 32, fontWeight: 500 }, text);

// Shared by Blog and Case Study: uppercase eyebrow over a large title.
const labelled = (label: string, title: string): ReactElement =>
  el(
    "div",
    {
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
      maxWidth: "900px",
    },
    [
      el(
        "div",
        {
          color: "#737373",
          fontSize: 24,
          letterSpacing: "0.2em",
          marginBottom: 40,
          textTransform: "uppercase",
        },
        label
      ),
      el(
        "div",
        {
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        },
        title
      ),
    ]
  );

const pageImage = (title: string, description: string): ReactElement =>
  frame([
    el(
      "div",
      {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "950px",
      },
      [
        el(
          "div",
          {
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: 24,
          },
          title
        ),
        el(
          "div",
          {
            color: "#a3a3a3",
            fontSize: 32,
            letterSpacing: "-0.02em",
            lineHeight: 1.4,
            maxWidth: "800px",
          },
          description
        ),
      ]
    ),
    el("div", { display: "flex", justifyContent: "flex-end", width: "100%" }, [
      domain(),
    ]),
  ]);

const blogImage = (title: string): ReactElement =>
  frame([
    labelled("Blog", title),
    el("div", { alignItems: "center", display: "flex", gap: 16 }, [
      footerText("Anderson Joseph"),
      el("div", { color: "#525252", fontSize: 24 }, "|"),
      footerText(DOMAIN),
    ]),
  ]);

const caseStudyImage = (title: string, client: string | null): ReactElement =>
  frame([
    labelled("Case Study", title),
    el(
      "div",
      {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      },
      [
        footerText(client ? `Client: ${client}` : "Anderson Joseph Portfolio"),
        domain(),
      ]
    ),
  ]);

const render = (params: URLSearchParams): ReactElement => {
  const title = params.get("title") || DEFAULT_TITLE;
  const kind = params.get("kind");

  if (kind === "blog") {
    return blogImage(title);
  }

  if (kind === "case-study") {
    return caseStudyImage(title, params.get("client"));
  }

  return pageImage(title, params.get("description") || DEFAULT_DESCRIPTION);
};

export const GET: APIRoute = ({ url }) =>
  new ImageResponse(render(url.searchParams), {
    ...SIZE,
    headers: {
      // Content only changes on deploy; let the Vercel CDN hold it.
      "Cache-Control":
        "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
