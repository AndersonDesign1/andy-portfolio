import type { Metadata } from "next";
import GiveawayEnded from "@/components/giveaway-ended";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  description:
    "The New Year Giveaway has officially ended. Stay tuned for future updates and opportunities!",
  title: "Giveaway Ended",
});

export default function GiveawayEnter() {
  return <GiveawayEnded />;
}
