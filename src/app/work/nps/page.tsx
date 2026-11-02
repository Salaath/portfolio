import type { Metadata } from "next";
import { Choreo } from "@/components/Choreo";
import { HScroll } from "@/components/HScroll";
import { RollButton } from "@/components/RollButton";
import { EmotionMap } from "@/components/nps/EmotionMap";
import { Faq } from "@/components/nps/Faq";
import { NpsHero } from "@/components/nps/NpsHero";
import { NpsStories } from "@/components/nps/NpsStories";
import { PhoneStage } from "@/components/nps/PhoneStage";
import { SectionPill } from "@/components/nps/SectionPill";
import { Shot } from "@/components/nps/Shot";

// Making NPS feel simple. Sources: the NPS PRD (upinvest-National Pension
// Scheme), the emotion mapping board in Figma (UP_NPS), the final prototype
// (served at /proto/nps, screens rendered to /work/nps) and the "Goal 01"
// doc for launch numbers. Competitor screenshots come from the PRD and are
// softened so no personal details are legible.

export const metadata: Metadata = { title: "Making NPS feel simple — Salaath Shaikh" };

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

function Pill({ from, to }: { from: string; to: string }) {
  return (
    <span
      aria-hidden
      className="mx-[0.1em] inline-block h-[0.78em] w-[1.7em] translate-y-[0.06em] rounded-full align-baseline shadow-[inset_0_-4px_8px_rgba(0,0,0,0.15)]"
      style={{ background: `linear-gradient(120deg, ${from}, ${to})` }}
    />
  );
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 data-split="lines" className={`text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-6xl ${className}`}>
      {children}
    </h2>
  );
}

// Everything a first-timer is asked to understand (PRD: asset classes, choices, tax, exit rules)
const JARGON = [
  "Tier I or Tier II?", "Active or Auto choice", "Aggressive, Moderate, Conservative", "Asset classes E, C, G, A",
  "Equity capped at 75% till 50", "10 pension fund managers", "Change plan 2× a year", "Change PFM 1× a year",
  "80CCD(1B): ₹50,000", "80CCD(2): up to ₹7.5 L", "Locked in till 60", "60% lump sum, 40% annuity",
  "5 annuity types", "3 partial withdrawals", "Max 25% of contributions", "PRAN, POP, CRA, PFM",
  "Units credited on day 4", "~30 kinds of charges", "FATCA declaration", "Parent’s name on PRAN",
];

const COMPETITORS = [
  {
    name: "eNPS",
    kind: "Government portal",
    img: "comp-enps",
    pains: ["Pick subscriber and account type before anything else", "Retype parents’ names, place of birth, identity proof", "Captcha, then an acknowledgement number to keep", "No in-app guidance, no visibility on charges"],
  },
  {
    name: "CAMS",
    kind: "CRA web journey",
    img: "comp-cams",
    pains: ["An 8-step wizard", "Upload a photo and a signature", "Type bank details and a FATCA declaration", "Pick a fund manager with no performance shown"],
  },
  {
    name: "Zerodha Coin",
    kind: "Broker, on web",
    img: "comp-coin",
    pains: ["A long profile form inside a modal", "Parents’ names, marital status, how you heard of NPS", "Nominee DOBs and percentages", "Plans as a table of numbers"],
  },
];

// Each worry from the emotion map, answered by a screen in the final design
const ANSWERS = [
  {
    worry: "How much should I invest? Am I getting the full tax benefit?",
    title: "Start from the tax saving",
    body: "Before any form, one question: how much this year? A slider lands on ₹50,000, the full 80CCD(1B) limit, and confirms the saving the moment you get there.",
    shot: "calc",
    alt: "Contribution sheet: how much are you planning to invest in NPS this year, ₹50,000, saving ₹15,600 in taxes",
  },
  {
    worry: "What are these plans? Should I be safe?",
    title: "A plan picked for your age",
    body: "Three lifecycle plans with risk and return ranges in plain words. At 29, Aggressive is suggested with a reason one tap away, and a custom plan respects the 75% equity cap.",
    shot: "plans",
    alt: "Plans sheet: Aggressive suggested for a 29-year-old, Moderate and Conservative with return ranges",
  },
  {
    worry: "Which provider should I pick? Who is better?",
    title: "Funds ranked for your amount",
    body: "Top NPS funds sorted by five-year CAGR for your amount and horizon, with returns and risk against the category and the corpus you’d have at maturity.",
    shot: "allFunds",
    alt: "Pick a fund manager: funds ranked by 5Y CAGR with maturity amount and risk vs category",
  },
  {
    worry: "How much will I get at maturity? Pension? Lump sum?",
    title: "See retirement as a number",
    body: "Every fund shows the corpus at maturity and the monthly pension it could pay, calculated for your age, so the long lock-in has a visible reward.",
    shot: "fund",
    alt: "Fund details: maturity amount ₹1.4 Cr and pension of ₹40,000 a month",
  },
  {
    worry: "Am I using the correct bank account? What am I agreeing to?",
    title: "Only ask what we don’t know",
    body: "KYC, bank and PAN already sit with Upstox, so the order asks for just a father’s and spouse’s name if missing. Review shows the total, delivery, NAV date and charges, with one consent to create the PRAN.",
    shot: "byReview",
    alt: "Review your plan: invest ₹50,000 in NPS, total ₹50,507, delivery 2–3 working days, consent to share details with CAMS",
  },
  {
    worry: "Has my money gone through? Is it growing enough?",
    title: "Status you can see, then a portfolio",
    body: "A live checklist from payment to PRAN to units allotted, then a portfolio with value, returns, maturity estimate, PRAN and tax proof in one place.",
    shot: "byStatus",
    alt: "Order status: payment confirmed, PRAN generated, order placed with pension fund",
  },
];

const FLOW = [
  ["more", "Discover NPS from More, next to tax tools"],
  ["calc", "Set this year’s contribution"],
  ["plans", "Choose a plan, suggested for your age"],
  ["customPlan", "Or customise within the rules"],
  ["exploreSeen", "Explore, with the tax meter on top"],
  ["allFunds", "Compare fund managers"],
  ["fund", "Fund details, maturity and pension"],
  ["buyAmount", "Enter an amount"],
  ["byPersonal", "Fill only what’s missing"],
  ["byReview", "Review, with charges and consent"],
  ["byStatus", "Track the order live"],
  ["pfInvest", "See it in Portfolio"],
] as const;

export default function NpsCase() {
  return (
    <Choreo className="bg-[#F3F3F1]">
      <SectionPill
        items={[
          ["Problem", "problem"],
          ["Others", "compare"],
          ["Feelings", "feelings"],
          ["Design", "design"],
          ["Try it", "prototype"],
          ["Results", "results"],
        ]}
      />

      <NpsHero />

      {/* statement */}
      <section className="px-4 pb-10 pt-16 text-center sm:px-10">
        <p data-scrub-words className="mx-auto max-w-5xl text-4xl font-semibold leading-[1.12] tracking-[-0.04em] md:text-[3.6vw]">
          NPS is one of India’s <Pill from={ORANGE} to="#FFB36B" /> best tax savers, and one of its <Pill from="#1c1b19" to="#6b6b66" /> hardest products to buy.
        </p>
        <p data-fade className="mt-10 text-muted">Who we designed for, from the PRD</p>
        <div data-fade data-delay="0.1" className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          {["Age 21–55", "₹500–₹1,000 a month", "Invests in PPF and FDs", "Wants the tax benefit"].map((t) => (
            <span key={t} className="rounded-full bg-white px-3 py-1 shadow-[0_6px_20px_-14px_rgba(0,0,0,0.3)]">{t}</span>
          ))}
        </div>
      </section>

      <PhoneStage />

      {/* ---------- 01 problem: the wall of jargon ---------- */}
      <section id="problem" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>01 · The problem</Eyebrow>
            <Heading className="mt-5">Everything you have to know before your first ₹500</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            Adoption was growing on its own: 2.3 crore accounts, up 25% in a year, and about ₹13 lakh crore under management. But opening an account meant learning a whole vocabulary first.
          </p>
        </div>

        <div className="mt-14 flex flex-wrap gap-2.5">
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

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ["“I want to save taxes, and plan retirement with good returns.”", "What they came for"],
            ["“The account opening process is so lengthy.”", "What they hit"],
            ["“I can’t tell which plan fits my risk, or what the charges are.”", "Where they gave up"],
          ].map(([q, l], i) => (
            <div key={l} data-fade data-delay={(i * 0.08).toFixed(2)} className={`rounded-[2rem] p-7 ${i === 2 ? "bg-[#121110] text-white" : "bg-white"}`}>
              <span className={`label ${i === 2 ? "!text-white/55" : ""}`}>{l}</span>
              <p className="mt-6 text-xl font-medium leading-snug tracking-[-0.02em]">{q}</p>
            </div>
          ))}
        </div>
        <p data-fade className="mt-4 text-sm text-muted">Customer problems as listed in the PRD, paraphrased.</p>
      </section>

      {/* ---------- 02 compared to other places ---------- */}
      <section id="compare" className="bg-[#121110] py-28 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <Eyebrow dark>02 · How everyone else does it</Eyebrow>
              <Heading className="mt-5">Forms first, decisions later, help never</Heading>
            </div>
            <p data-fade className="text-white/60 md:pb-2">
              I walked through account opening on the government portal, the CRA and other brokers. Every one of them started by asking for things you already gave when you did your KYC.
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-4">
            {COMPETITORS.map((c, i) => (
              <div key={c.name} data-fade data-delay="0.05" className="grid gap-6 rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10 md:grid-cols-[1.6fr_1fr] md:p-8">
                <figure data-wipe className="overflow-hidden rounded-2xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img data-wipe-inner src={`/work/nps/${c.img}.jpg`} alt={`${c.name} account opening screens, blurred`} loading="lazy" className="block h-[16rem] w-full object-cover object-top md:h-[19rem]" />
                </figure>
                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <span className="font-mono text-xs text-white/45">{String(i + 1).padStart(2, "0")} · {c.kind}</span>
                    <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">{c.name}</h3>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {c.pains.map((p) => (
                      <li key={p} className="flex gap-3 text-[15px] text-white/75">
                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#F0443A] text-[10px] text-white">✕</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* the one good app, and what we took from it */}
          <div data-fade className="mt-4 grid items-center gap-8 rounded-[2rem] bg-white p-6 text-ink md:grid-cols-[1fr_1.3fr] md:p-10">
            <div>
              <span className="label">04 · The best of the apps</span>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">ET Money got closest</h3>
              <p className="mt-3 text-muted">
                A mobile-first flow that nudges a plan by investment horizon and leads with the tax saving. But you pick a fund before you understand plans, returns lead every card, and charges stay out of sight.
              </p>
              <p className="mt-5 font-medium">What we kept: tax first, a suggested plan. What we changed: plan before fund, and every charge shown before you pay.</p>
            </div>
            <figure className="overflow-hidden rounded-2xl bg-[#F3F3F1] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/nps/comp-etmoney.jpg" alt="ET Money NPS screens: fund cards and investment plan sheet" loading="lazy" className="mx-auto block max-h-[26rem] w-auto" />
            </figure>
          </div>

          {/* how Upstox compares */}
          <div className="mt-16 overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="label grid grid-cols-[1.8fr_repeat(4,1fr)] gap-4 border-b border-white/15 pb-4 !text-white/50">
                <span />
                <span>eNPS</span>
                <span>CAMS</span>
                <span>Coin</span>
                <span className="!text-white">Upstox</span>
              </div>
              {[
                ["Reuses your existing KYC", "✕", "✕", "Partly", "✓"],
                ["Starts from your tax saving", "✕", "✕", "✕", "✓"],
                ["Suggests a plan for your age", "✕", "✕", "✕", "✓"],
                ["Shows fund performance before you pick", "✕", "✕", "✕", "✓"],
                ["Shows every charge before you pay", "✕", "✕", "✓", "✓"],
                ["Explains NPS along the way", "✕", "Partly", "✕", "✓"],
              ].map((r) => (
                <div key={r[0]} data-fade className="grid grid-cols-[1.8fr_repeat(4,1fr)] gap-4 border-b border-white/10 py-4 text-[15px]">
                  {r.map((c, j) => (
                    <span key={j} className={j === 0 ? "text-white/80" : j === 4 ? "font-semibold" : ""} style={c === "✓" ? { color: "#36D399" } : c === "✕" ? { color: "rgba(255,255,255,0.3)" } : undefined}>
                      {c}
                    </span>
                  ))}
                </div>
              ))}
              <p className="mt-4 text-sm text-white/45">Based on the competitor walkthroughs in the PRD, early 2024.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 03 emotion map ---------- */}
      <section id="feelings" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>03 · Emotion mapping</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">The flow was simple. The feelings weren’t.</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            Before designing screens, I mapped what people need, what worries them and how they should feel at each stage of the journey.
          </p>
        </div>
        <div className="mt-12">
          <EmotionMap />
        </div>
      </section>

      {/* ---------- 04 every worry, answered ---------- */}
      <section id="design" className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>04 · The design</Eyebrow>
            <Heading className="mt-5">One screen for every worry</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            The final flow is ordered by the questions people ask in their heads, not by the fields the PRAN form needs.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-6">
          {ANSWERS.map((a, i) => (
            <div key={a.shot} className={`grid items-center gap-10 rounded-[2.4rem] bg-white p-6 md:grid-cols-2 md:p-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")} / 06</span>
                <p data-fade className="mt-5 rounded-2xl bg-[#121110] px-5 py-4 text-lg leading-snug text-white" style={{ borderBottomLeftRadius: 4 }}>
                  “{a.worry}”
                </p>
                <h3 data-split="lines" className="mt-8 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">{a.title}</h3>
                <p data-fade className="mt-3 max-w-md text-muted">{a.body}</p>
              </div>
              <div data-fade className="relative mx-auto">
                <div aria-hidden className="absolute inset-x-0 bottom-0 top-10 rounded-full opacity-50 blur-3xl" style={{ background: i % 2 ? "#C9B8F5" : "#FFD3BD" }} />
                <div data-parallax={i % 2 ? "-0.06" : "0.06"} className="relative">
                  <Shot src={a.shot} alt={a.alt} width={270} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- truths of NPS, as stories ---------- */}
      <section id="stories" className="mx-auto max-w-6xl px-4 py-24 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>Before the first rupee</Eyebrow>
            <Heading className="mt-5">Four truths of NPS, in four taps</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            Stories on the More page answer what people want to know before they commit: what they save, how it works, when money comes out, and what it earns. Redrawn here with one idea and one number per story.
          </p>
        </div>
        <div data-fade className="mt-16">
          <NpsStories />
        </div>
      </section>

      {/* ---------- the whole flow, sideways ---------- */}
      <div id="flow">
        <HScroll
          className="bg-[#F3F3F1]"
          intro={
            <>
              <Eyebrow>The full flow</Eyebrow>
              <h2 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[3.6vw]">
                From More to Portfolio, in twelve screens
              </h2>
              <p data-fade className="mt-6 max-w-sm text-muted">
                Discovery, contribution, plan, fund, order and tracking, with the PRAN created in the background from details Upstox already has.
              </p>
            </>
          }
        >
          {FLOW.map(([src, cap], i) => (
            <figure key={src} className="w-[62vw] shrink-0 sm:w-[36vw] md:w-[17vw]">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-ink font-mono text-[11px] text-bg">{i + 1}</span>
                <span className="text-sm font-medium leading-tight">{cap}</span>
              </div>
              <Shot src={src} alt={cap} />
            </figure>
          ))}
        </HScroll>
      </div>

      {/* ---------- 05 try it ---------- */}
      <section id="prototype" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>05 · Try it</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">Play with the final prototype</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            The real flow, built from the Figma designs. Tap through it, or flip the switches on the left to try other branches: no nominee, married, a failed payment.
          </p>
        </div>
        <div data-fade className="mt-12 hidden overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)] ring-1 ring-black/5 md:block">
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

      {/* ---------- 06 behind the launch ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <Eyebrow>06 · Behind the launch</Eyebrow>
            <Heading className="mt-5">Scoping an 11-star NPS</Heading>
          </div>
          <p data-fade className="text-muted md:pb-2">
            With the product manager, we described what a 3-star, 5-star, 7-star and 11-star NPS would look like, then shipped the core and lined up the rest.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {[
            ["3★", ["Tier I opening and investing", "Charges visible", "Plan selection"]],
            ["5★", ["Tier I and II", "Education on investing right", "NPS calculator"]],
            ["7★", ["Statements and holdings", "Everything in 5★"]],
            ["11★", ["Account shifting", "Withdrawals", "Subscriber services: address, nominee"]],
          ].map(([s, items], i) => (
            <div key={s as string} data-fade data-delay={(i * 0.07).toFixed(2)} className={`flex min-h-[15rem] flex-col justify-between rounded-[1.8rem] p-6 ${i === 3 ? "bg-[#121110] text-white" : "bg-white"}`} style={{ transform: `translateY(${(3 - i) * 14}px)` }}>
              <b className="text-4xl font-semibold tracking-[-0.04em]" style={{ color: i === 3 ? ORANGE : undefined }}>{s}</b>
              <ul className="flex flex-col gap-1.5 text-sm">
                {(items as string[]).map((t) => (
                  <li key={t} className={i === 3 ? "text-white/75" : "text-muted"}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-6">
          <div data-fade className="relative overflow-hidden rounded-[2rem] bg-[#121110] p-8 text-white md:col-span-4">
            <div aria-hidden className="absolute -bottom-32 -right-10 size-96 rounded-full opacity-40 blur-3xl" style={{ background: "#7B3FF2" }} />
            <span className="label !text-white/55">Winning the licence</span>
            <h3 className="relative mt-3 max-w-lg text-3xl font-semibold leading-tight tracking-[-0.035em]">
              PFRDA came to our Mumbai office. We showed them the flow.
            </h3>
            <p className="relative mt-3 max-w-lg text-white/65">
              To become a Point of Presence, Upstox needed a PFRDA licence. The product manager and I presented the account opening and fund buying experience to the authorities.
            </p>
            <div className="relative mt-8 grid grid-cols-5 gap-2 text-xs">
              {["Application", "Registration", "Security deposit", "POP licence", "CRA registration"].map((s, k) => (
                <div key={s} className="rounded-xl bg-white/[0.07] p-3 ring-1 ring-white/10">
                  <span className="grid size-6 place-items-center rounded-full bg-[#14A363] text-[10px]">✓</span>
                  <p className="mt-3 leading-tight text-white/75">{s}</p>
                  <p className="mt-1 text-white/40">{["Jan", "Jan", "Feb", "Feb", "Mar"][k]} 2024</p>
                </div>
              ))}
            </div>
          </div>
          <div data-fade data-delay="0.08" className="flex flex-col justify-between rounded-[2rem] bg-white p-8 md:col-span-2">
            <div>
              <span className="label">Already have NPS?</span>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">Shift your PRAN in</h3>
              <p className="mt-2 text-sm text-muted">
                A POP-shift flow that fetches details wherever possible. People with a non-CAMS NPS never see an option they can’t use.
              </p>
            </div>
            <p className="mt-6 rounded-2xl bg-[#F3F3F1] p-4 text-sm">Enter a 12-digit PRAN, confirm, then land in Portfolio to track it.</p>
          </div>
        </div>
      </section>

      {/* ---------- results ---------- */}
      <section id="results" className="px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>Real launch, real numbers</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">Live to everyone, with zero marketing</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            NPS went live to 100% of users on 7 February 2025 after several rounds of testing. Purely organic discovery did the rest. Numbers as of 7 March 2025.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
          <div data-fade className="relative overflow-hidden rounded-[2rem] bg-[#121110] p-8 text-white md:row-span-2">
            <div aria-hidden className="absolute -left-20 -top-20 size-80 rounded-full opacity-50 blur-3xl" style={{ background: ORANGE }} />
            <span className="label relative !text-white/55">In the first month</span>
            <b data-count className="relative mt-16 block text-[5.5rem] font-semibold leading-none tracking-[-0.06em]">₹19.7 L</b>
            <p className="relative mt-3 text-white/65">total AUM, from accounts nobody was pushed to open</p>
          </div>
          {[
            ["124", "NPS accounts created"],
            ["156", "orders completed, open or placed"],
            ["₹18.95 L", "total order amount"],
            ["₹24,800", "account opening fees collected"],
          ].map(([v, l], i) => (
            <div key={l} data-fade data-delay={((i % 2) * 0.08).toFixed(2)} className="rounded-[2rem] bg-white p-8">
              <b data-count className="block text-5xl font-semibold tracking-[-0.05em]">{v}</b>
              <p className="mt-2 text-muted">{l}</p>
            </div>
          ))}
        </div>
        <p data-fade className="mx-auto mt-8 max-w-6xl text-center text-sm text-muted">
          Plus ₹4,680 in contribution fees. With only a few brokers licensed for NPS, marketing and cross-sell are the next lever.
        </p>
      </section>

      {/* ---------- team ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-10">
        <div data-fade className="grid gap-6 rounded-[2rem] bg-white p-8 md:grid-cols-[1fr_2fr] md:items-center">
          <div>
            <span className="label">The team</span>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Small team, full launch</p>
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

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-10 md:grid-cols-[1fr_1.5fr]">
        <div>
          <Eyebrow>Common questions</Eyebrow>
          <h2 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">
            The decisions, asked and answered
          </h2>
          <div data-fade className="mt-10 rounded-[2rem] bg-white p-6">
            <span className="grid size-10 place-items-center rounded-full font-semibold text-white" style={{ background: ORANGE }}>?</span>
            <p className="mt-4 text-lg font-semibold">Want the full walkthrough?</p>
            <p className="mt-1 text-sm text-muted">Figma files and the PRD, on request.</p>
            <div className="mt-5">
              <RollButton href="/#contact" label="Get in touch" />
            </div>
          </div>
        </div>
        <Faq
          items={[
            ["Why start with the contribution, not the account?", "People come to NPS for the tax saving. Asking “how much this year?” first anchors the whole flow on that benefit, and ₹50,000 maps to the full 80CCD(1B) deduction."],
            ["How is the PRAN created without a long form?", "Of the 22 fields a PRAN needs, 17 already sit with Upstox from KYC. The order only asks for what’s missing, like a father’s or spouse’s name, then one consent shares the rest with CAMS."],
            ["Why suggest a plan by age?", "Most first-time investors can’t judge how much equity suits them. Suggesting a lifecycle plan for their age, with the reason one tap away, removes the hardest decision without hiding the choice."],
            ["Why choose a plan before a fund manager?", "Competitors start with fund cards and returns, before people understand plans. Plan first means fund comparisons are shown for the plan you’ll actually hold."],
            ["What about people with an NPS elsewhere?", "A POP-shift flow lets them enter their 12-digit PRAN and move to Upstox. Those whose NPS can’t be migrated online never see the option, which avoids a dead end."],
          ]}
        />
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
