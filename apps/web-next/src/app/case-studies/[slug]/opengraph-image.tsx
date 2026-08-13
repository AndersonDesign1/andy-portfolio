import { ImageResponse } from "next/og";
import caseStudiesData from "../../../data/case-studies.json";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const caseStudy =
    caseStudiesData.caseStudies[
      slug as keyof typeof caseStudiesData.caseStudies
    ];

  const title = caseStudy?.hero?.title || "Case Study";
  const subtitle = caseStudy?.hero?.client
    ? `Client: ${caseStudy.hero.client}`
    : "Anderson Joseph Portfolio";

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
            color: "#737373", // muted
            marginBottom: 40,
          }}
        >
          Case Study
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            marginBottom: 20,
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
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#a3a3a3",
          }}
        >
          {subtitle}
        </div>
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
      ...size,
    }
  );
}
