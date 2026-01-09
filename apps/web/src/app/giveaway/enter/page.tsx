import type { Metadata } from "next";
import GiveawayEnded from "@/components/giveaway-ended";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Giveaway Ended",
  description:
    "The New Year Giveaway has officially ended. Stay tuned for future updates and opportunities!",
});

export default function GiveawayEnter() {
  return <GiveawayEnded />;
}
