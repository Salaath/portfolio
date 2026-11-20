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
  /** Dark text and no shading, for a cover with a light background. */
  coverInk?: "dark";
  /** Horizontal focus of the cover on phones, where the image is cropped from the sides. */
  coverX?: string;
  /** On wide, short windows, stop the cover zooming past the mock-up: the photo keeps its full height and its sides melt into a blurred copy. */
  coverFit?: boolean;
  /** Home card: desktop title size and width, for a long title beside art that sits mid-card. */
  titleFit?: string;
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
    // The original version stays at /work/watchlist, unlinked.
    // Has its own page: src/app/work/watchlist-revised/page.tsx
    slug: "watchlist-revised",
    image: "/work/watchlist-home.jpg?v=4",
    coverX: "74%",
    coverInk: "dark",
    title: "Watchlist redesign that drove 5.2× more orders",
    tagline: "A three-release redesign of the Upstox Watchlist, shaped by trader research and product data.",
    year: "2026",
    role: "Lead product designer",
    team: "To add",
    tags: ["Trading", "Data-led", "Engagement"],
    cover: ["#2a1257", "#7c3fd6"],
    metrics: [
      { value: "+420.8%", label: "Orders from Watchlist rows" },
      { value: "+2,038.2%", label: "New lists created" },
      { value: "+138%", label: "Watchlist tab opens" },
    ],
    sections: [],
  },
  {
    // Has its own page: src/app/work/account-opening/page.tsx
    slug: "account-opening",
    image: "/work/account-opening.jpg",
    title: "How we cut demat account opening from 12 minutes to 2",
    tagline: "Revamping Upstox’s account-opening journey by replacing repetitive form filling with automated verification, fewer steps and a simpler path to investing.",
    coverInk: "dark",
    year: "2026",
    role: "Lead product designer",
    team: "Salaath Shaikh (Lead Product Designer), Sathvik (Product Designer), Sydney (Product Manager), Engineering (Cross-functional team)",
    tags: ["Onboarding", "KYC", "Activation"],
    cover: ["#3b2bb8", "#8f7bff"],
    metrics: [
      { value: "~65%", label: "Conversion" },
      { value: "~2–3 min", label: "Time on the happy path" },
      { value: "~38%", label: "Fewer onboarding steps" },
    ],
    sections: [],
  },
  {
    // Has its own page: src/app/work/nps/page.tsx
    slug: "nps",
    image: "/work/nps-home.jpg?v=4",
    coverX: "54%",
    coverFit: true,
    title: "From government portal to guided retirement investing",
    titleFit: "md:text-[4.3vw] md:max-w-[41vw]",
    tagline: "Turning a maze of portals, eight-step wizards and captchas into a few guided taps inside Upstox.",
    year: "2025",
    role: "Lead product designer",
    team: "Gitika (detail pages, withdrawal), Kritima (UI review)",
    tags: ["Retirement", "0 → 1", "Tax saving"],
    cover: ["#ff6b2c", "#ffb36b"],
    metrics: [
      { value: "₹34.6 Cr", label: "Assets under management" },
      { value: "96.4K", label: "NPS accounts created" },
      { value: "9.7L+", label: "Orders completed" },
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
    // Has its own page: src/app/work/previous-work/page.tsx
    slug: "previous-work",
    image: "/work/previous-work-home.jpg?v=2",
    coverX: "69%",
    title: "Before Upstox: beauty, luxury and a marketplace",
    tagline: "Four products from my years at Tata CLiQ: a beauty homepage that re-themes for every sale, a shoppable luxury magazine, filters and a seller portal.",
    year: "Tata CLiQ",
    role: "Product designer",
    team: "Tata CLiQ product, content and engineering teams",
    tags: ["E-commerce", "Creative direction", "Research"],
    cover: ["#962c52", "#1e0a16"],
    metrics: [
      { value: "+11.5%", label: "Homepage orders (Palette)" },
      { value: "+6.5%", label: "Conversion (Luxe Editorial)" },
      { value: "−60%", label: "Seller onboarding time" },
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
      { heading: "My role", body: "What you designed hands-on and how you aligned compliance and product." },
      { heading: "Key decisions", body: "What you reframed, pushed back on, or killed." },
      { heading: "Outcome", body: "Impact and learnings." },
    ],
  },
];

export const getCase = (slug: string) => cases.find((c) => c.slug === slug);
