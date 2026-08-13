export const prerender = false;

import { ImageResponse } from "@vercel/og";
import type { APIRoute } from "astro";
import { createElement, type ReactNode } from "react";

function el(
  type: string,
  style: Record<string, string | number>,
  children?: ReactNode
) {
  return createElement(type, { style }, children);
}

export const GET: APIRoute = ({ url }) => {
  const title = url.searchParams.get("title") || "Anderson Joseph";
  const description =
    url.searchParams.get("description") ||
    "Full Stack Developer & SEO Specialist";

  return new ImageResponse(
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
      [
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
                fontWeight: 400,
                lineHeight: 1.4,
              },
              description
            ),
          ]
        ),
        el("div", { color: "#737373", fontSize: 24 }, "andersonjoseph.com"),
      ]
    ),
    { height: 630, width: 1200 }
  );
};
