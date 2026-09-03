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
  const post = await getGraft().getContent("posts", slug);
  const title = post?.data.title || "Blog Post";

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
          Blog
        </div>
        <div
          style={{
            color: "#ededed",
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: 30,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 16,
        }}
      >
        <div
          style={{
            color: "#a3a3a3",
            fontSize: 32,
            fontWeight: 500,
          }}
        >
          Anderson Joseph
        </div>
        <div style={{ color: "#525252", fontSize: 24 }}>|</div>
        <div
          style={{
            color: "#a3a3a3",
            fontSize: 32,
            fontWeight: 500,
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
