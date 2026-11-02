import Link from "next/link";
import type { Metadata } from "next";
import { cases } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { HScroll } from "@/components/HScroll";
import { RollButton } from "@/components/RollButton";
import { Faq } from "@/components/nps/Faq";
import { SectionPill } from "@/components/nps/SectionPill";
import { EmotionJourney } from "@/components/loans/EmotionJourney";
import { FlowTrack } from "@/components/loans/FlowTrack";
import { IaSwitch } from "@/components/loans/IaSwitch";
import { LOANS_IMG, LoansPhone } from "@/components/loans/LoansPhone";
import { OfferEngine } from "@/components/loans/OfferEngine";
import { Rounds } from "@/components/loans/Rounds";

// Upstox Loans: pre-approved personal loans, launched as a separate app.
// Sources: the "Launching pre-approved loans" deck, the self review (impact
// numbers, to be refreshed), and the UP_Loans Figma file, whose frames are
// rendered to /public/work/loans (prototype at /proto/loans). The page mixes
// the two other case studies: Account Opening's chapters, stats and inverted
// sections, NPS's pill nav, eyebrows and white cards.

export const metadata: Metadata = { title: "Upstox Loans — Salaath Shaikh" };

const PURPLE = "#5A298B";
const GOLD = "#F5B83D";
const NIGHT = "#170833";

/* ---------- building blocks ---------------------------------------------- */

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

/** Section intro in the NPS layout: eyebrow and heading left, lede right. */
function Intro({ eyebrow, title, children, dark }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; dark?: boolean }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-end">
      <div>
        <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        <Heading className="mt-5">{title}</Heading>
      </div>
      {children ? <p data-fade className={`md:pb-2 ${dark ? "text-white/60" : "text-muted"}`}>{children}</p> : null}
    </div>
  );
}

function Stat({ value, label, tone, delay = 0 }: { value: string; label: string; tone?: "bad" | "good"; delay?: number }) {
  const c = tone === "bad" ? "#F0443A" : tone === "good" ? "#14A363" : undefined;
  return (
    <div data-fade data-delay={delay} className="flex flex-col gap-3 border-t border-ink/15 pt-5">
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="size-1.5 rounded-full" style={{ background: c ?? "currentColor" }} />
        {tone === "bad" ? "Pain" : tone === "good" ? "Opportunity" : "Market"}
      </span>
      <b data-count className="text-5xl font-semibold tabular-nums tracking-[-0.05em]" style={c ? { color: c } : undefined}>
        {value}
      </b>
      <span className="text-sm leading-snug text-muted">{label}</span>
    </div>
  );
}

/** Speed lines: the brand's own motif, drawn behind hero and statement moments. */
function Streaks({ count = 9, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="absolute h-px w-40 rounded-full [animation:streak_2.6s_linear_infinite]"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            animationDelay: `${(i * 0.37) % 2.6}s`,
            background: i % 3 ? "linear-gradient(90deg,transparent,rgba(255,255,255,.55))" : `linear-gradient(90deg,transparent,${GOLD})`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- content ----------------------------------------------------------- */

const SEGMENTS = [
  [50, "Short-term fund seekers", "Need money quickly, often urgently, and want the fastest disbursal."],
  [15, "Simplified-journey seekers", "Find loan applications complicated and give up on long paperwork."],
  [15, "Rate-sensitive borrowers", "Worried about high interest and being overcharged."],
  [15, "Support-focused borrowers", "Want clear status updates and help understanding repayments."],
  [5, "Credit builders", "New to credit and unsure whether they’ll be approved."],
] as const;

const COMPETITORS = [
  ["Google Pay", "Instant loans", "20", "steps to apply, and you can still be rejected after all of them", true],
  ["CRED", "CRED Cash", "6", "easy steps, but only one lender", false],
  ["ET Money", "ET Money Cash", "6", "steps, with a line of credit", false],
  ["Groww", "Groww loans", "6", "steps, one lender", false],
] as const;

const WORRIES = [
  { worry: "Is Upstox even allowed to give loans?", title: "Your Upstox account, a named lender", body: "You log in with the Upstox number you already trust, and every offer names the bank or NBFC lending the money: InCred, Aditya Birla Finance, Fibe.", layers: ["app-login"], anim: false },
  { worry: "How high will the interest be?", title: "The rate first, chosen for you", body: "Explore opens on your pre-approved limit and the best rate across lenders, tagged “Best rate for you”, with the lending partner underneath.", layers: ["app-explore"], anim: false },
  { worry: "What happens to my data?", title: "Consent before anything is shared", body: "Before a credit bureau or a lender sees a thing, one sheet explains what’s shared, with whom and why.", layers: ["app-consent"], anim: false },
  { worry: "Which EMI plan should I pick?", title: "Plans you can actually compare", body: "Each plan shows the monthly EMI and the total interest, with the repayment schedule one tap away. No mental maths.", layers: ["emi-picked"], anim: false },
  { worry: "Are there hidden charges?", title: "Every rupee before you submit", body: "Review lists the amount with fees, tax and charges, the rate, the EMI, the first EMI date and the bank, in one place.", layers: ["review"], anim: false },
  { worry: "How long until I get the money?", title: "A tracker, not a waiting room", body: "Submitted, mandate set, KFS accepted, disbursal initiated, credited. Usually within 10 minutes to 2 hours, and you can close the app.", layers: ["tracking"], anim: false },
];

const FLOW = [
  ["app-login", "Log in with Upstox", "~5s"],
  ["app-otp", "OTP fills itself", "~5s"],
  ["app-explore", "Your offer, up front", "~5s"],
  ["personal", "Details, mostly pre-filled", "~30s"],
  ["offer", "Offer confirmed", "~5s"],
  ["emi-picked", "Pick an EMI plan", "~15s"],
  ["selfie-ok", "Selfie", "~15s"],
  ["aadhaar-ok", "Aadhaar via DigiLocker", "~40s"],
  ["autopay", "Auto-EMI mandate", "~40s"],
  ["review", "Review and submit", "~15s"],
  ["success", "Applied", "done"],
  ["tracking", "Track the disbursal", "< 2 hrs"],
] as const;

/* ---------- page ----------------------------------------------------------- */

export default function LoansCase() {
  const next = cases.find((c) => c.slug === "account-opening")!;

  return (
    <Choreo className="bg-[#F3F3F1]">
      <SectionPill
        items={[
          ["Bet", "bet"],
          ["Users", "users"],
          ["Feelings", "feelings"],
          ["Rounds", "rounds"],
          ["Design", "design"],
          ["Try it", "prototype"],
          ["Results", "results"],
        ]}
      />

      {/* ---------- hero ---------- */}
      <header className="relative flex min-h-svh flex-col justify-between overflow-hidden px-4 pb-10 pt-28 text-white sm:px-10" style={{ background: `radial-gradient(120% 90% at 80% 20%, #4b0f96 0%, ${NIGHT} 60%)` }}>
        <Streaks count={14} />
        <div className="relative flex items-start justify-between">
          <p data-label data-load className="label !text-white/60">[ Selected work — 03 / Upstox ]</p>
          <p data-label data-load data-delay="0.2" className="label hidden !text-white/60 md:block">Upstox Loans · 2025</p>
        </div>

        {/* the app, live: the real looping background behind the real login */}
        <div className="pointer-events-none absolute right-[6vw] top-[13svh] hidden w-[36vw] items-end gap-[2vw] md:flex">
          <div className="w-1/2" data-parallax="0.08">
            <div data-fade data-load data-delay="0.5">
              <LoansPhone layers={["lg-brand", "lg-manual"]} anim priority alt="Upstox Loans login over the animated money background" />
            </div>
          </div>
          <div className="mb-[8vw] w-1/2" data-parallax="0.18">
            <div data-fade data-load data-delay="0.7" className="relative">
              <LoansPhone layers={["tracking"]} priority alt="Tracking the loan: disbursal initiated, credit usually within 2 hours" />
              <div className="absolute -left-[45%] top-[18%] w-[95%] rounded-2xl bg-white p-3 text-[#262626] shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)] [animation:toast_5s_2s_cubic-bezier(.16,1,.3,1)_infinite]">
                <span className="flex items-center gap-2 text-[11px] text-[#6a6a6a]">
                  <span className="grid size-4 place-items-center rounded-full bg-[#14A363] text-[9px] text-white">✓</span> upstox loans · now
                </span>
                <b className="mt-1 block text-sm leading-tight">₹2,00,000 credited to your bank account</b>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-16 md:mt-0">
          <h1 data-split="words" data-load data-delay="0.15" className="max-w-[16ch] text-[12vw] font-semibold leading-[0.95] tracking-[-0.05em] md:max-w-[50vw] md:text-[5.2vw]">
            Money in two hours. Designed three times over.
          </h1>
          <p data-fade data-load data-delay="0.6" className="mt-6 max-w-xl text-lg text-white/70">
            How we launched Upstox’s first lending product, pre-approved personal loans, through seven rounds of change, from a tab inside Upstox to the standalone app compliance would sign off.
          </p>
          <dl className="mt-12 grid gap-x-6 sm:grid-cols-2 md:max-w-[50vw]">
            {[
              ["My role", "Lead product designer, 0 → 1"],
              ["Worked with", "PMs, engineering, Yubi and lenders, compliance"],
              ["Platform", "Upstox Loans app, Android and iOS"],
              ["For", "Existing Upstox users, pre-approved only"],
            ].map(([k, v], i) => (
              <div key={k} className="relative py-4">
                <span data-grow data-load data-delay={(0.7 + i * 0.08).toFixed(2)} className="absolute inset-x-0 top-0 h-px bg-white/25" />
                <dt data-fade data-load data-delay={(0.8 + i * 0.08).toFixed(2)} className="label !text-white/50">{k}</dt>
                <dd data-fade data-load data-delay={(0.85 + i * 0.08).toFixed(2)} className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p data-fade data-load data-delay="1.1" className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#170833]" style={{ background: GOLD }}>Live</span>
            20k downloads, 8,037 leads and ₹6.4 lakh disbursed since launch.
          </p>
        </div>
      </header>

      {/* ---------- statement ---------- */}
      <section className="px-4 pb-10 pt-24 text-center sm:px-10">
        <p data-scrub-words className="mx-auto max-w-5xl text-4xl font-semibold leading-[1.12] tracking-[-0.04em] md:text-[3.6vw]">
          Every loan app promises instant money. Most make you earn it first, with forms, documents and a wait you can’t see.
        </p>
        <p data-fade className="mt-10 text-muted">The one promise we designed every screen around</p>
        <div data-fade data-delay="0.1" className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          {["Pre-approved, no applying to find out", "100% digital, zero paperwork", "Disbursed within 2 hours", "Every charge up front"].map((t) => (
            <span key={t} className="rounded-full bg-white px-3 py-1 shadow-[0_6px_20px_-14px_rgba(0,0,0,0.3)]">{t}</span>
          ))}
        </div>
      </section>

      {/* ---------- 00 what I did (AO3 list) ---------- */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-10 md:grid-cols-6 md:gap-0">
        <p data-label className="label md:col-span-2">[ 00 — What I did ]</p>
        <ul className="md:col-span-4 md:pl-3">
          {[
            "Sized the bet: market, borrower segments and four competitors",
            "Mapped emotions and pain points across eight stages of borrowing",
            "Designed the in-app loans experience inside Upstox, end to end",
            "Rebuilt it as a standalone app when compliance asked for separation",
            "Explored the brand: icon, splash and the animated money background",
            "Delegated parts of the flow and ran VQA through launch on both platforms",
          ].map((t, i) => (
            <li key={t} className="relative flex gap-6 py-5 text-xl md:text-2xl">
              <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
              <span className="pt-1.5 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span data-split="lines" className="tracking-[-0.02em]">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- 01 the bet ---------- */}
      <section id="bet" className="mx-auto max-w-6xl px-4 py-24 sm:px-10">
        <Intro eyebrow="01 · The bet" title="An investing app that lends you money, fast">
          The hypothesis: adding pre-approved loans through lending partners widens what Upstox offers, opens a new revenue line, and brings people closer to a complete financial life in one place.
        </Intro>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="12×" label="growth in digital personal loan disbursals, 2017 to 2022" />
          <Stat value="₹11.3 L Cr" label="and growing fast: the personal loan opportunity" delay={0.06} />
          <Stat value="20" label="steps to apply on Google Pay, with rejection possible at the end" tone="bad" delay={0.12} />
          <Stat value="< 5 L" label="ticket size, where speed matters more than anything" tone="good" delay={0.18} />
        </div>

        <div className="mt-20 flex flex-col gap-4">
          <div data-fade className="grid gap-6 rounded-[2rem] bg-white p-8 md:grid-cols-[1.4fr_1fr] md:items-end md:p-10">
            <div>
              <span className="label">What “pre-approved” means</span>
              <p className="mt-4 text-2xl font-medium leading-snug tracking-[-0.02em]">
                The lender has already checked your credit, income and history. You don’t apply to find out. You just decide.
              </p>
            </div>
            <p className="text-muted">That’s where the speed comes from: less to submit, less to verify, money sooner. Here’s how the best offer gets picked before anyone opens the app.</p>
          </div>
          <div data-fade data-delay="0.08">
            <OfferEngine />
          </div>
        </div>
      </section>

      {/* ---------- 02 users ---------- */}
      <section id="users" className="mx-auto max-w-6xl px-4 py-24 sm:px-10">
        <Intro eyebrow="02 · Who borrows" title="Half of them just need it now">
          Common use cases for small personal loans, under ₹5 lakh, split into five kinds of borrower. The biggest group cares about one thing.
        </Intro>
        <div className="mt-14 flex flex-col gap-3">
          {SEGMENTS.map(([pct, name, p], i) => (
            <div key={name} data-fade data-delay={(i * 0.05).toFixed(2)} className={`group grid items-center gap-4 rounded-[1.6rem] p-5 transition-colors duration-500 md:grid-cols-[14rem_1fr_16rem] md:p-6 ${i === 0 ? "bg-[#121110] text-white" : "bg-white hover:bg-[#ebe7f2]"}`}>
              <div className="flex items-baseline gap-3">
                <b className="text-4xl font-semibold tabular-nums tracking-[-0.05em]" style={i === 0 ? { color: GOLD } : undefined}>{pct}%</b>
                <span className="font-medium md:hidden">{name}</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full" style={{ background: i === 0 ? "rgba(255,255,255,.12)" : "#F3F3F1" }}>
                <span data-grow className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct * 1.8}%`, background: i === 0 ? GOLD : PURPLE }} />
              </div>
              <div>
                <span className="hidden font-medium md:block">{name}</span>
                <span className={`text-sm ${i === 0 ? "text-white/60" : "text-muted"}`}>{p}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 03 competitors (NPS dark) ---------- */}
      <section className="bg-[#121110] py-28 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <Intro dark eyebrow="03 · How everyone else does it" title="Fast apps had one lender. Big apps had twenty steps.">
            I walked through the loan journeys of the apps our users already had on their phones. Nobody combined fewer steps with a choice of lenders.
          </Intro>
          <div className="mt-14 grid gap-4 md:grid-cols-4">
            {COMPETITORS.map(([name, prod, n, p, bad], i) => (
              <div key={name} data-fade data-delay={(i * 0.06).toFixed(2)} className="flex min-h-[16rem] flex-col justify-between rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10">
                <div>
                  <span className="font-mono text-xs text-white/45">{String(i + 1).padStart(2, "0")} · {prod}</span>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{name}</h3>
                </div>
                <div>
                  <b data-count className="block text-6xl font-semibold tabular-nums tracking-[-0.05em]" style={{ color: bad ? "#F0443A" : "white" }}>{n}</b>
                  <p className="mt-2 text-sm text-white/60">{p}</p>
                </div>
              </div>
            ))}
          </div>

          {/* where phase 1 sits */}
          <div data-fade className="mt-4 grid gap-8 rounded-[2rem] bg-white p-6 text-ink md:grid-cols-[1fr_1.4fr] md:p-10">
            <div>
              <span className="label">Where phase 1 sits</span>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">High value, low effort, first</h3>
              <p className="mt-3 text-muted">With the PM, we sorted every idea by value and effort. Phase 1 took the high-value, low-effort corner. The rest became a roadmap, not a launch blocker.</p>
            </div>
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {[
                ["Competitive rates", 1], ["Quick disbursal", 1], ["Minimum steps and documents", 1], ["Live application status", 1],
                ["Loan tracking and management", 1], ["Prepayment", 1], ["Help while applying", 1],
                ["Free credit score", 0], ["Loan comparison", 0], ["Credit line", 0], ["Free pre-closure", 0], ["App nudges", 0],
              ].map(([t, on]) => (
                <div key={t as string} className="flex items-center gap-3 border-t border-line py-2.5 text-[15px]">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full text-[10px] text-white" style={{ background: on ? "#14A363" : "#d0d0d0" }}>{on ? "✓" : "·"}</span>
                  <span className={on ? "" : "text-muted"}>{t as string}</span>
                  {!on ? <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-muted">Later</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 04 feelings ---------- */}
      <section id="feelings" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>04 · Emotion mapping</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">Borrowing is a rollercoaster. We mapped every dip.</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            Before designing screens, I mapped what people do, think and feel at each stage, from spotting the offer to the money landing. Tap a stage.
          </p>
        </div>
        <div data-fade className="mt-12">
          <EmotionJourney />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Confident and excited", "Getting the best rate possible, and enough information to decide."],
            ["Secure and uncomplicated", "Every charge shown up front. Nothing to find out later."],
            ["Well informed", "The next EMI, open loans and next actions, always accurate."],
          ].map(([h, p], i) => (
            <div key={h} data-fade data-delay={(i * 0.08).toFixed(2)} className={`rounded-[2rem] p-7 ${i === 1 ? "text-white" : "bg-white"}`} style={i === 1 ? { background: PURPLE } : undefined}>
              <span className={`label ${i === 1 ? "!text-white/60" : ""}`}>How they should feel</span>
              <p className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{h}</p>
              <p className={`mt-2 text-sm ${i === 1 ? "text-white/70" : "text-muted"}`}>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 05 flow ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-10">
        <Intro eyebrow="05 · The flow" title="Four phases, and only one of them takes minutes">
          The flow chart we aligned on with product, engineering and the lending partner. Discovery should take seconds and tracking should need no effort, so the work goes into the middle.
        </Intro>
        <div data-fade className="mt-12">
          <FlowTrack />
        </div>
      </section>

      {/* the takeaway, read word by word */}
      <section className="relative overflow-hidden px-4 py-32 sm:px-10 md:py-48">
        <p data-label className="label mb-10 text-center">[ The principle ]</p>
        <p data-scrub-words className="mx-auto max-w-5xl text-center text-4xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[4.4vw]">
          Fast isn’t a screen. It’s every screen you never have to see.
        </p>
      </section>

      {/* ---------- 06 rounds (inverted) ---------- */}
      <section id="rounds" className="relative overflow-hidden px-4 py-28 text-white sm:px-10 md:py-36" style={{ background: NIGHT }}>
        <Streaks count={8} className="opacity-50" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-6 md:gap-0">
            <p data-label className="label !text-white/60 md:col-span-2">[ 06 — Seven rounds ]</p>
            <div className="md:col-span-4 md:pl-3">
              <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[4.2vw]">
                Lenders, vendors, tech and compliance each said no at least once.
              </h2>
              <p data-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
                Scope changed almost every week. Every rejection needed an alternative ready, because the launch date didn’t move. Step through what we tried and what happened to it.
              </p>
            </div>
          </div>
          <div data-fade className="mt-16">
            <Rounds />
          </div>
        </div>
      </section>

      {/* ---------- 07 the separation ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <Intro eyebrow="07 · The last round" title="Same product, new front door">
          We never meant to launch a separate app. Loans was designed to sit inside Upstox, in the same components, IA and look and feel. When compliance asked for separation after development, the decision to build for scale paid off: most of it moved over as it was.
        </Intro>
        <div data-fade className="mt-12">
          <IaSwitch />
        </div>
      </section>

      {/* ---------- 08 brand (dark, live animation) ---------- */}
      <section className="relative overflow-hidden bg-[#121110] py-28 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-10">
          <Intro dark eyebrow="08 · A brand that moves" title="If it’s instant, it should feel instant">
            A new app needed its own icon, splash and first impression. Behind login, rupee coins drift past streaks of light on a loop: the promise of speed before you’ve typed anything. I explored the 3D coins with Adobe Firefly, and one version went live.
          </Intro>

          <div className="mt-14 grid gap-4 md:grid-cols-[1.25fr_1fr]">
            <figure data-wipe className="overflow-hidden rounded-[2rem] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-wipe-inner src={`${LOANS_IMG}/brand-splash.webp`} alt="Android splash: Upstox Loans wordmark on a purple gradient" loading="lazy" width={1224} height={960} className="block h-auto w-full" />
            </figure>
            <div className="flex flex-col gap-4">
              <figure data-fade className="overflow-hidden rounded-[2rem] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${LOANS_IMG}/brand-icon.webp`} alt="Adaptive launcher icon in its shapes" loading="lazy" width={1153} height={385} className="block h-auto w-full" />
              </figure>
              <div data-fade data-delay="0.08" className="flex flex-1 items-center gap-5 rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10">
                <div className="w-24 shrink-0">
                  <LoansPhone layers={["lg-brand"]} anim alt="The looping money background with the Upstox Loans welcome message" />
                </div>
                <p className="text-sm text-white/65">
                  The background is a lottie, layered under the logo, the welcome line and the login sheet, with the OS bars on top. Live, right here.
                </p>
              </div>
            </div>
          </div>

          <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">Explorations along the way</h3>
          <p data-fade className="mt-3 max-w-2xl text-white/60">Intro screens and landing pages from earlier rounds, when Loans still lived inside Upstox. Same promise, many ways of saying it.</p>
          <div className="mt-12 grid grid-cols-2 gap-x-4 md:grid-cols-4">
            {[
              [["x-intro-a"], true, "Explored", "Need quick funds? Money in two working hours"],
              [["x-coin"], false, "Explored", "The 3D coin, front and centre"],
              [["x-intro-b"], true, "Explored", "Get funds instantly, three reasons why"],
              [["v-landing"], false, "Explored", "A landing page that explains first"],
            ].map(([layers, anim, chip, h], col) => (
              <div key={h as string} data-parallax={col % 2 ? "-0.08" : "0.06"}>
                <figure className="group">
                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
                    <LoansPhone layers={layers as string[]} anim={anim as boolean} alt={h as string} />
                  </div>
                  <figcaption className="mt-4 flex flex-col gap-2">
                    <span className="w-fit rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">{chip as string}</span>
                    <span className="text-lg font-semibold leading-tight tracking-[-0.02em]">{h as string}</span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 09 the design: one screen per worry ---------- */}
      <section id="design" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <Intro eyebrow="09 · The design" title="One answer for every worry">
          The final app is ordered by the questions people ask themselves while borrowing, not by the fields a lender needs.
        </Intro>
        <div className="mt-16 flex flex-col gap-6">
          {WORRIES.map((a, i) => (
            <div key={a.title} className={`grid items-center gap-10 rounded-[2.4rem] bg-white p-6 md:grid-cols-2 md:p-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")} / {String(WORRIES.length).padStart(2, "0")}</span>
                <p data-fade className="mt-5 rounded-2xl bg-[#121110] px-5 py-4 text-lg leading-snug text-white" style={{ borderBottomLeftRadius: 4 }}>
                  “{a.worry}”
                </p>
                <h3 data-split="lines" className="mt-8 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">{a.title}</h3>
                <p data-fade className="mt-3 max-w-md text-muted">{a.body}</p>
              </div>
              <div data-fade className="relative mx-auto">
                <div aria-hidden className="absolute inset-x-0 bottom-0 top-10 rounded-full opacity-50 blur-3xl" style={{ background: i % 2 ? "#C9B8F5" : "#FFE2A8" }} />
                <div data-parallax={i % 2 ? "-0.06" : "0.06"} className="relative">
                  <LoansPhone layers={a.layers} anim={a.anim} alt={a.title} width={270} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- the whole flow, sideways, with a clock ---------- */}
      <HScroll
        className="bg-[#F3F3F1]"
        intro={
          <>
            <Eyebrow>The happy path</Eyebrow>
            <h2 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[3.6vw]">
              From icon to applied in about four minutes
            </h2>
            <p data-fade className="mt-6 max-w-sm text-muted">
              Twelve moments, most of them seconds long. Times are rough happy-path estimates. The lender takes it from there, usually within two hours.
            </p>
          </>
        }
      >
        {FLOW.map(([src, cap, t], i) => (
          <figure key={src} className="w-[62vw] shrink-0 sm:w-[36vw] md:w-[17vw]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-ink font-mono text-[11px] text-bg">{i + 1}</span>
                <span className="text-sm font-medium leading-tight">{cap}</span>
              </span>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: t === "done" ? "#14A363" : PURPLE }}>{t}</span>
            </div>
            <LoansPhone layers={[src]} alt={cap} />
          </figure>
        ))}
      </HScroll>

      {/* ---------- 10 try it ---------- */}
      <section id="prototype" className="mx-auto max-w-6xl px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>10 · Try it</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">Borrow ₹2 lakh. Time yourself.</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            The shipped happy path, built from the final Figma file. Tap the Upstox Loans icon to start. A clock runs from “Apply now” to applied, and you can skip ahead to the money landing.
          </p>
        </div>
        <div data-fade className="mt-12 hidden overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)] ring-1 ring-black/5 md:block">
          <iframe src="/proto/loans/index.html" title="Upstox Loans interactive prototype" loading="lazy" className="block h-[clamp(560px,calc(100svh-10rem),880px)] w-full" />
        </div>
        <div className="mt-10 flex justify-center md:hidden">
          <RollButton href="/proto/loans/index.html" label="Open the prototype" />
        </div>
      </section>

      {/* ---------- 11 results ---------- */}
      <section id="results" className="px-4 py-28 sm:px-10">
        <div className="text-center">
          <Eyebrow>Live on Android and iOS</Eyebrow>
          <Heading className="mx-auto mt-5 max-w-3xl">A new vertical for Upstox</Heading>
          <p data-fade className="mx-auto mt-5 max-w-xl text-muted">
            Upstox Loans launched with one lending partner, with more in progress. It positions Upstox as more than an investing platform.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
          <div data-fade className="relative overflow-hidden rounded-[2rem] p-8 text-white md:row-span-2" style={{ background: NIGHT }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${LOANS_IMG}/bg-anim.webp`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <span className="label relative !text-white/60">Disbursed so far</span>
            <b data-count className="relative mt-16 block text-[5.5rem] font-semibold leading-none tracking-[-0.06em]">₹6.4 L</b>
            <p className="relative mt-3 text-white/70">lent to Upstox users, straight to their bank accounts</p>
          </div>
          {[
            ["20k", "app downloads"],
            ["8,037", "leads"],
            ["1 → 3", "lending partners: one live, two in progress"],
            ["< 2 hrs", "to disbursal, usually"],
          ].map(([v, l], i) => (
            <div key={l} data-fade data-delay={((i % 2) * 0.08).toFixed(2)} className="rounded-[2rem] bg-white p-8">
              <b data-count className="block text-5xl font-semibold tracking-[-0.05em]">{v}</b>
              <p className="mt-2 text-muted">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 12 reflection (AO3) ---------- */}
      <section className="mx-auto grid max-w-6xl gap-10 border-t border-line px-4 py-24 sm:px-10 md:grid-cols-6 md:gap-0 md:py-36">
        <div className="md:col-span-2">
          <p data-label className="label">[ 12 — Reflection ]</p>
        </div>
        <div className="md:col-span-4 md:pl-3">
          <h2 data-split="lines" className="max-w-4xl text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-[3.5vw]">What I took away.</h2>
          <div className="mt-12 grid gap-x-6 md:grid-cols-2">
            {[
              ["Change is the only constant", "Lenders, vendors, tech and product all moved the goalposts. Feel the frustration, then move on."],
              ["Consistency is what scales", "Building on existing components and flows is why a whole new app took weeks, not months."],
              ["Always carry a plan B", "One-step KYC, a lighter mandate, custom components: each no needed a ready alternative."],
              ["Divide and conquer", "With a big scope and a tight deadline, delegate the pieces and hold the quality bar yourself."],
            ].map(([h, p], i) => (
              <div key={h} data-fade data-delay={(i % 2) * 0.08} className="relative py-8">
                <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h4 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{h}</h4>
                <p className="mt-2 text-muted">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQ (NPS) ---------- */}
      <section id="faq" className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-10 md:grid-cols-[1fr_1.5fr]">
        <div>
          <Eyebrow>Common questions</Eyebrow>
          <h2 data-split="lines" className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">The decisions, asked and answered</h2>
          <div data-fade className="mt-10 rounded-[2rem] bg-white p-6">
            <span className="grid size-10 place-items-center rounded-full font-semibold text-white" style={{ background: PURPLE }}>?</span>
            <p className="mt-4 text-lg font-semibold">Want the full walkthrough?</p>
            <p className="mt-1 text-sm text-muted">Figma files and the launch deck, on request.</p>
            <div className="mt-5">
              <RollButton href="/#contact" label="Get in touch" />
            </div>
          </div>
        </div>
        <Faq
          items={[
            ["Why a separate app?", "Compliance didn’t approve lending clubbed with Upstox’s broking products. Loans had to live on its own, so it became Upstox Loans, for existing Upstox users, with its own icon and log-in."],
            ["Why only pre-approved loans?", "Pre-approval is what makes it fast. The lender has already assessed credit, so there’s little to submit and the money can arrive within hours. People who aren’t eligible never see an offer they can’t take."],
            ["Why not one-step KYC?", "We proposed fetching Central KYC to skip DigiLocker and the selfie. Most lenders on Yubi wouldn’t accept it, so we made the selfie and Aadhaar steps as short as they could be instead."],
            ["Why does every offer name the lender?", "“Who is actually lending me this?” and “Is Upstox even allowed to?” came up again and again. Naming the bank or NBFC on the offer, the review and the loan answers both."],
            ["Why a bottom nav in the new app?", "Inside Upstox, My loans and Explore were tabs under More. As its own app, Loans needed its own home: Explore, My loans and Profile became permanent destinations."],
          ]}
        />
      </section>

      {/* ---------- next project (AO3) ---------- */}
      <section className="border-t border-line pt-24">
        <div className="flex items-end justify-between px-4 sm:px-10">
          <h2 data-split="chars" className="text-[14vw] font-semibold leading-[0.85] tracking-[-0.06em] md:text-[9vw]">Next project</h2>
          <div data-fade className="hidden pb-4 md:block">
            <RollButton href={`/work/${next.slug}`} label="Open case" />
          </div>
        </div>
        <Link href={`/work/${next.slug}`} data-cursor="View" className="group mt-10 block">
          <figure data-wipe className="relative h-[80svh] overflow-hidden">
            <div
              data-wipe-inner
              className="absolute inset-0 transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              style={{ background: `radial-gradient(120% 120% at 20% 10%, ${next.cover[0]}, ${next.cover[1]})` }}
            >
              {next.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={next.image} alt="" className="h-full w-full object-cover object-[82%_50%]" />
              ) : null}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-4 text-white sm:p-10">
              <span className="max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-5xl">{next.title}</span>
              <span className="label shrink-0 !text-white/70">{next.year} ↗</span>
            </figcaption>
          </figure>
        </Link>
        <div className="label flex justify-between px-4 py-8 sm:px-10">
          <span>Sal · Lead product designer, Upstox</span>
          <span>Upstox Loans · 2025</span>
        </div>
      </section>

      <style>{`
        @keyframes streak{0%{transform:translateX(-60vw) rotate(-18deg);opacity:0}15%{opacity:1}100%{transform:translateX(60vw) rotate(-18deg);opacity:0}}
        @keyframes toast{0%,8%{opacity:0;transform:translateY(-14px) scale(.96)}14%,72%{opacity:1;transform:none}80%,100%{opacity:0;transform:translateY(-8px)}}
        @media (prefers-reduced-motion: reduce){[class*="animation:streak"],[class*="animation:toast"]{animation:none!important}}
      `}</style>
    </Choreo>
  );
}
