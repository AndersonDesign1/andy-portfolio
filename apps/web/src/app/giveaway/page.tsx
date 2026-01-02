import type { Metadata } from "next";
import GiveawayPage from "@/components/giveaway-page";

export const metadata: Metadata = {
  title: "New Year Giveaway | Andy - Free Website for You",
  description:
    "Celebrating 2026 with a giveaway! Enter for a chance to win a free custom website — design, development, and hosting included.",
  openGraph: {
    title: "New Year Giveaway | Andy - Free Website for You",
    description:
      "Celebrating 2026 with a giveaway! Enter for a chance to win a free custom website — design, development, and hosting included.",
    url: "https://andersonjoseph.com/giveaway",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Year Giveaway | Andy - Free Website for You",
    description:
      "Celebrating 2026 with a giveaway! Enter for a chance to win a free custom website.",
  },
};

export default function Giveaway() {
  return <GiveawayPage />;
}
