import type { Metadata } from "next";
import GiveawayPage from "@/components/giveaway-page";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "New Year Giveaway | Free Website",
  description:
    "Celebrating 2026 with a giveaway! Enter for a chance to win a free custom website — design, development, and hosting included.",
});

export default function Giveaway() {
  return <GiveawayPage />;
}
