import { client } from "@andy-portfolio/sanity-config";
import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await client.fetch<{ title: string }>(
    `*[_type == "post" && slug.current == $slug][0]{ title }`,
    { slug }
  );

  const title = post?.title || "Blog Post";

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: 10,
          maxWidth: "900px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#737373",
            marginBottom: 40,
          }}
        >
          Blog
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: 30,
            color: "#ededed",
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#a3a3a3",
          }}
        >
          Anderson Joseph
        </div>
        <div style={{ fontSize: 24, color: "#525252" }}>|</div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#a3a3a3",
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
