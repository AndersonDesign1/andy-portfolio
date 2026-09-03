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
          alignItems: "flex-start",
          backgroundColor: "#050505",
          color: "#ededed",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "80px",
          position: "relative",
          width: "100%",
        }}
      >
        {/* Content */}
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "950px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              color: "#ededed",
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#a3a3a3",
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            zIndex: 10,
          }}
        >
          <div
            style={{
              color: "#737373",
              fontSize: 24,
            }}
          >
            andersonjoseph.com
          </div>
        </div>
      </div>,
      {
        height: 630,
        width: 1200,
      }
    );
  } catch (_e) {
    // Error logged in ops monitoring
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
