import type { Metadata } from "next";
import GiveawayEntryForm from "@/components/giveaway-entry-form";

export const metadata: Metadata = {
  title: "Enter Giveaway",
  description:
    "Fill out the form to enter the New Year giveaway. Win a free custom website with design, development, and hosting included!",
  openGraph: {
    title: "Enter Giveaway | Andy Joseph",
    description:
      "Fill out the form to enter the New Year giveaway. Win a free custom website!",
    url: "https://www.andersonjoseph.com/giveaway/enter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enter Giveaway | Andy Joseph",
    description:
      "Fill out the form to enter the New Year giveaway. Win a free custom website!",
  },
};

export default function GiveawayEnter() {
  return <GiveawayEntryForm />;
}
