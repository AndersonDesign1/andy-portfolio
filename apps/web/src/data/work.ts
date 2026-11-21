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
  stack: string;
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
      "I built their first platform, watched it buckle, then rebuilt it in Next.js with Sanity. Traffic went up <b>300%</b> and the site got <b>50% faster</b>.",
    stack: "Next.js, Sanity, Vercel",
    title: "Rebuilding Welup Digital",
    year: "2021 – now",
  },
  {
    fragment: "terminal",
    go: "See graft.page",
    href: "https://graft.page",
    outcome:
      "A CMS made for agents and the people who run them. Content lives as MDX in git, it's MIT licensed, and <b>this site runs on it</b>.",
    stack: "TypeScript, Zod, MCP",
    title: "Graft, my open source CMS",
    year: "2026",
  },
  {
    go: "Visit the store",
    href: "https://www.taregems.store/",
    image: { alt: "A Tare Gems product page", src: "/tare-gems.webp" },
    outcome:
      "An anime fashion store that knows its stock: <b>98 products</b>, live stock for every size and colour, and Paystack checkout across Nigeria.",
    stack: "Next.js, Convex, Sanity, Paystack",
    title: "Tare Gems",
    year: "2025",
  },
  {
    go: "Visit Flik",
    href: "https://flik.store",
    image: { alt: "A Flik storefront", src: "/flik-img.webp" },
    outcome:
      "A creator-commerce platform for digital products and services. I built the <b>storefronts</b>, the <b>builder</b> and the <b>analytics</b> dashboard.",
    stack: "Next.js, Convex, Better Auth",
    title: "Flik",
    year: "Dec 2025 – now",
  },
  {
    go: "Visit MykroGrid",
    href: "https://mykrogrid.com",
    image: {
      alt: "The MykroGrid homepage: solar panels over a rooftop, under the line Powering Nigeria's Growth",
      src: "/mykrogrid.webp",
    },
    outcome:
      "I built the frontend for a clean energy company that runs solar grids for <b>hospitals</b>, <b>universities</b>, homes and markets across Nigeria.",
    stack: "Clean energy, Nigeria",
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
    kind: "Next.js site",
    name: "Aristeia Properties",
    result: "Listings and estates",
  },
  "craigwal-petroshore": {
    kind: "WordPress custom theme",
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
    kind: "Next.js site",
    name: "New Hampshire Capital",
    result: "Sectors and newsletter",
  },
  "prompt-earn": {
    kind: "SEO and affiliate growth",
    name: "PromptEarn",
    result: "Google traffic +250%, PageSpeed 45 → 80",
  },
  "the-wealthy-post": {
    kind: "WordPress and SEO",
    name: "The Wealthy Post",
    result: "Load time 15s → 3s, Google traffic doubled",
  },
  "urabus-renewable-energies": {
    kind: "Next.js site",
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
    note: "Built, then rebuilt, the platform and client sites. I look after SEO for the business and its clients too.",
    when: "2021 – now",
  },
  {
    name: "Flik",
    note: "Storefronts, the builder and analytics for a creator-commerce platform.",
    when: "Dec 2025 – now",
  },
  {
    name: "Zumera",
    note: "Web apps for clients, front to back.",
    when: "2025 – 2026",
  },
  {
    name: "PromptEarn",
    note: "SEO and growth. Google traffic up 250%, affiliates from 40k to 93k.",
    when: "2024",
  },
  {
    name: "On my own",
    note: "Sites and stores for energy, finance, property and retail.",
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
