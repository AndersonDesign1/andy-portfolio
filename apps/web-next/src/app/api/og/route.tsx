import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>&description=<description>
    const title = searchParams.get("title") || "Anderson Joseph";
    const description =
      searchParams.get("description") ||
      "Full Stack Developer & SEO Specialist";

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#050505",
          color: "#ededed",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
            zIndex: 10,
            maxWidth: "950px",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#ededed",
              marginBottom: 24,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.4,
              color: "#a3a3a3",
              maxWidth: "800px",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#737373",
            }}
          >
            andersonjoseph.com
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (_e) {
    // Error logged in ops monitoring
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
