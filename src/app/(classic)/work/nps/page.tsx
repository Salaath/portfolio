import type { Metadata } from "next";
import { Choreo } from "@/components/Choreo";
import { HScroll } from "@/components/HScroll";
import { RollButton } from "@/components/RollButton";
import { CraJourney } from "@/components/nps/CraJourney";
import { NpsHero } from "@/components/nps/NpsHero";
import { NpsStories } from "@/components/nps/NpsStories";
import { SectionPill } from "@/components/nps/SectionPill";
import { NpsProtoEmbed } from "@/components/nps/ProtoEmbed";
import { FlowVideo } from "@/components/nps/FlowVideo";
import { ScrollShot } from "@/components/nps/ScrollShot";
import { Shot } from "@/components/nps/Shot";

// Building NPS from 0 to 1: the storytelling revision, following the page order
// in NPS_revised_case_study_storytelling.pdf. Market figures are user-supplied
// mid-2025 data.

const DESCRIPTION =
  "How I designed NPS on Upstox from scratch: education, account setup, fund selection, contributions and portfolio. Live to every user before tax season, with a first contribution in under 3 minutes.";

export const metadata: Metadata = {
  title: "Building NPS from 0 to 1 — Salaath Shaikh",
  description: DESCRIPTION,
  openGraph: { title: "Building NPS from 0 to 1 on Upstox", description: DESCRIPTION, type: "article" },
  twitter: { card: "summary_large_image", title: "Building NPS from 0 to 1 on Upstox", description: DESCRIPTION },
};

const ORANGE = "#FF6B2C";

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      data-fade
      className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-medium shadow-[0_6px_20px_-12px_rgba(0,0,0,0.3)] ${dark ? "bg-white/10 text-white" : "bg-white"}`}
    >
      {children}
    </span>
  );
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 data-split="lines" className={`text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-6xl ${className}`}>
      {children}
    </h2>
  );
}


const FACTS: [string, string | [string, string][]][] = [
  ["Product", "National Pension System (NPS)"],
  ["Scope", "0-to-1 product experience"],
  ["Design timeline", "3 weeks, Jan–Feb 2025"],
  ["Launch", "March 2025"],
  ["Team", [["Salaath", "Lead Product Designer"], ["Yadarth Sahu", "Product Manager"]]],
];

const REASONS = [
  ["For customers", "Help people plan and secure their retirement."],
  ["For the product", "Expand what Upstox offers into a longer-term investment need."],
  ["For access", "Cut the clutter around retirement planning with a simpler way in."],
  ["For the relationship", "Build a longer-term engagement with investors."],
];

const STARS: [string, string[]][] = [
  ["3★", ["Tier I opening and investing", "Charges visible", "Plan selection"]],
  ["5★", ["Education on investing right", "NPS calculator"]],
  ["7★", ["Portfolio tracking", "Statements and holdings", "Everything in 5★"]],
  ["11★", ["Account shifting", "Withdrawals", "Corporate NPS"]],
];

const MARKET = [
  ["Protean / NSDL", "~86–87% (estimate)", "95% of all additions, including APY"],
  ["KFintech", "12.2%", "22%"],
  ["CAMS", "Under 1% (estimate)", "~10% of retail / eNPS"],
];

const TEARDOWN = [
  {
    name: "Protean eNPS",
    kind: "I completed this registration myself",
    journey: "enps" as const,
    rows: [
      ["Subscriber and account type, before anything else", "What the account types mean, and which one applies to you", "A product decision arrives before the product has been explained"],
      ["Parents’ names, place of birth and identity proof", "Which details have to match your documents", "A long form to get through before you’ve seen what you’re getting"],
      ["An acknowledgement number to keep, and OTPs and captchas to finish", "That the number matters for what comes next", "Keeping track of the process is left to the user"],
    ],
  },
  {
    name: "KFintech",
    kind: "Distributor-assisted, in KFintech IRIS",
    journey: "kfin" as const,
    rows: [
      ["PAN and date of birth, checked against KYC and an AML database", "Why a pension account opens with a compliance check", "The investor relies on the distributor to explain each step"],
      ["Tier, fund manager, and Auto or Active allocation", "What lifecycle funds and the E, C, G split mean", "Fund managers are listed without returns, and in the recording the chart legends read “Label for Equity”"],
      ["A photo, a signature, the PAN card and a cancelled cheque for each tier", "Which files are needed, and in what format and size", "Five uploads mean stepping away to find documents"],
    ],
  },
];

const JARGON = [
  "Tier I or Tier II?", "Active or Auto choice", "Aggressive, Moderate, Conservative", "Asset classes E, C, G, A",
  "10 pension fund managers", "80CCD(1B): ₹50,000", "Locked in till 60", "60% lump sum, 40% annuity",
  "PRAN, POP, CRA, PFM", "Units credited on day 4", "~30 kinds of charges", "FATCA declaration",
];

const QUESTIONS = [
  ["How much should I contribute?", "Am I getting the full tax benefit?"],
  ["What plan should I choose?", "What are these plans? Should I be safe?"],
  ["How do I compare fund managers?", "Which provider should I pick? Who is better?"],
  ["What will it cost?", "What are the charges? What am I agreeing to?"],
  ["What happens after I invest?", "Has my money gone through? Is it growing enough?"],
];

const INTENT = ["Understand the benefit", "Decide how much", "Choose a plan and fund", "Complete the details", "Confirm the order", "Track the investment"];

const PRINCIPLES = [
  ["Jargon-free decisions", "NPS concepts in plain language, close to the point where a decision is made.", "explore", "Explore: truths of NPS, tax meter and top funds"],
  ["Seamless account opening", "Existing Upstox information where possible, with account setup inside the investment journey.", "byStatus", "Order status with PRAN generated along the way"],
  ["Transparent pricing", "Applicable charges and the total amount, before the user confirms.", "byReview", "Review: total amount, charges and consent"],
  ["Insightful portfolio tracking", "PRAN, orders, holdings and investment progress, visible after purchase.", "pfInvest", "Portfolio: value, returns, PRAN and holdings"],
];

const PRINCIPLE_TINTS = ["#7B5CB8", "#148564", "#E79D0D", "#2E7DD1"];

// The shipped design, decision by decision. Each sits under one of the four
// principles; shots marked true scroll in place.
const DECISIONS = [
  {
    principle: 0,
    title: "Start with the tax benefit, not a form",
    why: "Most people come to NPS for the tax break, and testing showed they didn’t know what it was worth to them. One question up front, how much this year, answers that before anything else is asked.",
    what: "A slider lands on ₹50,000, the 80CCD(1B) limit, and shows the saving as it moves. Explore keeps a tax meter on top, so the benefit stays in view while people browse.",
    shots: [
      ["calc", false, "Contribution sheet: how much are you planning to invest in NPS this year"],
      ["full/exploreSeen", true, "Explore: tax meter, top funds, NPS vs others, videos and FAQs"],
    ],
  },
  {
    principle: 0,
    title: "Suggest a plan, and say why",
    why: "Equity, corporate bonds and government securities in shifting proportions is a lot to judge cold. In testing, people wanted the default explained, not tucked away.",
    what: "Age sets a starting plan. At 29 that’s Aggressive, with the reason right next to it and a clear way to switch or build a custom mix within the rules.",
    shots: [["plans", false, "Plans sheet: Aggressive suggested for a 29-year-old, with the reason"]],
  },
  {
    principle: 0,
    title: "Make funds comparable at a glance",
    why: "Ten pension fund managers, most of them unfamiliar names. People needed more than returns to trust a pick, and they wanted to know what they’d end up with.",
    what: "The list is sorted by 5Y CAGR for your amount and horizon, with returns and risk against the category and the corpus at maturity on every card. Fund details open on the maturity amount and monthly pension.",
    shots: [
      ["full/allFunds", true, "Fund managers ranked by 5Y CAGR with maturity amount and risk vs category"],
      ["full/fund", true, "Fund details: maturity and pension first, then returns, withdrawal, fund info and taxes"],
    ],
  },
  {
    principle: 1,
    title: "Ask only for what we don’t already know",
    why: "Opening NPS elsewhere means a separate form, OTPs and a wait for a PRAN. Upstox already holds most of those details from KYC, so asking again would be friction for nothing.",
    what: "Of the 22 fields a PRAN needs, 17 come from Upstox. The order asks only for the rest, like a father’s or spouse’s name, and the PRAN is created in the background.",
    shots: [["byPersonal", false, "Personal details: only the fields Upstox doesn’t already have"]],
    fields: true,
  },
  {
    principle: 2,
    title: "Show every charge before money moves",
    why: "NPS carries around 30 kinds of charges across its intermediaries. A surprise at payment is the fastest way to lose trust in something people lock money into until 60.",
    what: "Review shows the amount, the applicable charges and the total, ₹50,507 for ₹50,000, with one consent placed next to the details it covers.",
    shots: [["byReview", false, "Review: invest ₹50,000, total ₹50,507, with consent to share details with CAMS"]],
  },
  {
    principle: 3,
    title: "Make the wait after payment useful",
    why: "Units arrive a few days after payment, and a PRAN is new to most people. Without a status, that gap feels like the money went missing.",
    what: "A live checklist runs from payment to PRAN to units allotted. Portfolio then brings value, returns, PRAN and holdings into one place to come back to.",
    shots: [
      ["byStatus", false, "Order status: payment confirmed, PRAN generated, order placed"],
      ["pfInvest", false, "NPS portfolio with value, returns, PRAN and holdings"],
    ],
  },
] as const;

const FLOW = [
  ["Discover", "more", "Find NPS in More, next to tax tools"],
  ["Contribute", "calc", "Set this year’s contribution"],
  ["Choose", "plans", "Review the plan suggested for your age"],
  ["Choose", "customPlan", "Or customise within the rules"],
  ["Choose", "exploreSeen", "Explore, with the tax meter on top"],
  ["Choose", "allFunds", "Compare fund managers"],
  ["Choose", "fund", "Fund details, maturity and pension"],
  ["Invest", "buyAmount", "Enter an amount"],
  ["Set up", "byPersonal", "Fill only what’s missing"],
  ["Invest", "byReview", "Review, with charges and consent"],
  ["Track", "byStatus", "Follow the order status"],
  ["Track", "pfInvest", "See it in Portfolio"],
] as const;

// Version 1, tested in the office: the four screens between More and the amount.
// Long screens scroll in place.
const V1_PATH = [
  ["v1/more", "More", "NPS sits under Tax", false],
  ["v1/explore", "Explore", "Truths on demand, then funds", true],
  ["v1/details", "Fund details", "CAGR first", true],
  ["v1/amount", "Amount", "Enter and invest", false],
] as const;

// What version 1 assumed, and what testing told us. No fixes here; those come
// in the final design section.
const ASSUMPTIONS = [
  {
    assumed: "People already knew what NPS was",
    v1: "To keep the journey short, education was on demand: a collapsed ‘Truths of investing in NPS’ row, then straight to funds.",
    heard: "This was the biggest miss. Most people didn’t know how much tax NPS could save them, or the most they could save in a year.",
    shot: ["v1/explore", "Version 1 Explore: a collapsed truths row, then three funds", true],
  },
  {
    assumed: "Returns and maturity were enough to pick a fund",
    v1: "Funds showed the two numbers we thought mattered most: 5Y returns and the maturity amount.",
    heard: "NPS was still new, and so were these pension funds. People wanted to know how risky each one was before picking.",
    shot: ["v1/all", "Version 1 fund list: 5Y returns and maturity amount only", true],
  },
  {
    assumed: "People wouldn’t want to explore different investment plan types",
    v1: "We had already picked the best default plan for their age, so the other plan types were hidden in a bottom sheet behind an ‘Investment plan’ filter.",
    heard: "People wanted to know up front why that plan was picked for them. For them it was part of the decision, not a setting.",
    shot: ["v1/plans", "Version 1 plan sheet, opened from a filter", false],
  },
  {
    assumed: "Performance was what people looked for first",
    v1: "Fund details opened on CAGR, with a calculator to compare the fund’s returns across plan types.",
    heard: "People looked for the maturity amount first, and found the calculator complex.",
    shot: ["v1/details", "Version 1 fund details: CAGR chart and plan calculator", true],
  },
] as const;

// How the final design answered each finding.
const CHANGES = [
  ["storyWorks", "People didn’t know what NPS was", "NPS explained on the first visit", "The first time someone lands on NPS, short stories explain what it is, how it works, the tax benefit and when money comes out.", "Story: how NPS works, invest now and get paid after 60"],
  ["calc", "People didn’t know what they’d save", "Tax saving comes first", "The journey opens with one question, how much this year, and shows the tax saved as you set it. Explore keeps a tax meter on top.", "Contribution sheet with the tax saving"],
  ["allFunds", "Pension funds were new to people", "Two more numbers on every fund", "Returns vs category and risk vs category sit next to 5Y returns and maturity.", "Fund list with returns and risk vs category"],
  ["plans", "People wanted to know why", "The plan became a step, with a reason", "A plan is suggested for your age, with why, and a clear way to switch or customise.", "Plans step: Aggressive suggested at 29, with the reason"],
  ["fund", "Maturity mattered more than CAGR", "Maturity first, no calculator", "Fund details open on the maturity amount and monthly pension. Amount and plan are two dropdowns.", "Fund details with maturity amount and pension first"],
  ["vsOthers", "People asked how NPS compares", "NPS vs others, on Explore", "The same yearly amount till 60 in NPS, PPF and a Nifty 50 index, so people can see the difference without a calculator.", "Explore: NPS vs PPF and Nifty 50 for ₹50,000 a year till 60"],
] as const;

export default function NpsCase() {
  return (
    <Choreo className="bg-[#F3F3F1]">
      <SectionPill
        items={[
          ["Opportunity", "opportunity"],
          ["Ambition", "ambition"],
          ["Landscape", "landscape"],
          ["Problem", "problem"],
          ["Design", "design"],
          ["Testing", "testing"],
          ["Final", "final"],
          ["Experience", "experience"],
          ["Launch", "results"],
        ]}
      />

      <NpsHero />

      {/* ---------- role ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-16 sm:px-10">
        <div className="grid gap-px overflow-hidden rounded-[2rem] bg-black/10 sm:grid-cols-2 lg:grid-cols-5">
          {FACTS.map(([k, v], i) => (
            <div key={k} className={`bg-white p-7 ${i === FACTS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <span className="label">{k}</span>
              {typeof v === "string" ? (
                <p className="mt-6 text-xl font-medium leading-snug tracking-[-0.02em]">{v}</p>
              ) : (
                <ul className="mt-6 grid gap-4">
                  {v.map(([n, r]) => (
                    <li key={n}>
                      <span className="block text-xl font-medium leading-snug tracking-[-0.02em]">{n}</span>
                      {r && <span className="mt-0.5 block text-sm text-muted">{r}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <p data-fade className="mx-auto mt-14 max-w-4xl text-center text-3xl font-semibold leading-[1.15] tracking-[-0.035em] md:text-[2.7vw]">
          This wasn’t a redesign. Upstox had no NPS journey to improve, so the work was to define what it should be, understand the landscape, design it end to end and take it live.
        </p>
      </section>

      {/* ---------- 01 opportunity ---------- */}
      <section id="opportunity" className="mx-auto max-w-6xl px-4 py-24 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>01 · The opportunity</Eyebrow>
            <Heading className="mt-5">Retirement investing was a natural next step for Upstox</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            NPS gave Upstox a way to help customers plan for retirement and expand into a longer-term investment need. But it meant more than adding another product tile. A regulated, unfamiliar product had to make sense inside an app people already knew.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {REASONS.map(([k, v], i) => (
            <div key={k} data-fade data-delay={(i * 0.07).toFixed(2)} className="flex min-h-[13rem] flex-col justify-between rounded-[1.8rem] bg-white p-6">
              <span className="label">{k}</span>
              <p className="text-lg font-medium leading-snug tracking-[-0.02em]">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 02 ambition ---------- */}
      <section id="ambition" className="bg-[#121110] py-28 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <Eyebrow dark>02 · Setting the ambition</Eyebrow>
          <Heading className="mt-5 max-w-4xl">Before designing the first version, we defined what great could look like</Heading>
          <p data-fade className="mt-6 max-w-2xl text-white/60">
            We didn’t want to start with a list of screens. With the product manager, I worked through an 11-star exercise to map the ambition into stages: what a functional first release needed, what would make it more useful, and what a complete retirement experience could eventually offer.
          </p>
          <div className="mt-20 grid items-end gap-3 md:grid-cols-4">
            {STARS.map(([s, items], i) => (
              <div
                key={s}
                data-fade
                data-delay={(i * 0.07).toFixed(2)}
                className={`flex flex-col justify-between gap-10 rounded-[1.8rem] p-6 ${i === 3 ? "bg-white text-ink" : "bg-white/[0.07] ring-1 ring-white/10"}`}
                style={{ minHeight: `${13 + i * 3}rem` }}
              >
                <b className="text-5xl font-semibold tracking-[-0.04em]" style={{ color: i === 3 ? ORANGE : undefined }}>{s}</b>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {items.map((t) => (
                    <li key={t} className={i === 3 ? "text-muted" : "text-white/70"}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 03 landscape ---------- */}
      <section id="landscape" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1fr_1.35fr]">
          <div>
            <Eyebrow>03 · The existing landscape</Eyebrow>
            <h2 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">
              NPS had established players. The experience still felt fragmented.
            </h2>
            <p data-fade className="mt-6 text-muted">
              Before defining the Upstox journey, I looked at how people were already getting to NPS. Several Central Recordkeeping Agencies serve the market, with different portals and processes for opening and servicing an account.
            </p>
          </div>
          <div data-fade className="self-end overflow-x-auto rounded-[2rem] bg-white p-6 md:p-8">
            <div className="min-w-[480px]">
              <div className="label grid grid-cols-[1fr_1.1fr_1.3fr] gap-4 border-b border-line pb-4">
                <span>CRA</span>
                <span>Subscriber share, excl. APY</span>
                <span>New sign-ups</span>
              </div>
              {MARKET.map(([a, b, c]) => (
                <div key={a} className="grid grid-cols-[1fr_1.1fr_1.3fr] gap-4 border-b border-line py-5 text-[15px] last:border-0">
                  <span className="font-semibold">{a}</span>
                  <span>{b}</span>
                  <span className="text-muted">{c}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Mid-2025 figures, for context. The new sign-up numbers use different bases, so they don’t add up to one distribution.</p>
          </div>
        </div>
      </section>

      {/* ---------- 04 teardown ---------- */}
      <section className="bg-[#121110] py-28 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <Eyebrow dark>04 · First-hand teardown</Eyebrow>
              <Heading className="mt-5">I went through the existing journeys myself</Heading>
            </div>
            <p data-fade className="text-white/60 md:pb-2">
              I reviewed the Protean eNPS and KFintech journeys, the two record-keepers that serve almost the whole market, and completed eNPS registration myself. The point wasn’t to prove every step wrong. It was to see what someone is asked to know, decide and provide.
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-4">
            {TEARDOWN.map((t) => (
              <div key={t.name} data-fade className="rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-3xl font-semibold tracking-[-0.035em]">{t.name}</h3>
                  <span className="font-mono text-xs text-white/45">{t.kind}</span>
                </div>
                <CraJourney id={t.journey} />
                <div className="mt-6 overflow-x-auto">
                  <div className="min-w-[640px]">
                    <div className="label grid grid-cols-3 gap-6 border-b border-white/15 pb-3 !text-white/50">
                      <span>What the screen asks</span>
                      <span>What you need to understand</span>
                      <span>Why it can slow someone down</span>
                    </div>
                    {t.rows.map((r) => (
                      <div key={r[0]} className="grid grid-cols-3 gap-6 border-b border-white/10 py-4 text-[15px] last:border-0">
                        <span className="font-medium">{r[0]}</span>
                        <span className="text-white/65">{r[1]}</span>
                        <span className="text-white/65">{r[2]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 05 problem ---------- */}
      <section id="problem" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <Eyebrow>05 · The problem</Eyebrow>
        <Heading className="mt-5 max-w-4xl">The product had value. Getting started asked people to know too much.</Heading>
        <div className="mt-12 flex flex-wrap gap-2.5">
          {JARGON.map((j, i) => (
            <span
              key={j}
              data-fade
              data-delay={((i % 10) * 0.04).toFixed(2)}
              className="rounded-full bg-white px-4 py-2.5 text-[15px] shadow-[0_8px_24px_-18px_rgba(0,0,0,0.35)]"
              style={{ transform: `rotate(${((i * 37) % 7) - 3}deg)` }}
            >
              {j}
            </span>
          ))}
        </div>
        <p data-fade className="mt-12 max-w-3xl text-muted">
          Existing journeys often introduced these requirements before people had enough understanding to decide with confidence. The challenge wasn’t only the number of screens. It was how much unfamiliar information people had to process while completing a financial task.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-[1.15fr_1fr]">
          <div data-fade className="flex flex-col justify-between gap-12 rounded-[2rem] bg-[#121110] p-8 text-white md:p-10">
            <span className="label !text-white/55">Problem statement</span>
            <p className="text-3xl font-semibold leading-[1.12] tracking-[-0.035em] md:text-4xl">
              How might we make it easier for Upstox customers to understand NPS, make informed choices and open an account, without a separate, jargon-heavy process?
            </p>
          </div>
          <div data-fade data-delay="0.08" className="rounded-[2rem] bg-white p-8">
            <span className="label">The decisions behind it</span>
            <ul className="mt-5">
              {QUESTIONS.map(([d, q]) => (
                <li key={d} className="border-b border-line py-3.5 last:border-0">
                  <p className="font-semibold tracking-[-0.01em]">{d}</p>
                  <p className="mt-0.5 text-sm text-muted">{q}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">Design considerations from our emotion mapping, not verbatim research quotes.</p>
          </div>
        </div>
      </section>

      {/* ---------- 06 approach + principles ---------- */}
      <section id="design" className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>06 · The design approach</Eyebrow>
            <Heading className="mt-5">We designed around the decisions people needed to make</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            Instead of treating NPS as a form to complete, we organised the experience around what someone is trying to do.
          </p>
        </div>
        <ol data-fade className="mt-12 grid gap-2 sm:grid-cols-3 md:grid-cols-6">
          {INTENT.map((s, i) => (
            <li key={s} className="rounded-2xl bg-white p-4 text-sm font-medium leading-tight">
              <span className="mb-4 block font-mono text-[11px] text-muted">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- 07 testing version 1 ---------- */}
      <section id="testing" className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>07 · Testing the first version</Eyebrow>
            <Heading className="mt-5">We tested a short first version, and our assumptions didn’t hold</Heading>
          </div>
          <div data-fade className="grid gap-4 text-muted md:pb-2">
            <p>
              We had to launch before the financial year ended, so we built the first version fast and took it straight to the floor. We ran 12 sessions with users in the office, and took people from product management, tech, development and business through it too.
            </p>
            <p>Version 1 was built for speed: four steps to Invest, with education there only if people asked for it. What we learned went into the final version, which launched in March, before the end of tax season.</p>
          </div>
        </div>

        <div data-fade className="mt-14 rounded-[2.2rem] bg-[#121110] p-8 text-white md:p-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="label !text-white/55">Version 1 · four steps to Invest</span>
            <span className="text-sm text-white/55">12 sessions in the office</span>
          </div>
          <ol className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-8">
            {V1_PATH.map(([src, t, cap, long], i) => (
              <li key={src}>
                {long ? <ScrollShot src={src} alt={`Version 1, ${t}: ${cap}`} dark /> : <Shot src={src} alt={`Version 1, ${t}: ${cap}`} />}
                <p className={`flex items-center gap-2.5 text-sm ${long ? "mt-3" : "mt-[2.65rem]"}`}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white font-mono text-[10px] text-[#121110]">{i + 1}</span>
                  <span>
                    <b className="font-semibold">{t}</b>
                    <span className="text-white/55"> · {cap}</span>
                  </span>
                </p>
              </li>
            ))}
          </ol>
        </div>

        <h3 data-fade className="mt-20 text-2xl font-semibold tracking-[-0.03em]">What we assumed, and what we heard</h3>
        <div className="mt-6 grid gap-4">
          {ASSUMPTIONS.map((l, i) => (
            <article key={l.assumed} data-fade className="grid gap-10 rounded-[2.2rem] bg-white p-8 md:grid-cols-[1fr_auto] md:items-center md:gap-16 md:p-12">
              <div>
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 text-xl font-medium tracking-[-0.02em] text-muted md:text-2xl">We assumed</p>
                <h4 className="mt-1 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-4xl">{l.assumed}</h4>
                <dl className="mt-8 grid gap-5 text-[15px]">
                  <div>
                    <dt className="label">In version 1</dt>
                    <dd className="mt-1.5 text-muted">{l.v1}</dd>
                  </div>
                  <div className="border-t border-line pt-5">
                    <dt className="label">What we heard</dt>
                    <dd className="mt-1.5 text-lg font-medium leading-snug tracking-[-0.01em]">{l.heard}</dd>
                  </div>
                </dl>
              </div>
              <div className="mx-auto w-[15rem]">
                {l.shot[2] ? <ScrollShot src={l.shot[0]} alt={l.shot[1]} /> : <Shot src={l.shot[0]} alt={l.shot[1]} />}
              </div>
            </article>
          ))}

          <article data-fade className="rounded-[2.2rem] bg-[#121110] p-8 text-white md:p-12">
            <span className="font-mono text-xs text-white/50">05</span>
            <p className="mt-4 text-xl font-medium tracking-[-0.02em] text-white/55 md:text-2xl">Something we hadn’t planned for</p>
            <h4 className="mt-1 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-4xl">How does NPS compare?</h4>
            <p className="mt-6 max-w-2xl text-lg leading-snug text-white/75">
              Version 1 didn’t compare NPS with anything. People asked how it stacks up against PPF, the retirement product they already knew, and against putting the same ₹50,000 into equity themselves. They asked for a returns calculator.
            </p>
          </article>
        </div>
      </section>

      {/* ---------- 08 the final design ---------- */}
      <section id="final" className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>08 · The final design</Eyebrow>
            <Heading className="mt-5">What testing changed</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            Each finding became a change. The path to Invest got two steps longer, contribution and plan, because people wouldn’t decide without them.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CHANGES.map(([src, from, t, b, alt], i) => (
            <article key={src} data-fade data-delay={((i % 3) * 0.06).toFixed(2)} className="flex flex-col justify-between gap-8 rounded-[2.2rem] bg-white p-8">
              <div>
                <p className="flex items-center gap-2 text-xs font-medium text-muted">
                  <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden>·</span>
                  {from}
                </p>
                <h3 className="mt-4 text-2xl font-semibold leading-[1.1] tracking-[-0.03em]">{t}</h3>
                <p className="mt-3 text-[15px] text-muted">{b}</p>
              </div>
              <div className="mx-auto"><Shot src={src} alt={alt} width={220} /></div>
            </article>
          ))}

        </div>
      </section>

      {/* ---------- 09 decisions: the final design, under four principles ---------- */}
      <section id="decisions" className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>09 · Key design decisions</Eyebrow>
            <Heading className="mt-5">Four principles, six decisions</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            Testing set the direction. These are the decisions that shipped, each grouped under the principle behind it, with the reasoning that got it there.
          </p>
        </div>

        <ol data-fade className="mt-12 grid gap-px overflow-hidden rounded-[2rem] bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map(([t, b], i) => (
            <li key={t} className="bg-white p-6">
              <span className="flex items-center gap-2 text-sm font-semibold tracking-[-0.01em]">
                <i className="size-2 rounded-full" style={{ background: PRINCIPLE_TINTS[i] }} />
                {t}
              </span>
              <p className="mt-2 text-sm text-muted">{b}</p>
            </li>
          ))}
        </ol>

        <div className="mt-4 grid gap-4">
          {DECISIONS.map((d, i) => (
            <article key={d.title} data-fade className="grid grid-cols-1 items-center gap-10 rounded-[2.2rem] bg-white p-6 sm:p-8 md:grid-cols-[1fr_auto] md:gap-14 md:p-12">
              <div className={`min-w-0 ${i % 2 ? "md:order-2" : ""}`}>
                <p className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#F3F3F1] px-3 py-1 font-medium">
                    <i className="size-1.5 rounded-full" style={{ background: PRINCIPLE_TINTS[d.principle] }} />
                    {PRINCIPLES[d.principle][0]}
                  </span>
                </p>
                <h3 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-4xl">{d.title}</h3>
                <dl className="mt-8 grid gap-5 text-[15px]">
                  <div>
                    <dt className="label">Why</dt>
                    <dd className="mt-1.5 text-lg leading-snug tracking-[-0.01em]">{d.why}</dd>
                  </div>
                  <div className="border-t border-line pt-5">
                    <dt className="label">What we did</dt>
                    <dd className="mt-1.5 text-muted">{d.what}</dd>
                  </div>
                </dl>
                {"fields" in d && (
                  <div className="mt-8 max-w-md">
                    <div className="flex h-3 overflow-hidden rounded-full bg-[#F3F3F1]" aria-hidden>
                      <span className="bg-ink" style={{ width: `${(17 / 22) * 100}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-muted">17 of 22 fields known before the user types anything</p>
                  </div>
                )}
              </div>
              <div className={`mx-auto flex items-start gap-4 ${i % 2 ? "md:order-1" : ""}`}>
                {d.shots.map(([src, scroll, alt]) => {
                  // phones scale down on narrow screens so a pair fits the card
                  const w = d.shots.length > 1 ? "w-[min(200px,calc(50vw-48px))]" : "w-[min(240px,calc(100vw-120px))]";
                  return scroll ? <ScrollShot key={src} src={src} alt={alt} className={w} /> : <Shot key={src} src={src} alt={alt} className={w} />;
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- 10 experience: the whole flow, sideways ---------- */}
      <div id="experience">
        <HScroll
          className="bg-[#F3F3F1]"
          intro={
            <>
              <Eyebrow>10 · The experience</Eyebrow>
              <h2 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[3.6vw]">
                From discovery to portfolio, in one connected journey
              </h2>
              <p data-fade className="mt-6 max-w-sm text-muted">
                Twelve screens across six stages: discover, contribute, choose, set up, invest and track.
              </p>
            </>
          }
        >
          {FLOW.map(([stage, src, cap], i) => (
            <figure key={src} className="w-[62vw] shrink-0 sm:w-[36vw] md:w-[17vw]">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] text-bg">{i + 1}</span>
                <span className="text-sm leading-tight">
                  <b className="block font-semibold">{stage}</b>
                  <span className="text-muted">{cap}</span>
                </span>
              </div>
              {/* eager: lazy images would start loading mid-scrub, while the rail is pinned */}
              <Shot src={src} alt={cap} priority />
            </figure>
          ))}
        </HScroll>
      </div>

      {/* stories: the discover stage up close */}
      <section id="stories" className="mx-auto max-w-6xl px-4 py-24 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <h3 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">Up close: understanding NPS before the first rupee</h3>
          <p data-fade className="text-muted md:pb-2">
            Stories in the Discover stage cover what people want to know before they commit: what they save, how it works, when money comes out and what it earns.
          </p>
        </div>
        <div data-fade className="mt-16">
          <NpsStories />
        </div>
      </section>

      {/* prototype and branches */}
      <section id="prototype" className="mx-auto max-w-6xl px-4 py-24 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <h3 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">Try it, and flip the branches I designed</h3>
          <p data-fade className="text-muted md:pb-2">The real flow, built from the Figma designs. Set a scenario beside the phone to see what changes, or open it full screen.</p>
        </div>
        <div data-fade className="mt-10 hidden md:block">
          <NpsProtoEmbed url="/proto/nps/index.html" />
        </div>
        <div className="mt-10 flex justify-center md:hidden">
          <RollButton href="/proto/nps/index.html" label="Open the prototype" />
        </div>
      </section>

      {/* ---------- 11 launch ---------- */}
      <section id="results" className="px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>11 · The launch</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">NPS went live to all Upstox users</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            It launched in March 2025, before the end of tax season, and reached 100% of users, with organic discovery and no marketing push. The numbers so far.
          </p>
        </div>
        {/* one even 3×2 grid that fades in as a block, so no card lags behind the others */}
        <div data-fade className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["₹34.6 Cr", "assets under management"],
            ["96.4K", "NPS accounts created"],
            ["9.7L+", "orders completed"],
            ["Under 3 min", "from first tap to first contribution, 9× faster than Protean and other apps"],
            ["₹4.82 Cr", "total order amount"],
            ["₹16.66L", "account-opening fees collected"],
          ].map(([v, l], i) => (
            <div key={l} className={`relative flex min-h-56 flex-col justify-end overflow-hidden rounded-[2rem] p-8 ${i === 0 ? "bg-[#121110] text-white" : "bg-white"}`}>
              {i === 0 && <div aria-hidden className="absolute -left-20 -top-20 size-72 rounded-full opacity-50 blur-3xl" style={{ background: ORANGE }} />}
              <b data-count className="relative block whitespace-nowrap text-5xl font-semibold tracking-[-0.05em] md:text-6xl">{v}</b>
              <p className={`relative mt-2 ${i === 0 ? "text-white/65" : "text-muted"}`}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 10 beyond ---------- */}
      <section id="beyond" className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>12 · Beyond the first release</Eyebrow>
            <Heading className="mt-5">We launched at 7 stars, on purpose</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            Three weeks of design left little room, and missing tax season meant waiting another year for the people who needed NPS most. So we drew the line at 7★, cut what could wait, and planned the rest for after launch.
          </p>
        </div>

        <div data-fade className="mt-12 rounded-[2rem] bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold">Taking a regulated product live</p>
            <span className="text-sm text-muted">Presented to PFRDA with the product manager, at our Mumbai office</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
            {["Application", "Registration", "Security deposit", "POP licence", "CRA registration"].map((s, k) => (
              <div key={s} className="rounded-xl bg-[#F3F3F1] p-3">
                <p className="leading-tight">{s}</p>
                <p className="mt-1 text-muted">{["Jan", "Jan", "Feb", "Feb", "Mar"][k]} 2025</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <div data-fade className="rounded-[2rem] bg-white p-8 md:p-10">
            <span className="label">Shipped in March 2025</span>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Everything up to 7★</p>
            <p className="mt-2 text-muted">Enough for someone to understand NPS, invest for the tax benefit and keep track of it afterwards.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {STARS.slice(0, 3).map(([star, items]) => (
                <div key={star}>
                  <p className="text-lg font-semibold">{star}</p>
                  <ul className="mt-2 grid gap-1.5 text-sm text-muted">
                    {items.filter((t) => !t.startsWith("Everything")).map((t) => (
                      <li key={t} className="flex gap-2"><span aria-hidden className="text-[#14A363]">✓</span>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div data-fade className="rounded-[2rem] bg-ink p-8 text-white md:p-10">
            <span className="label !text-white/50">Held for after launch</span>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]" style={{ color: ORANGE }}>11★</p>
            <p className="mt-2 text-white/60">Once NPS was live and meeting the tax-season deadline was behind us, we had room to work these out properly.</p>
            <ul className="mt-8 grid gap-4">
              {[
                ["Corporate NPS", "Contributions made through an employer, alongside your own"],
                ["Account shifting", "Moving an existing NPS account to Upstox from another provider"],
              ].map(([t, d]) => (
                <li key={t} className="border-t border-white/15 pt-4">
                  <p className="font-semibold">{t}</p>
                  <p className="mt-1 text-sm text-white/60">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div data-fade className="mt-4 rounded-[2rem] bg-white p-8 md:p-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <span className="label">After launch</span>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">The 11★ flows, designed</p>
            </div>
            <p className="max-w-sm text-sm text-muted">The happy path of each, from the design file.</p>
          </div>
          <div className="mt-10 grid gap-12 sm:grid-cols-2">
            <FlowVideo
              src="/work/nps/video/corp.mp4?v=5"
              poster="/work/nps/video/corp-poster.jpg?v=5"
              title="Corporate NPS"
              caption="The employer’s email leads to Upstox, the corporate account links, and the new plan and holdings appear in Portfolio."
            />
            <FlowVideo
              src="/work/nps/video/shift.mp4?v=4"
              poster="/work/nps/video/shift-poster.jpg?v=4"
              title="Account shifting"
              caption="From a banner on Explore: enter the PRAN, confirm the transfer, and the existing holdings land in Portfolio."
            />
          </div>
        </div>

        <div className="mt-24 grid gap-10 md:grid-cols-[auto_1fr]">
          <span className="label md:pt-3">What I took away</span>
          <p data-scrub-words className="text-3xl font-semibold leading-[1.15] tracking-[-0.035em] md:text-[2.7vw]">
            Building NPS from zero meant making decisions before there was a product pattern to follow. The work wasn’t about removing every detail from a complex financial product. It was about deciding what people needed to understand at each step, what the product could handle in the background, and where transparency and control had to stay with the user.
          </p>
          <span className="label md:border-t md:border-line md:pt-10">Try it</span>
          <div data-fade className="flex items-center gap-4 border-t border-line pt-6">
            <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-[14px] text-xl text-white shadow-[inset_0_-6px_10px_rgba(0,0,0,0.18)]" style={{ background: "#5B2EBD" }}>₹</span>
            <p className="text-lg leading-snug">
              Live on Upstox. <span className="text-muted">Open the app, go to More, then NPS.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section className="relative overflow-hidden px-4 pb-10 pt-20 sm:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_auto]">
          <div>
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">
              Up next: Before Upstox
            </h2>
            <p data-fade className="mt-4 text-muted">Four products from my years at Tata CLiQ.</p>
            <div data-fade data-delay="0.1" className="mt-7">
              <RollButton href="/work/previous-work" label="Read the case" />
            </div>
          </div>
          <div data-fade className="mx-auto md:mr-16" data-parallax="-0.1">
            <div className="w-[300px] overflow-hidden rounded-[1.25rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/previous/palette-float.jpg" alt="Tata CLiQ Palette, the beauty homepage" width={2000} height={1250} loading="lazy" className="block aspect-square w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="label mx-auto mt-20 flex max-w-6xl justify-between">
          <span>Sal · Lead product designer, Upstox</span>
          <span>NPS · 2025</span>
        </div>
      </section>
    </Choreo>
  );
}
