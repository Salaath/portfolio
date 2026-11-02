// Placeholder content — replace with your real case studies.
// Keep metrics relative ("+18%") if exact numbers are under NDA.

export type Section = { heading: string; body: string };

export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  team: string;
  tags: string[];
  /** Two-stop gradient behind the cover image (and the fallback without one) */
  cover: [string, string];
  /** Cover image in /public. The current ones are dummy mock-ups. */
  image?: string;
  metrics: { value: string; label: string }[];
  sections: Section[];
};

export const cases: CaseStudy[] = [
  {
    // Has its own page: src/app/work/account-opening/page.tsx
    slug: "account-opening",
    image: "/work/account-opening.jpg",
    title: "Making it easier to start investing",
    tagline: "Redesigning Upstox account opening to cut the work people had to do, and to give them a clear path from sign-up to their first investment.",
    year: "2026",
    role: "Lead product designer",
    team: "Product managers, engineering, KYC vendors",
    tags: ["Onboarding", "KYC", "Activation"],
    cover: ["#3b2bb8", "#8f7bff"],
    metrics: [
      { value: "~35%", label: "Projected completion" },
      { value: "~1–2 min", label: "Projected time to submit" },
      { value: "11 → 7", label: "Happy-path steps" },
    ],
    sections: [],
  },
  {
    // Has its own page: src/app/work/nps/page.tsx
    slug: "nps",
    image: "/work/nps.jpg",
    title: "Making NPS feel simple",
    tagline: "Turning a government portal, eight-step wizards and a captcha into a few guided taps inside Upstox.",
    year: "2025",
    role: "Lead product designer",
    team: "Gitika (detail pages, withdrawal), Kritima (UI review)",
    tags: ["Retirement", "0 → 1", "Tax saving"],
    cover: ["#ff6b2c", "#ffb36b"],
    metrics: [
      { value: "124", label: "Accounts in month one" },
      { value: "₹19.7 L", label: "AUM in month one" },
      { value: "0", label: "Marketing spend" },
    ],
    sections: [],
  },
  {
    // Has its own page: src/app/work/personal-loans/page.tsx
    slug: "personal-loans",
    image: "/work/personal-loans.jpg",
    title: "Money in two hours, designed three times over",
    tagline: "Launching pre-approved personal loans for Upstox users, through seven rounds of change and into a standalone app.",
    year: "2025",
    role: "Lead product designer",
    team: "PMs, engineering, Yubi and lending partners, compliance",
    tags: ["Lending", "0 → 1", "Compliance"],
    cover: ["#4b0f96", "#170833"],
    metrics: [
      { value: "20k", label: "App downloads" },
      { value: "8,037", label: "Leads" },
      { value: "₹6.4 L", label: "Disbursed" },
    ],
    sections: [],
  },
  {
    slug: "risk-clarity",
    image: "/work/risk-clarity.jpg",
    title: "Designing for risk in F&O",
    tagline: "Making high-risk products honest without killing engagement.",
    year: "2024",
    role: "Design lead",
    team: "Cross-functional with compliance",
    tags: ["Trust", "Regulation", "Strategy"],
    cover: ["#1c1b19", "#e6463a"],
    metrics: [
      { value: "00%", label: "Disclosure comprehension" },
      { value: "+00", label: "Trust score" },
      { value: "0", label: "Regulatory escalations" },
    ],
    sections: [
      { heading: "Context", body: "Regulatory change and the tension between safety and growth." },
      { heading: "My role", body: "What you designed hands-on, and how you aligned compliance and product." },
      { heading: "Key decisions", body: "What you reframed, pushed back on, or killed." },
      { heading: "Outcome", body: "Impact and learnings." },
    ],
  },
];

export const getCase = (slug: string) => cases.find((c) => c.slug === slug);
