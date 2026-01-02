import type { Metadata } from "next";
import GiveawayEntryForm from "@/components/giveaway-entry-form";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Enter Giveaway",
  description:
    "Fill out the form to enter the New Year giveaway. Win a free custom website with design, development, and hosting included!",
});

export default function GiveawayEnter() {
  return <GiveawayEntryForm />;
}
