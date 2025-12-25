import { ImageResponse } from "next/og";
import caseStudiesData from "../../../data/case-studies.json";

export const runtime = "edge";

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
    : "Andeson Joseph Portfolio";

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
      {/* Grain Texture Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          opacity: 0.15,
          zIndex: 0,
        }}
      />

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
          flexDirection: "column",
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
      </div>
    </div>,
    {
      ...size,
    }
  );
}
