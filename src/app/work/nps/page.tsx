import type { Metadata } from "next";
import { Choreo } from "@/components/Choreo";
import { HScroll } from "@/components/HScroll";
import { RollButton } from "@/components/RollButton";
import { NpsHero } from "@/components/nps/NpsHero";
import { NpsStories } from "@/components/nps/NpsStories";
import { SectionPill } from "@/components/nps/SectionPill";
import { Shot } from "@/components/nps/Shot";

// Building NPS from 0 to 1: the storytelling revision, following the page order
// in NPS_revised_case_study_storytelling.pdf. Market figures are user-supplied
// mid-2026 data. Dashed "To add" boxes mark what the blueprint says must come
// from Sal, and should go before this version is published.

export const metadata: Metadata = { title: "Building NPS from 0 to 1 — Salaath Shaikh" };

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

function ToAdd({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div data-fade className={`rounded-[1.6rem] border border-dashed p-6 ${dark ? "border-white/30 text-white/70" : "border-black/25 text-muted"}`}>
      <span className={`label ${dark ? "!text-white/50" : ""}`}>To add before publishing</span>
      <p className="mt-2 max-w-3xl text-[15px]">{children}</p>
    </div>
  );
}

const FACTS = [
  ["Product", "National Pension System (NPS)"],
  ["Role", "Lead Product Designer"],
  ["Scope", "0-to-1 product experience"],
  ["Launch", "7 February 2025"],
];

const REASONS = [
  ["For customers", "Help people plan and secure their retirement."],
  ["For the product", "Expand what Upstox offers into a longer-term investment need."],
  ["For access", "Cut the clutter around retirement planning with a simpler way in."],
  ["For the relationship", "Build a longer-term engagement with investors."],
];

const STARS: [string, string[]][] = [
  ["3★", ["Tier I opening and investing", "Charges visible", "Plan selection"]],
  ["5★", ["Tier I and II", "Education on investing right", "NPS calculator"]],
  ["7★", ["Statements and holdings", "Everything in 5★"]],
  ["11★", ["Account shifting", "Withdrawals", "Subscriber services: address, nominee"]],
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
    img: "comp-enps",
    rows: [
      ["Subscriber and account type, before anything else", "What the account types mean, and which one applies to you", "A product decision arrives before the product has been explained"],
      ["Parents’ names, place of birth and identity proof", "Which details have to match your documents", "A long form to get through before you’ve seen what you’re getting"],
      ["A captcha, then an acknowledgement number to keep", "That the number matters for what comes next", "Keeping track of the process is left to the user"],
    ],
  },
  {
    name: "CAMS",
    kind: "An 8-step web wizard",
    img: "comp-cams-forms",
    rows: [
      ["A photo and a signature upload", "What’s needed, and having both files to hand", "Getting the files means stepping out of the flow"],
      ["Bank details and a FATCA declaration", "What FATCA is and how to answer it", "A compliance term appears in the middle of a financial task"],
      ["A choice of pension fund manager", "How managers differ from one another", "No performance is shown at the point of choosing"],
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

const BRANCHES = [
  ["Has NPS investments", "NPS opens on Portfolio with holdings. Without any, Portfolio shows the zero-holdings state."],
  ["Nominee already added", "The buy flow skips the step. If there’s no nominee, it asks for the details."],
  ["Married", "The flow asks for spouse details before review."],
  ["Payment outcome", "Success, processing and failed each get their own order state."],
];

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
          ["Experience", "experience"],
          ["Launch", "results"],
        ]}
      />

      <NpsHero />

      {/* ---------- role ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-16 sm:px-10">
        <div className="grid gap-px overflow-hidden rounded-[2rem] bg-black/10 sm:grid-cols-2 md:grid-cols-4">
          {FACTS.map(([k, v]) => (
            <div key={k} className="bg-white p-7">
              <span className="label">{k}</span>
              <p className="mt-6 text-xl font-medium leading-snug tracking-[-0.02em]">{v}</p>
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
            <p className="mt-4 text-sm text-muted">Mid-2026 figures, for context. The new sign-up numbers use different bases, so they don’t add up to one distribution.</p>
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
              I reviewed the Protean eNPS and CAMS journeys, the two I examined in detail, and completed eNPS registration myself. The point wasn’t to prove every step wrong. It was to see what someone is asked to know, decide and provide.
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-4">
            {TEARDOWN.map((t) => (
              <div key={t.name} data-fade className="rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-3xl font-semibold tracking-[-0.035em]">{t.name}</h3>
                  <span className="font-mono text-xs text-white/45">{t.kind}</span>
                </div>
                <figure data-wipe className="mt-6 overflow-hidden rounded-2xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img data-wipe-inner src={`/work/nps/${t.img}.jpg`} alt={`${t.name} account opening screens, blurred`} loading="lazy" className="block h-[14rem] w-full object-cover object-top md:h-[18rem]" />
                </figure>
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
            <ToAdd dark>High-resolution, chronological screenshots of your eNPS walkthrough and the CAMS review, to replace these blurred images. Check each annotation against what the screens actually show.</ToAdd>
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

        <h3 data-fade className="mt-20 text-2xl font-semibold tracking-[-0.03em]">Four principles shaped the experience</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {PRINCIPLES.map(([t, b, s, alt], i) => (
            <div key={t} data-fade data-delay={(i * 0.07).toFixed(2)}>
              <Shot src={s} alt={alt} />
              <p className="mt-6 text-lg font-semibold leading-tight tracking-[-0.02em]">{t}</p>
              <p className="mt-2 text-[15px] text-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 07 decisions ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <Eyebrow>07 · Key design decisions</Eyebrow>
        <Heading className="mt-5">Six decisions shaped the first version</Heading>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div data-fade className="grid items-center gap-8 overflow-hidden rounded-[2.2rem] bg-[#121110] p-8 text-white md:col-span-2 md:grid-cols-[1.2fr_1fr] md:p-12">
            <div>
              <span className="font-mono text-xs text-white/50">01</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">Start with contribution and tax context</h3>
              <p className="mt-4 max-w-md text-white/65">People often arrive at NPS for the tax benefit. So before any form, one question: how much this year? A slider lands on ₹50,000, the 80CCD(1B) limit, and shows the saving as you get there.</p>
            </div>
            <div className="mx-auto md:-mb-32" data-parallax="0.06"><Shot src="calc" alt="Contribution sheet: how much are you planning to invest in NPS this year" width={280} /></div>
          </div>

          <div data-fade className="flex flex-col justify-between gap-8 rounded-[2.2rem] bg-white p-8">
            <div>
              <span className="font-mono text-xs text-muted">02</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">Suggest a plan, explain why</h3>
              <p className="mt-3 text-muted">Age is the input for a suggested starting plan. At 29, that’s Aggressive, with the reason one tap away and a clear way to review or customise.</p>
            </div>
            <div className="mx-auto"><Shot src="plans" alt="Plans sheet: Aggressive suggested for a 29-year-old" width={250} /></div>
          </div>
          <div data-fade data-delay="0.08" className="flex flex-col justify-between gap-8 rounded-[2.2rem] bg-white p-8">
            <div>
              <span className="font-mono text-xs text-muted">03</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">Make fund selection easier to compare</h3>
              <p className="mt-3 text-muted">Funds sorted by five-year CAGR for your amount and horizon, with returns and risk against the category and the corpus at maturity, all in one list.</p>
            </div>
            <div className="mx-auto"><Shot src="allFunds" alt="Fund managers ranked by 5Y CAGR with maturity amount and risk vs category" width={250} /></div>
          </div>

          <div data-fade className="grid items-center gap-8 rounded-[2.2rem] bg-white p-8 md:col-span-2 md:grid-cols-[auto_1fr] md:gap-16 md:p-12">
            <div className="mx-auto"><Shot src="byPersonal" alt="Personal details: only the fields Upstox doesn’t already have" width={250} /></div>
            <div>
              <span className="font-mono text-xs text-muted">04</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">Reduce repeated account setup</h3>
              <p className="mt-4 max-w-lg text-muted">Of the 22 fields a PRAN needs, 17 already sit with Upstox from KYC. The order asks only for what’s missing, like a father’s or spouse’s name, and the PRAN is created in the background.</p>
              <div className="mt-8 flex h-3 max-w-lg overflow-hidden rounded-full bg-[#F3F3F1]" aria-hidden>
                <span className="bg-ink" style={{ width: `${(17 / 22) * 100}%` }} />
              </div>
              <p className="mt-2 max-w-lg text-sm text-muted">17 of 22 fields known before the user types anything</p>
            </div>
          </div>

          <div data-fade className="flex flex-col justify-between gap-8 rounded-[2.2rem] bg-white p-8">
            <div>
              <span className="font-mono text-xs text-muted">05</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">Make charges and consent clear</h3>
              <p className="mt-3 text-muted">Review shows the applicable charges and total before confirmation, with one consent right next to what it covers.</p>
            </div>
            <div className="mx-auto"><Shot src="byReview" alt="Review: invest ₹50,000, total ₹50,507, with consent to share details with CAMS" width={250} /></div>
          </div>
          <div data-fade data-delay="0.08" className="flex flex-col justify-between gap-8 rounded-[2.2rem] bg-white p-8">
            <div>
              <span className="font-mono text-xs text-muted">06</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">Make the post-payment state useful</h3>
              <p className="mt-3 text-muted">A live checklist from payment to PRAN to units allotted, then a portfolio people can come back to.</p>
            </div>
            <div className="mx-auto flex gap-3">
              <Shot src="byStatus" alt="Order status: payment confirmed, PRAN generated, order placed" width={190} />
              <Shot src="pfInvest" alt="NPS portfolio with value, returns and holdings" width={190} className="mt-8" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ToAdd>Check the tax copy, minimum contribution, charges, PRAN behaviour and plan logic in these six against the shipped product.</ToAdd>
        </div>
      </section>

      {/* ---------- 08 experience: the whole flow, sideways ---------- */}
      <div id="experience">
        <HScroll
          className="bg-[#F3F3F1]"
          intro={
            <>
              <Eyebrow>08 · The experience</Eyebrow>
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
              <Shot src={src} alt={cap} />
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
          <p data-fade className="text-muted md:pb-2">The real flow, built from the Figma designs. Use the switches on the left to see what changes.</p>
        </div>
        <div className="mt-10 grid gap-x-8 md:grid-cols-2">
          {BRANCHES.map(([k, v]) => (
            <div key={k} data-fade className="border-t border-black/10 py-4">
              <p className="font-semibold">{k}</p>
              <p className="mt-1 text-[15px] text-muted">{v}</p>
            </div>
          ))}
        </div>
        <div data-fade className="mt-8 hidden overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)] ring-1 ring-black/5 md:block">
          <iframe
            src="/proto/nps/index.html"
            title="Upstox NPS interactive prototype"
            loading="lazy"
            className="block h-[clamp(560px,calc(100svh-10rem),860px)] w-full"
          />
        </div>
        <div className="mt-10 flex justify-center md:hidden">
          <RollButton href="/proto/nps/index.html" label="Open the prototype" />
        </div>
      </section>

      {/* ---------- 09 launch ---------- */}
      <section id="results" className="px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>09 · The launch</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">NPS went live to all Upstox users</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            It launched on 7 February 2025 and reached 100% of users, with organic discovery and no marketing push. A snapshot of the first month, as of 7 March 2025.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-12">
          <div data-fade className="relative overflow-hidden rounded-[2rem] bg-[#121110] p-8 text-white md:col-span-6">
            <div aria-hidden className="absolute -left-20 -top-20 size-80 rounded-full opacity-50 blur-3xl" style={{ background: ORANGE }} />
            <b data-count className="relative mt-10 block text-[5.5rem] font-semibold leading-none tracking-[-0.06em]">₹19.7 L</b>
            <p className="relative mt-3 text-white/65">AUM, from accounts nobody was pushed to open</p>
          </div>
          {[
            ["124", "NPS accounts created", 3],
            ["156", "orders completed, open or placed", 3],
            ["₹18.95 L", "total order amount", 4],
            ["₹24,800", "account-opening fees collected", 4],
            ["₹4,680", "contribution fees", 4],
          ].map(([v, l, c]) => (
            <div key={l as string} data-fade className={`flex flex-col justify-end rounded-[2rem] bg-white p-8 ${c === 3 ? "md:col-span-3" : "md:col-span-4"}`}>
              <b data-count className="block text-5xl font-semibold tracking-[-0.05em]">{v}</b>
              <p className="mt-2 text-muted">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 10 beyond ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>10 · Beyond the first release</Eyebrow>
            <Heading className="mt-5">The first launch was a foundation, not the full ambition</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            The 11-star exercise gave the team a way to think past the first release, and to keep the longer-term retirement experience in view.
          </p>
        </div>
        <div className="mt-12">
          <ToAdd>A clear split of what shipped in the first release and what was scoped for later, mapped onto the 3★ to 11★ stages.</ToAdd>
        </div>

        <div data-fade className="mt-4 rounded-[2rem] bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold">Taking a regulated product live</p>
            <span className="text-sm text-muted">Presented to PFRDA with the product manager, at our Mumbai office</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
            {["Application", "Registration", "Security deposit", "POP licence", "CRA registration"].map((s, k) => (
              <div key={s} className="rounded-xl bg-[#F3F3F1] p-3">
                <p className="leading-tight">{s}</p>
                <p className="mt-1 text-muted">{["Jan", "Jan", "Feb", "Feb", "Mar"][k]} 2024</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-10 md:grid-cols-[auto_1fr]">
          <span className="label md:pt-3">What I took away</span>
          <p data-scrub-words className="text-3xl font-semibold leading-[1.15] tracking-[-0.035em] md:text-[2.7vw]">
            Building NPS from zero meant making decisions before there was a product pattern to follow. The work wasn’t about removing every detail from a complex financial product. It was about deciding what people needed to understand at each step, what the product could handle in the background, and where transparency and control had to stay with the user.
          </p>
        </div>
        <div className="mt-12">
          <ToAdd>One or two concrete trade-offs you led: a decision you challenged, a constraint you negotiated with engineering or compliance, or where the 11-star ambition met launch requirements.</ToAdd>
        </div>
      </section>

      {/* ---------- credits ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-10">
        <div data-fade className="grid gap-6 rounded-[2rem] bg-white p-8 md:grid-cols-[1fr_2fr] md:items-center">
          <div>
            <span className="label">Credits</span>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">A cross-functional launch</p>
            <p className="mt-2 text-sm text-muted">Product, engineering, compliance, operations and partner teams: names to add.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["S", "Salaath", "Led end-to-end design, production-ready files and VQA", ORANGE],
              ["G", "Gitika", "Detail pages and the withdrawal flow", "#7B3FF2"],
              ["K", "Kritima", "UI review", "#14A363"],
            ].map(([i, n, r, c]) => (
              <div key={n} className="rounded-2xl bg-[#F3F3F1] p-4">
                <span className="grid size-10 place-items-center rounded-full font-semibold text-white" style={{ background: c }}>{i}</span>
                <p className="mt-3 font-semibold">{n}</p>
                <p className="text-sm text-muted">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- closing ---------- */}
      <section className="relative overflow-hidden px-4 pb-10 pt-20 sm:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">
              Up next: Upstox Loans
            </h2>
            <p data-fade className="mt-4 text-muted">Money in two hours, designed three times over.</p>
            <div data-fade data-delay="0.1" className="mt-7">
              <RollButton href="/work/personal-loans" label="Read the case" />
            </div>
          </div>
          <div data-fade className="mx-auto" data-parallax="-0.1">
            <Shot src="pfJustOrdered" alt="NPS portfolio right after investing: account created, order in progress" width={250} />
          </div>
          <div data-fade data-delay="0.15" className="rounded-[2rem] bg-white p-6 md:justify-self-end">
            <p className="text-lg font-semibold">Live on Upstox</p>
            <p className="mt-1 text-sm text-muted">Open the app, go to More, then NPS.</p>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F3F3F1] p-3">
              <span className="grid size-14 place-items-center rounded-2xl text-2xl font-semibold text-white shadow-[inset_0_-6px_10px_rgba(0,0,0,0.18)]" style={{ background: "#5B2EBD" }}>₹</span>
              <span className="text-sm">
                <b className="block">More → NPS</b>
                <span className="text-muted">Upstox app</span>
              </span>
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
