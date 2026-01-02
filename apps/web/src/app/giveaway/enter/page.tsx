import type { Metadata } from "next";
import GiveawayEntryForm from "@/components/giveaway-entry-form";

export const metadata: Metadata = {
  title: "Enter Giveaway | Andy - New Year Free Website",
  description:
    "Fill out the form to enter the New Year giveaway. Win a free custom website with design, development, and hosting included!",
  openGraph: {
    title: "Enter Giveaway | Andy - New Year Free Website",
    description:
      "Fill out the form to enter the New Year giveaway. Win a free custom website!",
    url: "https://andersonjoseph.com/giveaway/enter",
    type: "website",
  },
};

export default function GiveawayEnter() {
  return <GiveawayEntryForm />;
}
