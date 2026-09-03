import { ImageResponse } from "next/og";
import { getGraft } from "@/lib/graft";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = await getGraft().getContent("case-studies", slug);

  const title = document?.data.hero.title || "Case Study";
  const subtitle = document?.data.hero.client
    ? `Client: ${document.data.hero.client}`
    : "Anderson Joseph Portfolio";

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
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          maxWidth: "900px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: "#737373",
            fontSize: 24,
            letterSpacing: "0.2em",
            marginBottom: 40,
            textTransform: "uppercase",
          }}
        >
          Case Study
        </div>
        <div
          style={{
            color: "#ededed",
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: 20,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: "#a3a3a3",
            fontSize: 32,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </div>
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
      ...size,
    }
  );
}
