/**
 * How the work reads on / and /projects, in Anderson's own words. Links,
 * pictures and order come from the Graft projects collection where a
 * project has an entry there; Graft itself is the one featured piece without
 * one.
 */

export interface FeaturedWork {
  /** Shown on the stage when there's no picture. */
  fragment?: "terminal";
  /** The label of the link, e.g. "Read the case study". */
  go: string;
  href: string;
  image?: { alt: string; src: string };
  /** One line on what I did and what came of it. Wrap figures in <b>. */
  outcome: string;
  title: string;
  year: string;
}

export const FEATURED_WORK: FeaturedWork[] = [
  {
    go: "Read the case study",
    href: "/case-studies/welup-digital",
    image: {
      alt: "The rebuilt Welup Digital homepage",
      src: "/welup-main.png",
    },
    outcome:
      "I built Welup Digital's first site from scratch, watched it get DDoSed, then rebuilt it with a CMS the team could edit. Traffic went up <b>300%</b> and pages loaded <b>50% faster</b>.",
    title: "Rebuilding Welup Digital",
    year: "2021 – now",
  },
  {
    fragment: "terminal",
    go: "Read the case study",
    href: "/case-studies/graft",
    outcome:
      "Other CMS tools bolt AI on later, while non-technical teams still need a dashboard. Graft keeps content in code for agents, gives editors a dashboard, and <b>this site runs on it</b>.",
    title: "Graft, my open source CMS",
    year: "2026",
  },
  {
    go: "Read the case study",
    href: "/case-studies/tare-gems",
    image: { alt: "A Tare Gems product page", src: "/tare-gems.webp" },
    outcome:
      "Tare Gems used to take every anime fashion order manually over WhatsApp. Now buyers pick from <b>hundreds of products</b> with live stock, pay online, and Tare Gems just gets a delivery alert.",
    title: "Tare Gems",
    year: "2025",
  },
  {
    go: "Read the case study",
    href: "/case-studies/flik",
    image: { alt: "A Flik storefront", src: "/flik-img.webp" },
    outcome:
      "Built like Gumroad for African creators, with custom storefronts like Shopify. I built Flik's <b>storefronts</b>, <b>site builder</b>, and <b>analytics</b>.",
    title: "Flik",
    year: "Dec 2025 – now",
  },
  {
    go: "Read the case study",
    href: "/case-studies/mykrogrid",
    image: {
      alt: "The MykroGrid homepage: solar panels over a rooftop, under the line Powering Nigeria's Growth",
      src: "/mykrogrid.webp",
    },
    outcome:
      "I joined MykroGrid to build the frontend with their in-house designer, bringing the custom brand system online for solar grids powering <b>hospitals</b>, <b>universities</b>, homes, and markets across Nigeria.",
    title: "MykroGrid",
    year: "2026",
  },
];

interface ArchiveLine {
  kind: string;
  name: string;
  result: string;
}

/** The plain list under the featured work, keyed by Graft project slug. */
export const ARCHIVE_LINES = {
  "aristeia-properties": {
    kind: "Real estate site",
    name: "Aristeia Properties",
    result: "Listings and estates",
  },
  "craigwal-petroshore": {
    kind: "Custom company site",
    name: "Craigwal Petroshore",
    result: "Services and projects",
  },
  "dubiss-forex-academy": {
    kind: "Site and SEO foundation",
    name: "Dubiss Forex Academy",
    result: "A school with 52,000+ traders",
  },
  "kyrus-recycling": {
    kind: "Recycling app, led a small team",
    name: "Kyrus Recycling",
    result: "MVP in 3 months",
  },
  "new-hampshire-capital": {
    kind: "Finance website",
    name: "New Hampshire Capital",
    result: "Sectors and newsletter",
  },
  "prompt-earn": {
    kind: "SEO and affiliate growth",
    name: "PromptEarn",
    result: "Google traffic +250%, PageSpeed 45 → 80",
  },
  "the-wealthy-post": {
    kind: "Performance and SEO",
    name: "The Wealthy Post",
    result: "Load time 15s → 3s, Google traffic doubled",
  },
  "urabus-renewable-energies": {
    kind: "Clean energy site",
    name: "Urabus Renewable Energies",
    result: "Solar, EV and payment plans",
  },
} satisfies Record<string, ArchiveLine>;

const archiveLines = new Map<string, ArchiveLine>(
  Object.entries(ARCHIVE_LINES)
);

/** The archive line for a Graft project slug, if it has one. */
export const archiveLineFor = (slug: string): ArchiveLine | undefined =>
  archiveLines.get(slug);

export const WORK_HISTORY = [
  {
    name: "Welup Digital",
    note: "First developer hire. Built and rebuilt the platform, handled SEO, and taught at Welup Academy.",
    when: "2021 – now",
  },
  {
    name: "Flik",
    note: "Built the storefronts, site builder, and analytics dashboard.",
    when: "Dec 2025 – now",
  },
  {
    name: "Zumera",
    note: "Built client web apps, front to back.",
    when: "2025 – 2026",
  },
  {
    name: "PromptEarn",
    note: "SEO and affiliate growth. Organic traffic up 250%, affiliates from 40k to 93k.",
    when: "2024",
  },
  {
    name: "On my own",
    note: "Stores and sites for clients across energy, finance, property, and retail.",
    when: "2020 – now",
  },
];

export const EDUCATION = [
  {
    name: "Meta Front-End Engineer",
    note: "Meta, via Coursera",
    when: "2023 – 2024",
  },
  {
    name: "SEO Specialization",
    note: "UC Davis, via Coursera",
    when: "2023 – 2024",
  },
  {
    name: "Leadership Development",
    note: "McKinsey Forward Program",
    when: "2024",
  },
  { name: "Project Management", note: "Google, via Coursera", when: "2023" },
  { name: "Computer Science", note: "NABTEB", when: "2021 – 2022" },
  { name: "Web Development", note: "Edobits ICT Academy", when: "2020 – 2021" },
];
