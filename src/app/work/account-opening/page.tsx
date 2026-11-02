import Link from "next/link";
import type { Metadata } from "next";
import { cases } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { HScroll } from "@/components/HScroll";
import { RollButton } from "@/components/RollButton";

// Account Opening 3.0. Copy is the user's own case study (claude.ai artifact
// "Account Opening 3.0"); screens live in /public/work/ao3.

export const metadata: Metadata = { title: "Account Opening 3.0 — Salaath Shaikh" };

const IMG = "/work/ao3";
const RED = "#D93A2B";

/* ---------- building blocks ---------------------------------------------- */

function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${IMG}/${src}.webp`}
      alt={alt}
      loading="lazy"
      className={`block aspect-[9/19.5] w-full rounded-[22px] bg-white object-cover object-top shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/10 ${className}`}
    />
  );
}

/** Neiden-style chapter: label column on the left (pinned on desktop), story on the right. */
function Chapter({
  n,
  label,
  title,
  children,
  id,
  className = "",
}: {
  n: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`grid gap-10 border-t border-line px-4 py-24 sm:px-10 md:grid-cols-6 md:gap-0 md:py-36 ${className}`}>
      <div className="md:col-span-2">
        <div data-pin className="md:pr-10">
          <p data-label className="label">[ {n} — {label} ]</p>
        </div>
      </div>
      <div className="min-w-0 md:col-span-4 md:pl-3">
        <h2 data-split="lines" className="max-w-4xl text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-[3.5vw]">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p data-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
      {children}
    </p>
  );
}

function Stat({ value, label, bad, delay = 0 }: { value: string; label: string; bad?: boolean; delay?: number }) {
  return (
    <div data-fade data-delay={delay} className="flex flex-col gap-3 border-t border-ink/15 pt-5">
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="size-1.5 rounded-full" style={{ background: bad ? RED : "currentColor" }} />
        {bad ? "Problem" : "Baseline"}
      </span>
      <b data-count className="text-5xl font-semibold tabular-nums tracking-[-0.05em]" style={bad ? { color: RED } : undefined}>
        {value}
      </b>
      <span className="text-sm leading-snug text-muted">{label}</span>
    </div>
  );
}

function Chip({ children, tone = "line" }: { children: React.ReactNode; tone?: "line" | "ink" | "red" }) {
  const cls =
    tone === "ink" ? "bg-ink text-bg border-ink" : tone === "red" ? "border-transparent text-white" : "border-ink/20 text-ink";
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${cls}`}
      style={tone === "red" ? { background: RED } : undefined}
    >
      {children}
    </span>
  );
}

/* ---------- content ----------------------------------------------------------- */

const JOURNEY = [
  ["Mobile & email", 0.3, "Two OTPs: one for the phone, one for email"],
  ["Verify PAN", 60, "A “KYC needed” screen and onboarding steps before anything else, then PAN and DigiLocker"],
  ["Signature", 0.7, "Draw, confirm, then continue"],
  ["Bank verification", 3.25, "Verify, confirm the fetched details, continue"],
  ["Segments & income proof", 3.5, "Two more OTPs to fetch and approve bank statements"],
  ["Personal details", 0.7, "Five questions, one per screen"],
  ["Nominee", 0.8, "A choice that opens a long form"],
  ["Selfie", 1.2, "A tutorial, a photo, then confirm"],
  ["eSign", 2.3, "A Plus plan upsell, then nine taps through Aadhaar eSign"],
] as const;

const FLOW = [
  ["n04", "~6s", "Mobile + OTP", "OTP fills and submits itself"],
  ["n05", "~10s", "Email", "Email with Continue with Google"],
  ["n08", "~10s", "Confirm details", "Confirm PAN with fetched details"],
  ["n13", "~10s", "Signature", "Draw your signature on screen"],
  ["n16", "~10s", "Selfie", "Selfie with green success ring"],
  ["n24", "~10s", "eSign", "Aadhaar eSign in the app"],
  ["n26", "after submitting", "F&O activation", "Unlock F&O with risk disclosure"],
] as const;

// [name, start column (minutes), length (minutes), steps]
const BENCH = [
  ["Upstox 2.0", 8, 4, 11, "me"],
  ["Angel One", 6, 2, 11, ""],
  ["Groww", 6, 2, 10, ""],
  ["RIISE", 6, 1, 12, ""],
  ["Lemonn", 5, 1, 12, ""],
  ["SAHI", 4, 1, 9, ""],
  ["Dhan", 4, 1, 10, ""],
  ["mStock", 3, 1, 10, ""],
  ["Grip", 3, 1, 8, ""],
  ["Upstox 3.0*", 1, 1, 7, "next"],
] as const;

const BEFORE_AFTER = [
  {
    title: "Making the first impression count",
    why: "People hit the KYC wall cold. The first screen now sells the outcome and earns trust before asking for anything.",
    before: [["o03", "Old sign up or log in screen"]],
    beforeCap: "A bare “Sign up or log in” form, licences in the footer.",
    after: [["n00", "New welcome screen with trust signals"]],
    afterCap: "SEBI registered, ₹0 account opening fee, a 4.3 rating and social proof, before any ask.",
    short: "Positioning, not paperwork.",
  },
  {
    title: "Turning PAN entry into a confirmation",
    why: "This is where 60% of people left. With PAN fetched from the phone number, the hardest step became the quickest: a card people recognise, ready to confirm.",
    before: [["o10", "DigiLocker login"], ["o14", "Confirm PAN details form"], ["o15", "PAN details with consent"]],
    beforeCap: "A primer, a DigiLocker login, then PAN details to check line by line.",
    after: [["n07", "Securely fetching details sheet"], ["n08", "Confirm PAN shown as a PAN card"]],
    afterCap: "A checklist shows what’s being fetched, then the PAN appears as a card. Edit stays one tap away.",
    short: "Recognise, don’t retype.",
  },
  {
    title: "Removing the ₹1 bank payment",
    why: "Verifying a bank used to mean leaving the app to pay ₹1 over UPI. With bank details fetched, it’s one card to confirm.",
    before: [["o22", "Pick a UPI app to pay ₹1"], ["o24", "Enter UPI PIN"]],
    beforeCap: "Pick a UPI app, enter the PIN, wait for the refund.",
    after: [["n09", "Confirm bank details card"]],
    afterCap: "The bank account appears as a card under the confirmed PAN.",
    short: "No detour out of the app.",
  },
  {
    title: "Collapsing six screens of personal details",
    why: "AO 2.0 asked one question per screen to lower cognitive load. We already knew most answers, so they arrive pre-filled on one card.",
    before: [],
    beforeWide: ["ao2_personal", "AO 2.0 personal details: a primer followed by five single-question screens"],
    beforeCap: "A primer, then occupation, income, experience, marital status and settlement, one at a time.",
    after: [["n10", "Personal details pre-filled on one card"], ["n11", "All details confirmed"]],
    afterCap: "Fetched details on one card. Each section collapses to a tick once confirmed.",
    short: "Six screens became one card.",
  },
  {
    title: "Making the nominee optional in practice",
    why: "Most people skip it, yet saying yes opened a form one field per screen. Now it’s a single question with “later” as an equal choice.",
    before: [["o38", "Nominee name field"], ["o42", "Nominee relation"], ["o46", "Nominee address"]],
    beforeCap: "Up to 22 screens: name, relation, date of birth, address, phone, email, ID and more.",
    after: [["n21", "Would you like to add a nominee? with No, I’ll do it later"]],
    afterCap: "One question. Details can be added any time from the profile.",
    short: "Don’t make everyone pay for a few.",
  },
  {
    title: "Turning a dead end into a next step",
    why: "Submitting used to end in a congratulations screen and a Plus trial upsell. Now people land in the app with a reason to stay.",
    before: [["o67", "Congratulations, application submitted"], ["p1", "15-day Plus free trial interstitial"]],
    beforeCap: "A wait screen, then an upsell before they could even trade.",
    after: [["n28", "Account activation in progress"], ["n29", "Explore with an activation tracker"]],
    afterCap: "Explore with a live activation tracker, then a nudge to build a watchlist.",
    short: "The end of KYC is the start of investing.",
  },
] as {
  title: string;
  why: string;
  before: string[][];
  beforeWide?: string[];
  beforeCap: string;
  after: string[][];
  afterCap: string;
  short: string;
}[];

const MOMENTS = [
  ["m0_first", "Eases anxiety", "Positioning, not paperwork"],
  ["m1_contact", "Removes effort", "Zero typing to begin"],
  ["m2_fetch", "Eases anxiety", "We fetch, and show it"],
  ["m3_visual", "Less overwhelming", "Identity as visuals, not fields"],
  ["m4_cta", "Removes doubt", "Confident confirmations"],
  ["m6_wins", "Hard to abandon", "Tiny wins, celebrated"],
  ["m7_invite", "Less overwhelming", "Segments as invites"],
  ["m8_done", "Hard to abandon", "A finish worth reaching"],
] as const;

/* ---------- page ----------------------------------------------------------- */

export default function AccountOpening() {
  const next = cases.find((c) => c.slug !== "account-opening")!;

  return (
    <Choreo>
      {/* ---------- hero ---------- */}
      <header className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-ink px-4 pb-10 pt-28 text-bg sm:px-10">
        <div className="flex items-start justify-between">
          <p data-label data-load className="label !text-bg/60">[ Selected work — 01 / Upstox ]</p>
          <p data-label data-load data-delay="0.2" className="label hidden !text-bg/60 md:block">Account Opening 3.0 · 2026</p>
        </div>

        {/* the four screens, stepping up like a staircase */}
        <div className="pointer-events-none absolute right-4 top-[14svh] hidden w-[50vw] grid-cols-4 items-end gap-[1.6vw] sm:right-10 md:grid">
          {[
            ["n00", "Welcome screen with SEBI badge, ₹0 account opening fee and 4.3 rating"],
            ["n08", "Confirm PAN: fetched details shown as a PAN card"],
            ["m6_wins", "Signature captured successfully"],
            ["n29", "Explore home with an activation tracker"],
          ].map(([src, alt], i) => (
            <div key={src} style={{ marginBottom: `${i * 5}vw` }}>
              <div data-parallax={(0.08 + i * 0.07).toFixed(2)}>
                <div data-fade data-load data-delay={(0.5 + i * 0.12).toFixed(2)}>
                  <Phone src={src} alt={alt} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-16 md:mt-0">
          <h1
            data-split="words"
            data-load
            data-delay="0.15"
            className="max-w-[16ch] text-[12vw] font-semibold leading-[0.95] tracking-[-0.05em] md:max-w-[44vw] md:text-[5.2vw]"
          >
            Turning a 12-minute KYC into a two-minute welcome.
          </h1>
          <p data-fade data-load data-delay="0.6" className="mt-6 max-w-xl text-lg text-bg/70">
            How we rebuilt account opening for India’s first-time investors, after two redesigns that didn’t move conversion.
          </p>
          <dl className="mt-12 grid gap-x-6 sm:grid-cols-2 md:max-w-[44vw]">
            {[
              ["My role", "Lead product designer"],
              ["Worked with", "Product managers, engineering, KYC vendors"],
              ["Platform", "Upstox mobile app"],
              ["Direction chosen", "Concept 01, the delight flow"],
            ].map(([k, v], i) => (
              <div key={k} className="relative py-4">
                <span data-grow data-load data-delay={(0.7 + i * 0.08).toFixed(2)} className="absolute inset-x-0 top-0 h-px bg-bg/25" />
                <dt data-fade data-load data-delay={(0.8 + i * 0.08).toFixed(2)} className="label !text-bg/50">{k}</dt>
                <dd data-fade data-load data-delay={(0.85 + i * 0.08).toFixed(2)} className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p data-fade data-load data-delay="1.1" className="mt-6 flex items-center gap-3 text-sm text-bg/60">
            <Chip tone="red">Projected</Chip>
            3.0 is projected to cut account opening from 8–12 minutes to about 1–2.
          </p>
        </div>
      </header>

      {/* ---------- what I did ---------- */}
      <section className="grid gap-10 px-4 py-24 sm:px-10 md:grid-cols-6 md:gap-0">
        <p data-label className="label md:col-span-2">[ 00 — What I did ]</p>
        <ul className="md:col-span-4 md:pl-3">
          {[
            "Mapped the funnel and every action in the old journey",
            "Benchmarked Upstox against eight broking apps, end to end",
            "Pushed, with PMs, for vendor auto-fetch wherever possible",
            "Led the design direction and the end-to-end flow",
            "Designed post-activation nudges toward a first trade",
          ].map((t, i) => (
            <li key={t} className="relative flex gap-6 py-5 text-xl md:text-2xl">
              <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
              <span className="pt-1.5 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span data-split="lines" className="tracking-[-0.02em]">{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- 01 prologue ---------- */}
      <Chapter n="01" label="Prologue" title="Account opening had been redesigned twice. Neither fixed it.">
        <Lede>
          Before anyone can buy a share on Upstox, they clear SEBI-mandated KYC: PAN, bank, personal details, signature, selfie and an Aadhaar eSign. Two earlier versions tried to make that bearable in opposite ways.
        </Lede>
        <div className="mt-16 flex flex-col gap-16">
          {[
            ["AO 1.0", "24 steps and lots of branched flows", "Dense forms, several questions at once, long declaration lists. Every screen looked like work, and people gave up on seeing the length.", "ao1_flow", "AO 1.0: 24 numbered screens from email entry to application submitted"],
            ["AO 2.0 · released Sept 2025", "Built to reduce cognitive overload", "“Provide heavy visual aid on every step to help prevent errors upfront.” Steps went from 24 to 16, but each was split into micro-screens with a primer before it.", "ao2_flow", "AO 2.0: 16 numbered steps with primers and branched flows"],
          ].map(([chip, h, p, img, alt]) => (
            <div key={chip}>
              <div className="grid gap-4 md:grid-cols-2">
                <div data-fade className="flex flex-col gap-3">
                  <Chip>{chip}</Chip>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">{h}</h3>
                </div>
                <p data-fade data-delay="0.1" className="text-muted">{p}</p>
              </div>
              <figure data-wipe className="mt-8 overflow-hidden rounded-2xl bg-card ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-wipe-inner src={`${IMG}/${img}.webp`} alt={alt} loading="lazy" width={2300} height={1290} className="block h-auto w-full" />
              </figure>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 02 the ask ---------- */}
      <Chapter n="02" label="The ask" title="Make opening an account faster, and get more people through.">
        <Lede>
          The brief sounded like funnel tuning. The numbers said the journey itself was the problem. Opening an account still took 8 to 12 minutes, in one sitting, and most people never finished.
        </Lede>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="8–12 min" label="to open an account, in one sitting" />
          <Stat value="43" label="taps and inputs on the shortest path" delay={0.06} />
          <Stat value="~28%" label="of people who started, finished" delay={0.12} />
          <Stat value="60%" label="left at a single step: PAN verification" bad delay={0.18} />
        </div>
        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">What AO 2.0 did to behaviour</h3>
        <Lede>
          Splitting every step lowered the effort on each screen, but it added screens. At launch almost a third of taps went nowhere, and conversion fell before it slowly recovered.
        </Lede>
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="31%" label="dead clicks at launch (10.4% after fixes)" bad />
          <Stat value="18 min" label="to onboard at launch (12 min after fixes)" bad delay={0.06} />
          <Stat value="17.7%" label="conversion in Oct 2025, against ~30% for 1.0" bad delay={0.12} />
          <Stat value="~28%" label="by Feb 2026, roughly back where 1.0 had been" delay={0.18} />
        </div>
      </Chapter>

      {/* the takeaway, read word by word */}
      <section className="px-4 py-32 sm:px-10 md:py-48">
        <p data-label className="label mb-10 text-center">[ The takeaway ]</p>
        <p data-scrub-words className="mx-auto max-w-5xl text-center text-4xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[4.4vw]">
          Hiding length isn’t the same as removing it. People count taps, not screens.
        </p>
      </section>

      {/* ---------- 03 the turn (inverted) ---------- */}
      <section className="bg-ink px-4 py-28 text-bg sm:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <p data-label className="label !text-bg/60 md:col-span-2">[ 03 — The turn ]</p>
          <div className="md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[4.6vw]">
              1.0 felt long. 2.0 was long. 3.0 had to be short, and feel short.
            </h2>
            <p data-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-bg/70 md:text-xl">
              That reframed the work into two levers. With PMs, remove real work by fetching data instead of asking for it. In design, make what’s left feel guided and human rather than like a form.
            </p>
            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {[
                ["01", "Remove real work", "With PMs: fetch data instead of asking for it."],
                ["02", "Make the rest feel light", "In design: guided and human, not a form."],
              ].map(([n, b, s], i) => (
                <div key={b} data-fade data-delay={i * 0.1} className="rounded-2xl border border-bg/15 p-7 transition-colors duration-500 hover:bg-bg hover:text-ink">
                  <span className="font-mono text-xs opacity-60">{n}</span>
                  <b className="mt-10 block text-2xl font-semibold tracking-[-0.03em]">{b}</b>
                  <span className="mt-2 block opacity-70">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 04 journey ---------- */}
      <Chapter n="04" label="The journey, step by step" title="We mapped what every stage asked of people.">
        <Lede>Drop-off on its own told us where people left. Listing what each stage actually asked for told us why.</Lede>
        <div className="mt-14">
          <div className="label grid grid-cols-[1fr_5rem] gap-4 pb-3 md:grid-cols-[14rem_9rem_1fr]">
            <span>Stage in AO 2.0</span>
            <span>Drop-off</span>
            <span className="hidden md:block">What it asked of people</span>
          </div>
          {JOURNEY.map(([stage, drop, ask], i) => {
            const cliff = drop >= 50;
            return (
              <div
                key={stage}
                data-fade
                data-delay={(i * 0.04).toFixed(2)}
                className={`relative grid grid-cols-[1fr_5rem] items-baseline gap-4 py-4 md:grid-cols-[14rem_9rem_1fr] ${cliff ? "-mx-4 px-4" : ""}`}
                style={cliff ? { background: "rgba(217,58,43,0.07)" } : undefined}
              >
                <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
                <span className={cliff ? "font-semibold" : ""}>{stage}</span>
                <span className="flex items-center gap-3">
                  <b className="tabular-nums" style={cliff ? { color: RED, fontSize: "1.4rem" } : undefined}>{drop}%</b>
                  <span className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-line md:block">
                    <span data-grow className="block h-full rounded-full" style={{ width: `${Math.max(3, drop * 1.6)}%`, background: cliff ? RED : "var(--ink)" }} />
                  </span>
                </span>
                <span className="col-span-2 text-sm text-muted md:col-span-1 md:text-base">{ask}</span>
              </div>
            );
          })}
        </div>
      </Chapter>

      {/* the new journey, sideways */}
      <HScroll
        className="bg-card"
        intro={
          <>
            <p data-label className="label mb-6">[ 04b — The new journey ]</p>
            <h3 data-split="lines" className="text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-[3.4vw]">
              The new journey, reshaped around confirming
            </h3>
            <p data-fade className="mt-6 max-w-sm text-muted">
              Seven steps, most of them about ten seconds on the happy path. F&amp;O activation and income proof move after the account is submitted.
            </p>
          </>
        }
      >
        {FLOW.map(([src, time, name, alt], i) => (
          <figure key={src} className="w-[58vw] shrink-0 sm:w-[34vw] md:w-[15vw]">
            <div className="mb-4 flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-xs text-bg">{i + 1}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{time}</span>
            </div>
            <Phone src={src} alt={alt} />
            <figcaption className="mt-4 text-lg font-semibold tracking-[-0.02em]">{name}</figcaption>
          </figure>
        ))}
      </HScroll>

      {/* ---------- 05 behind the scenes ---------- */}
      <Chapter n="05" label="Behind the scenes" title="The fastest apps never asked for a PAN.">
        <Lede>
          I recorded and broke down eight competing apps alongside our own. Upstox was the slowest. The quickest ones fetched PAN and most of the profile from the phone number, so people confirmed instead of typing.
        </Lede>
        <div className="mt-14" role="figure" aria-label="Minutes to open an account across nine apps">
          {BENCH.map(([name, start, len, steps, kind], i) => (
            <div
              key={name}
              data-fade
              data-delay={(i * 0.04).toFixed(2)}
              className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-4 border-t border-line py-3 text-sm md:grid-cols-[9rem_1fr_3rem]"
            >
              <span className={kind ? "font-semibold" : ""}>{name}</span>
              <span className="relative h-3">
                <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_calc(16.666%-1px),var(--line)_calc(16.666%-1px)_16.666%)]" />
                <span
                  data-grow
                  data-delay={(0.1 + i * 0.05).toFixed(2)}
                  className="absolute top-0 h-3 rounded-full"
                  style={{
                    left: `${(start / 12) * 100}%`,
                    width: `${(len / 12) * 100}%`,
                    background: kind === "me" ? RED : kind === "next" ? "var(--ink)" : "#cfcfca",
                  }}
                />
              </span>
              <span className="text-right font-mono tabular-nums text-muted">{steps}</span>
            </div>
          ))}
          <div className="grid grid-cols-[6.5rem_1fr_2.5rem] gap-4 border-t border-line pt-3 font-mono text-[11px] text-muted md:grid-cols-[9rem_1fr_3rem]">
            <span>App</span>
            <span className="flex justify-between">
              {[0, 2, 4, 6, 8, 10, "12 min"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </span>
            <span className="text-right">Steps</span>
          </div>
          <p className="mt-4 text-sm text-muted">Happy-path steps and timings recorded on each app. *3.0 is projected.</p>
        </div>

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">So we fetched it too</h3>
        <Lede>
          Not every fix had to be a design fix. I worked with PMs to bring in vendor auto-fetch wherever a vendor could do the work, which removed most of the manual entry from 3.0.
        </Lede>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["Bank auto-fetch · Decentro", "−50%", "drop-offs. Bank details fetched from the mobile number.", "60% conversion vs 4%"],
            ["PAN auto-fetch · Equifax", "−16%", "drop-offs. PAN details fetched from the mobile number.", "35% conversion vs 10%"],
            ["KRA 2.0", "−7%", "DigiLocker and PAN drop-offs. Verified KRA users skip DigiLocker.", "54% conversion vs 8%"],
          ].map(([top, big, p, foot], i) => (
            <div key={top} data-fade data-delay={i * 0.08} className="flex min-h-[19rem] flex-col justify-between rounded-2xl bg-ink p-7 text-bg">
              <span className="label !text-bg/55">{top}</span>
              <div>
                <b data-count className="block text-6xl font-semibold tabular-nums tracking-[-0.05em]">{big}</b>
                <p className="mt-3 text-sm text-bg/70">{p}</p>
                <p className="mt-6 border-t border-bg/15 pt-4 font-mono text-xs text-bg/60">{foot}</p>
              </div>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 06 principles ---------- */}
      <Chapter n="06" label="Principles" title="Three recurring problems gave us three principles.">
        <div className="mt-14">
          {[
            ["Too much to fill in", "Confirm, don’t collect", "Show what we already know for review. Less to think about, faster to finish."],
            ["Too little to trust", "Trust on every page", "SEBI registration on every major page, social proof up front, and a persistent “?” for help without leaving the flow."],
            ["Too many dead ends", "Keep the momentum", "Sections reveal themselves, small wins are celebrated, and the end leads somewhere useful."],
          ].map(([prob, prin, p], i) => (
            <div
              key={prin}
              data-fade
              data-delay={i * 0.08}
              className="group relative grid gap-4 py-8 transition-colors duration-500 md:grid-cols-[1fr_3rem_1.4fr] md:items-center md:px-6 md:hover:bg-ink md:hover:text-bg"
            >
              <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
              <div className="flex flex-col gap-2">
                <span className="label" style={{ color: RED }}>Problem</span>
                <span className="text-xl font-medium">{prob}</span>
              </div>
              <span className="grid size-11 place-items-center rounded-full border border-current text-lg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-45deg]">→</span>
              <div className="flex flex-col gap-2">
                <span className="label group-hover:!text-bg/60">Principle</span>
                <b className="text-3xl font-semibold tracking-[-0.035em]">{prin}</b>
                <p className="text-muted transition-colors duration-500 group-hover:text-bg/70">{p}</p>
              </div>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 07 screen by screen ---------- */}
      <Chapter n="07" label="The design, screen by screen" title="What changed, and why.">
        <div className="mt-10">
          {BEFORE_AFTER.map((b, i) => (
            <div key={b.title} className="border-t border-line py-16 first:border-t-0 first:pt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 data-split="lines" className="text-3xl font-semibold tracking-[-0.035em]">{b.title}</h3>
              </div>
              <p data-fade className="mt-4 max-w-2xl text-muted">{b.why}</p>
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div data-fade className="flex flex-col gap-5 rounded-2xl bg-card p-5">
                  <span className="label">Before</span>
                  {b.beforeWide ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${IMG}/${b.beforeWide[0]}.webp`} alt={b.beforeWide[1]} loading="lazy" width={2402} height={1364} className="h-auto w-full rounded-xl ring-1 ring-black/10 grayscale-[30%]" />
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {b.before.map(([src, alt]) => (
                        <Phone key={src} src={src} alt={alt} className="grayscale-[30%]" />
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted">{b.beforeCap}</p>
                </div>
                <div data-fade data-delay="0.12" className="flex flex-col gap-5 rounded-2xl p-5 ring-1 ring-ink/15">
                  <span className="label !text-ink">After</span>
                  <div className="grid grid-cols-3 gap-3">
                    {b.after.map(([src, alt]) => (
                      <Phone key={src} src={src} alt={alt} />
                    ))}
                  </div>
                  <p className="text-sm text-muted">{b.afterCap}</p>
                </div>
              </div>
              <p data-fade className="mt-8 flex items-center gap-3 text-xl font-semibold tracking-[-0.02em]">
                <Chip tone="ink">In short</Chip>
                {b.short}
              </p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 08 iterations ---------- */}
      <Chapter n="08" label="Iterations" title="How we got to the final direction.">
        <Lede>
          After leadership feedback, the brief was a guided setup that feels lightweight, not a form. Two decisions shaped the final look and feel.
        </Lede>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["mood2", "Explored", "Concept 02 · story-led", "Relatable and personal, borrowed from users’ daily routines.", "Concept 02 mood board: a desk with a newspaper and chai"],
            ["mood1", "Chosen", "Concept 01 · glass, light", "Premium and modern, and still inside the Upstox visual family.", "Concept 01 mood board: glass forms and soft gradients"],
            ["", "Explored", "An expressive reveal", "Too complex to sustain consistently across the KYC flow.", "“Hand reveal” for the PAN card"],
            ["m3_visual", "Final", "Auto-expanding sections", "Keeps the progressive reveal, scales to every section, builds rhythm.", "Auto-expanding PAN, bank and personal sections"],
          ].map(([src, chip, h, p, alt], i) => (
            <div key={h} data-fade data-delay={i * 0.06} className={`flex flex-col gap-4 rounded-2xl p-3 pb-5 ${chip === "Final" ? "bg-ink text-bg" : "bg-card"}`}>
              <div className="group aspect-[4/5] overflow-hidden rounded-xl bg-bg">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${IMG}/${src}.webp`} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center border border-dashed border-ink/25 p-6 text-center font-medium text-muted">{alt}</div>
                )}
              </div>
              <div className="flex flex-col gap-2 px-2">
                <Chip tone={chip === "Final" ? "red" : chip === "Chosen" ? "ink" : "line"}>{chip}</Chip>
                <h4 className="text-lg font-semibold leading-tight tracking-[-0.02em]">{h}</h4>
                <p className={`text-sm ${chip === "Final" ? "text-bg/70" : "text-muted"}`}>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 09 micro-moments: columns drift at different speeds ---------- */}
      <Chapter n="09" label="Micro-moments" title="Small moments that make it hard to walk away.">
        <Lede>Each one takes away a reason to hesitate, or gives a reason to keep going.</Lede>
        <div className="mt-16 grid grid-cols-2 gap-x-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} data-parallax={col % 2 ? "-0.08" : "0.06"} className="flex flex-col gap-10">
              {MOMENTS.filter((_, i) => i % 4 === col).map(([src, chip, h]) => (
                <figure key={src} className="group">
                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
                    <Phone src={src} alt={h} />
                  </div>
                  <figcaption className="mt-4 flex flex-col gap-2">
                    <Chip>{chip}</Chip>
                    <span className="text-lg font-semibold leading-tight tracking-[-0.02em]">{h}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 10 prototype ---------- */}
      <Chapter n="10" label="Prototype" title="The whole journey, end to end.">
        <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_15rem]">
          <div>
            <p data-fade className="text-xl leading-relaxed">
              Welcome, mobile and OTP, Google sign-in for email, fetched PAN, bank and personal details, signature, selfie, eSign, then Explore with the activation tracker.
            </p>
            <p data-fade data-delay="0.1" className="mt-4 text-muted">Prototype available on request.</p>
          </div>
          <div data-fade data-delay="0.15">
            <Phone src="n00" alt="The welcome screen, where the prototype journey starts" />
          </div>
        </div>
      </Chapter>

      {/* ---------- 11 impact (inverted tiles) ---------- */}
      <Chapter n="11" label="Impact" title="What we expect from 3.0.">
        <Lede>
          The automation results above are live. The flow-level numbers below are projections from the research phase and will be measured once 3.0 ships.
        </Lede>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["~35%", "completion, up about 7 points from ~28%"],
            ["~1–2 min", "to submit on the happy path, down from 8–12"],
            ["11 → 7", "steps on the happy path, with most manual entry replaced by confirmation"],
          ].map(([big, s], i) => (
            <div key={big} data-fade data-delay={i * 0.08} className="flex min-h-[17rem] flex-col justify-between rounded-2xl bg-ink p-7 text-bg">
              <Chip tone="red">Projected</Chip>
              <div>
                <b data-count className="block whitespace-nowrap text-5xl font-semibold tabular-nums tracking-[-0.05em] lg:text-[3.4vw]">{big}</b>
                <p className="mt-3 text-sm text-bg/70">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 12 what comes next ---------- */}
      <Chapter n="12" label="What comes next" title="From an open account to a first trade.">
        <div className="mt-8 grid gap-6 text-muted md:grid-cols-2">
          <p data-fade>
            Once people are in, the next job is a first meaningful action. While the account activates, they’re nudged to build a watchlist, the one useful thing they can do before they’re trade-ready. As soon as it’s ready, alerts on their watchlist stocks invite a first trade. The nudge framework is built to carry other contextual nudges across Upstox.
          </p>
          <p data-fade data-delay="0.1">
            We’ll judge 3.0 on drop-off at PAN, end-to-end completion, time to submit, and whether moving F&amp;O activation after eSign costs us F&amp;O users.
          </p>
        </div>
      </Chapter>

      {/* ---------- 13 reflection ---------- */}
      <Chapter n="13" label="Reflection" title="What I took away.">
        <div className="mt-12 grid gap-x-6 md:grid-cols-2">
          {[
            ["Hiding length isn’t removing it", "2.0 made each screen lighter and the journey longer."],
            ["Not every fix is a design fix", "Auto-fetch did more for speed than any layout change."],
            ["Speed is felt, not just counted", "Reassurance and small wins make people want to finish."],
            ["Read the funnel by cause", "A 60% cliff and a 3% leak need different answers."],
          ].map(([h, p], i) => (
            <div key={h} data-fade data-delay={(i % 2) * 0.08} className="relative py-8">
              <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h4 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{h}</h4>
              <p className="mt-2 text-muted">{p}</p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- next project ---------- */}
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
          <span>Account Opening 3.0 · 2026</span>
        </div>
      </section>
    </Choreo>
  );
}
