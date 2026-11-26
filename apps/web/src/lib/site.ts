/** Small facts shared by the site's Astro components and scripts. */

export const CONTACT_EMAIL = "contact@andersonjoseph.com";

export const RESUME_URL = "/Anderson%20Joseph%20Resume.pdf";

export const SOCIAL_LINKS = [
  { href: "https://github.com/AndersonDesign1", label: "GitHub" },
  { href: "https://x.com/_Andersonjosh", label: "X" },
  { href: "https://www.linkedin.com/in/anderson-josh/", label: "LinkedIn" },
] as const;

/** What the Ask pill cycles through on hover, and offers as one-tap questions. */
export const ASK_SUGGESTIONS = [
  "What does Anderson build?",
  "Why did he build Graft?",
  "How does he build for AI agents?",
  "Can he work with my team?",
] as const;
