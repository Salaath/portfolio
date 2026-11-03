import Link from "next/link";
import type { Metadata } from "next";
import { cases } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { RollButton } from "@/components/RollButton";
import { FlowVideo } from "@/components/ao/FlowVideo";
import { HeroPhone } from "@/components/ao/HeroPhone";

// Account Opening 3.0, revised. Structure follows the user's storytelling
// blueprint (problem → investigation → reframe → redesign → outcome → next
// step → reflection). Screens live in /public/work/ao3; the videos are
// recordings of the AO 3.0 prototype (see "Case study/proto-video").

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
  ["Mobile & email", 0.3, "Two OTPs, one for the phone and one for email"],
  ["Verify PAN", 60, "A “KYC needed” screen, onboarding steps, then PAN and DigiLocker"],
  ["Signature", 0.7, "Draw, confirm, continue"],
  ["Bank verification", 3.25, "Verify, confirm the fetched details, continue"],
  ["Segments & income proof", 3.5, "Two more OTPs to fetch bank statements"],
  ["Personal details", 0.7, "Five questions, one per screen"],
  ["Nominee", 0.8, "A choice that opens a long form"],
  ["Selfie", 1.2, "A tutorial, a photo, then confirm"],
  ["eSign", 2.3, "A Plus upsell, then nine taps through Aadhaar eSign"],
] as const;

// seconds into ao3-flow.mp4 where each part of the journey starts
const CHAPTERS = [
  { at: 0, label: "Welcome", note: "Who we are and what it costs, before we ask for anything." },
  { at: 2.9, label: "Mobile and OTP", note: "The OTP is read from messages and fills itself in." },
  { at: 8.6, label: "Email", note: "One tap with Google instead of typing an address." },
  { at: 11.8, label: "Confirm PAN, bank, personal", note: "Details are fetched while you watch, then confirmed card by card." },
  { at: 28.9, label: "Signature", note: "Draw it, or tap to sign. A small win when it's saved." },
  { at: 35.9, label: "Selfie", note: "A quick tip, the camera, done." },
  { at: 44.0, label: "Two questions", note: "Trading experience and segments, on a single screen." },
  { at: 48.5, label: "Aadhaar eSign", note: "Inside the app, with the OTP filled in for you." },
  { at: 58.2, label: "Activation", note: "F&O is offered after submitting, not in the way of it." },
  { at: 63.8, label: "First watchlist", note: "Something useful to do while the account activates." },
  { at: 72.5, label: "Home", note: "Into the app, with a tracker showing when you can trade." },
];

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

const CHANGES = [
  {
    title: "Give people a reason to start",
    problem: "The first screen was a bare sign-up form, asking for KYC before saying anything about us.",
    change: "A welcome that answers the first doubts: SEBI registered, ₹0 to open, rated 4.3.",
    before: [["o03", "Old sign up or log in screen"]],
    after: [["n00", "New welcome screen with trust signals"]],
  },
  {
    title: "Turn PAN entry into a confirmation",
    problem: "60% of the drop-off. A primer, a DigiLocker login, then PAN details checked line by line.",
    change: "PAN is fetched from the mobile number and shown as a card to confirm. Edit stays one tap away.",
    result: ["−16%", "drop-offs at PAN"],
    before: [["o10", "DigiLocker login"], ["o14", "Confirm PAN details form"], ["o15", "PAN details with consent"]],
    after: [["n07", "Securely fetching details sheet"], ["n08", "Confirm PAN shown as a PAN card"]],
  },
  {
    title: "Remove the ₹1 bank payment",
    problem: "Leave the app, pay ₹1 over UPI, enter a PIN, wait for the refund.",
    change: "Bank details are fetched and shown as a card under the PAN. Nobody leaves the app.",
    result: ["−50%", "drop-offs at bank verification"],
    before: [["o22", "Pick a UPI app to pay ₹1"], ["o24", "Enter UPI PIN"]],
    after: [["n09", "Confirm bank details card"]],
  },
  {
    title: "Bring personal details onto one screen",
    problem: "A primer and five single-question screens, for answers we mostly already had.",
    change: "Fetched details arrive pre-filled on one card. Each section folds into a tick once confirmed.",
    before: [],
    beforeWide: ["ao2_personal", "AO 2.0 personal details: a primer followed by five single-question screens"],
    after: [["n10", "Personal details pre-filled on one card"], ["n11", "All details confirmed"]],
  },
  {
    title: "Let people add a nominee later",
    problem: "Most people skip it, but saying yes opened up to 22 screens before the account.",
    change: "One question, with “I'll do it later” as an equal choice. The nominee can be added from the profile.",
    before: [["o38", "Nominee name field"], ["o42", "Nominee relation"], ["o46", "Nominee address"]],
    after: [["n21", "Would you like to add a nominee? with No, I'll do it later"]],
  },
  {
    title: "Make the end of KYC a starting point",
    problem: "A congratulations screen, then a Plus trial upsell, at a point where nobody could trade yet.",
    change: "A live activation tracker, and a nudge to build a watchlist while the account gets ready.",
    before: [["o67", "Congratulations, application submitted"], ["p1", "15-day Plus free trial interstitial"]],
    after: [["n28", "Account activation in progress"], ["n29", "Explore with an activation tracker"]],
  },
] as {
  title: string;
  problem: string;
  change: string;
  result?: [string, string];
  before: string[][];
  beforeWide?: string[];
  after: string[][];
}[];

const MOMENTS = [
  ["m0_first", "Trust", "Who we are, before we ask"],
  ["m1_contact", "Effort", "The OTP fills itself in"],
  ["m2_fetch", "Trust", "You can see what we're fetching"],
  ["m3_visual", "Clarity", "Your PAN looks like your PAN"],
  ["m4_cta", "Clarity", "Clear buttons on every confirm"],
  ["m6_wins", "Momentum", "A small win after each step"],
  ["m7_invite", "Clarity", "Segments offered, not demanded"],
  ["m8_done", "Momentum", "A finish that leads somewhere"],
] as const;

// measured auto-fetch results: [what, drop-off change, note, conversion with fetch, without]
const FETCHED = [
  ["Bank auto-fetch · Decentro", "−50%", "drop-offs at bank verification", 60, 4],
  ["PAN auto-fetch · Equifax", "−16%", "drop-offs at PAN", 35, 10],
  ["KRA 2.0", "−7%", "DigiLocker and PAN drop-offs", 54, 8],
] as const;

/* ---------- page ----------------------------------------------------------- */

export default function AccountOpening() {
  const next = cases.find((c) => c.slug !== "account-opening")!;

  return (
    <Choreo>
      {/* ---------- hero: a statement, one phone, one number ---------- */}
      <header
        className="relative flex min-h-svh flex-col overflow-hidden px-4 pb-10 pt-28 text-[#141217] sm:px-10"
        style={{ background: "radial-gradient(80% 90% at 72% 45%, #f8f7fb 0%, #ebe8f1 55%, #dedae7 100%)" }}
      >
        <div className="flex items-start justify-between">
          <p data-label data-load className="label !text-[#141217]/55">[ Selected work — 01 / Upstox ]</p>
          <p data-label data-load data-delay="0.2" className="label hidden !text-[#141217]/55 md:block">Account Opening 3.0 · 2026</p>
        </div>

        <div className="grid flex-1 items-center gap-12 py-10 md:grid-cols-[1.05fr_1fr] md:gap-6 md:py-0">
          <div className="relative">
            <h1
              data-split="words"
              data-load
              data-delay="0.15"
              className="max-w-[16ch] text-[12vw] font-semibold leading-[0.95] tracking-[-0.05em] md:text-[5.2vw]"
            >
              Making it easier to start investing.
            </h1>
            <p data-fade data-load data-delay="0.6" className="mt-6 max-w-md text-lg text-[#141217]/65">
              Account opening on Upstox, redesigned around the work people had to do, and what they came to do next.
            </p>

            <div data-fade data-load data-delay="0.8" className="mt-12 flex items-end gap-6">
              <b className="shrink-0 whitespace-nowrap text-[17vw] font-semibold leading-[0.8] tracking-[-0.06em] md:text-[7vw]" style={{ color: RED }}>
                8–12
              </b>
              <span className="max-w-[13rem] pb-1 text-sm leading-snug text-[#141217]/60">
                minutes to open an account when we started, after two redesigns.
              </span>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 md:grid-cols-4">
              {[
                ["Role", "Lead product designer"],
                ["With", "PMs, engineering, KYC vendors"],
                ["Scope", "Diagnosis to handoff"],
                ["Platform", "Upstox mobile app"],
              ].map(([k, v], i) => (
                <div key={k} className="relative py-4">
                  <span data-grow data-load data-delay={(0.9 + i * 0.08).toFixed(2)} className="absolute inset-x-0 top-0 h-px bg-[#141217]/15" />
                  <dt data-fade data-load data-delay={(1 + i * 0.08).toFixed(2)} className="label !text-[#141217]/45">{k}</dt>
                  <dd data-fade data-load data-delay={(1.05 + i * 0.08).toFixed(2)} className="mt-1 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-fade data-load data-delay="0.4">
            <HeroPhone
              src={`${IMG}/ao3-hero.mp4`}
              poster={`${IMG}/ao3-hero-poster.jpg`}
              label="Recording from the AO 3.0 prototype: details are fetched securely, then the PAN appears as a card to confirm"
            />
          </div>
        </div>
      </header>

      {/* ---------- 01 the problem ---------- */}
      <Chapter n="01" label="The problem" title="We had redesigned account opening twice. People were still dropping off.">
        <Lede>
          Before anyone can buy a share, they finish KYC: PAN, bank, personal details, signature, selfie and an Aadhaar eSign. Each earlier version fixed the thing it thought was wrong.
        </Lede>
        <div className="mt-16 flex flex-col gap-16">
          {[
            ["AO 1.0", "Too much on every screen", "Dense forms, several questions at once, long declarations. 24 steps, and every one looked like work.", "ao1_flow", "AO 1.0: 24 numbered screens from email entry to application submitted"],
            ["AO 2.0 · Sept 2025", "Less on each screen, more screens", "We went after cognitive load: one question per screen, a primer before each section, lots of visual help. Every screen got easier. The journey got longer.", "ao2_flow", "AO 2.0: 16 numbered steps with primers and branched flows"],
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

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">After 2.0 launched</h3>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="31%" label="dead clicks at launch (10.4% after fixes)" bad />
          <Stat value="18 min" label="to onboard at launch (12 min after fixes)" bad delay={0.06} />
          <Stat value="17.7%" label="conversion in Oct 2025, against ~30% for 1.0" bad delay={0.12} />
          <Stat value="~28%" label="by Feb 2026, roughly back where 1.0 had been" delay={0.18} />
        </div>
      </Chapter>

      {/* the takeaway, read word by word */}
      <section className="px-4 py-32 sm:px-10 md:py-48">
        <p data-label className="label mb-10 text-center">[ Where that left us ]</p>
        <p data-scrub-words className="mx-auto max-w-5xl text-center text-4xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[4.4vw]">
          Every screen was easier to get through. The whole thing still felt long.
        </p>
      </section>

      {/* ---------- 02 the investigation: evidence first ---------- */}
      <Chapter n="02" label="The investigation" title="The biggest drop wasn’t at the end. It was at PAN verification.">
        <Lede>I mapped the funnel stage by stage: where people left, and what each stage asked of them.</Lede>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-14">
          <div data-fade className="lg:pt-6">
            <b data-count className="block text-[28vw] font-semibold leading-[0.8] tracking-[-0.07em] lg:text-[9vw]" style={{ color: RED }}>
              60%
            </b>
            <p className="mt-5 max-w-[15rem] text-muted">of all drop-off happened at one step. No other stage lost more than 4%.</p>
          </div>
          <div>
            <div className="label grid grid-cols-[1fr_5rem] gap-4 pb-3 md:grid-cols-[12rem_8rem_1fr]">
              <span>Stage in AO 2.0</span>
              <span>Drop-off</span>
              <span className="hidden md:block">What it asked for</span>
            </div>
            {JOURNEY.map(([stage, drop, ask], i) => {
              const cliff = drop >= 50;
              return (
                <div
                  key={stage}
                  data-fade
                  data-delay={(i * 0.04).toFixed(2)}
                  className={`relative grid grid-cols-[1fr_5rem] items-baseline gap-4 py-3.5 md:grid-cols-[12rem_8rem_1fr] ${cliff ? "-mx-4 px-4" : ""}`}
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
                  <span className="col-span-2 text-sm text-muted md:col-span-1">{ask}</span>
                </div>
              );
            })}
          </div>
        </div>

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">The same three things kept coming up</h3>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Typing what we could fetch", "PAN, bank and personal details, entered by hand when vendors could supply them."],
            ["Doing things twice", "Two OTPs to sign up, two more for bank statements, confirm after every capture."],
            ["Not knowing what’s next", "Primers, upsells and a “KYC needed” screen between people and the next real step."],
          ].map(([h, p], i) => (
            <div key={h} data-fade data-delay={i * 0.08} className="group rounded-2xl bg-card p-7 transition-colors duration-500 hover:bg-ink hover:text-bg">
              <span className="font-mono text-xs text-muted group-hover:text-bg/50">{String(i + 1).padStart(2, "0")}</span>
              <b className="mt-12 block text-xl font-semibold tracking-[-0.02em]">{h}</b>
              <p className="mt-2 text-sm text-muted transition-colors duration-500 group-hover:text-bg/65">{p}</p>
            </div>
          ))}
        </div>

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">Eight other apps, recorded end to end</h3>
        <p data-fade className="mt-4 max-w-2xl text-muted">
          Upstox was the slowest. The fastest fetched PAN and most of the profile from the phone number, so people only confirmed.
        </p>
        <div className="mt-12" role="figure" aria-label="Minutes to open an account across nine apps">
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
      </Chapter>

      {/* ---------- 03 the reframe (inverted) ---------- */}
      <section className="bg-ink px-4 py-28 text-bg sm:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <p data-label className="label !text-bg/60 md:col-span-2">[ 03 — The reframe ]</p>
          <div className="md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[4.6vw]">
              Fewer screens didn’t mean less effort.
            </h2>
            <p data-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-bg/70 md:text-xl">
              1.0 put too much on each screen. 2.0 had too many of them. In both, people were still typing, checking and waiting. So the question changed from how many screens to how much work each step asks for.
            </p>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Fetch, don’t ask", "If a vendor can give us the data, we don’t ask people to type it."],
                ["02", "Confirm, don’t repeat", "When we already know something, the step is a quick review."],
                ["03", "Keep the momentum", "Always show what’s next. Nothing that can wait sits in the way."],
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

      {/* ---------- 04 the redesign: before / after ---------- */}
      <Chapter n="04" label="The redesign" title="Six changes, each aimed at a specific kind of effort.">
        <div className="mt-10">
          {CHANGES.map((b, i) => (
            <div key={b.title} className="border-t border-line py-16 first:border-t-0 first:pt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 data-split="lines" className="text-3xl font-semibold tracking-[-0.035em]">{b.title}</h3>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div data-fade className="flex flex-col gap-5 rounded-2xl bg-card p-5">
                  <div>
                    <span className="label">Before</span>
                    <p className="mt-2 min-h-[3rem] text-sm text-muted">{b.problem}</p>
                  </div>
                  {b.beforeWide ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${IMG}/${b.beforeWide[0]}.webp`} alt={b.beforeWide[1]} loading="lazy" width={2402} height={1364} className="mt-auto h-auto w-full rounded-xl ring-1 ring-black/10 grayscale-[30%]" />
                  ) : (
                    <div className="mt-auto grid grid-cols-3 gap-3">
                      {b.before.map(([src, alt]) => (
                        <Phone key={src} src={src} alt={alt} className="grayscale-[30%]" />
                      ))}
                    </div>
                  )}
                </div>
                <div data-fade data-delay="0.12" className="relative flex flex-col gap-5 rounded-2xl p-5 ring-1 ring-ink/15">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span className="label !text-ink">After</span>
                      <p className="mt-2 min-h-[3rem] text-sm text-muted">{b.change}</p>
                    </div>
                    {b.result ? (
                      <div className="shrink-0 text-right">
                        <b data-count className="block text-4xl font-semibold tabular-nums tracking-[-0.05em] md:text-5xl">{b.result[0]}</b>
                        <span className="mt-1 block max-w-[8rem] text-[11px] leading-tight text-muted">{b.result[1]}, measured</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-3">
                    {b.after.map(([src, alt]) => (
                      <Phone key={src} src={src} alt={alt} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- the whole journey, recorded from the prototype ---------- */}
      <section className="bg-ink px-4 py-28 text-bg sm:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <p data-label className="label !text-bg/60 md:col-span-2">[ 04b — The whole journey ]</p>
          <div className="md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="max-w-3xl text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[3.5vw]">
              Sign-up to a first watchlist, in one take.
            </h2>
            <p data-fade className="mt-6 max-w-xl text-bg/65">
              Recorded straight from the prototype, at real speed. Most of the motion is there to show progress, so tap a step to jump to it.
            </p>
          </div>
        </div>
        <div className="mt-16 md:mt-20 md:pl-[calc(33.333%+0.75rem)]">
          <FlowVideo src={`${IMG}/ao3-flow.mp4`} poster={`${IMG}/ao3-flow-poster.jpg`} chapters={CHAPTERS} />
        </div>
      </section>

      {/* ---------- visual direction ---------- */}
      <Chapter n="04c" label="Visual direction" title="Choosing how it should feel.">
        <Lede>
          Leadership asked for a guided setup that felt light, not like a form. We tried two directions, then one expressive idea against something we could keep up across every step.
        </Lede>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["mood2", "Explored", "Concept 02 · story-led", "Personal and relatable, drawn from people’s daily routines.", "Concept 02 mood board: a desk with a newspaper and chai"],
            ["mood1", "Chosen", "Concept 01 · glass, light", "Premium and modern, and still recognisably Upstox.", "Concept 01 mood board: glass forms and soft gradients"],
            ["", "Explored", "An expressive reveal", "Too complex to keep consistent across the KYC flow.", "“Hand reveal” for the PAN card"],
            ["m3_visual", "Final", "Auto-expanding sections", "Keeps the reveal, works for every section, and gives the flow a rhythm.", "Auto-expanding PAN, bank and personal sections"],
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

      {/* ---------- small moments: columns drift at different speeds ---------- */}
      <Chapter n="04d" label="Small moments" title="The details that keep people going.">
        <Lede>Most of these answer a doubt before it turns into a reason to leave.</Lede>
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

      {/* ---------- 05 the outcome: improved / expected / still open ---------- */}
      <Chapter n="05" label="The outcome" title="Less manual work, measured. The rest, still being proven.">
        <div className="mt-14 flex items-center gap-3">
          <Chip tone="ink">Measured</Chip>
          <span className="text-sm text-muted">Live auto-fetch, conversion with and without it</span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FETCHED.map(([top, big, note, withF, without], i) => (
            <div key={top} data-fade data-delay={i * 0.08} className="flex flex-col rounded-2xl bg-ink p-7 text-bg">
              <span className="label !text-bg/55">{top}</span>
              <b data-count className="mt-10 block text-6xl font-semibold tabular-nums tracking-[-0.05em]">{big}</b>
              <p className="mt-2 text-sm text-bg/65">{note}</p>
              <div className="mt-8 flex flex-col gap-3 border-t border-bg/15 pt-5 font-mono text-[11px] text-bg/60">
                {[
                  ["Fetched", withF, "var(--bg)"],
                  ["Manual", without, "rgba(255,255,255,0.3)"],
                ].map(([k, v, c]) => (
                  <div key={k as string} className="grid grid-cols-[4rem_1fr_2.5rem] items-center gap-3">
                    <span>{k}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-bg/10">
                      <span data-grow className="block h-full rounded-full" style={{ width: `${v}%`, background: c as string }} />
                    </span>
                    <span className="text-right tabular-nums">{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex items-center gap-3">
          <Chip tone="red">Projected</Chip>
          <span className="text-sm text-muted">From the research phase, to be measured once 3.0 ships</span>
        </div>
        <div className="mt-8 grid grid-cols-1 border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          {[
            ["8–12", "~2", "minutes to submit on the happy path"],
            ["11", "7", "steps on the happy path, most of them confirmations"],
            ["28%", "~35%", "of people who start, finishing"],
          ].map(([from, to, s], i) => (
            <div key={s} data-fade data-delay={i * 0.08} className="py-8 md:px-6 md:first:pl-0">
              <div className="flex items-baseline gap-3 font-semibold tracking-[-0.05em]">
                <span className="text-2xl text-muted line-through decoration-1">{from}</span>
                <span className="text-muted">→</span>
                <b className="text-6xl tabular-nums">{to}</b>
              </div>
              <p className="mt-3 text-sm text-muted">{s}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex items-center gap-3">
          <Chip>Still open</Chip>
          <span className="text-sm text-muted">What we’re watching next</span>
        </div>
        <ul className="mt-6 grid gap-x-6 md:grid-cols-3">
          {[
            ["Effort", "Does manual typing keep falling as vendor coverage grows?"],
            ["Completion", "Does drop-off at PAN stay down once 3.0 is live for everyone?"],
            ["Activation", "Do more new accounts make a first investment, and does moving F&O after eSign cost us F&O users?"],
          ].map(([h, p], i) => (
            <li key={h} data-fade data-delay={i * 0.08} className="relative py-6">
              <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
              <h4 className="text-lg font-semibold tracking-[-0.02em]">{h}</h4>
              <p className="mt-2 text-sm text-muted">{p}</p>
            </li>
          ))}
        </ul>
      </Chapter>

      {/* ---------- 06 the next step ---------- */}
      <Chapter n="06" label="The next step" title="Getting people through KYC was only half the job.">
        <div className="mt-8 grid gap-6 text-muted md:grid-cols-2">
          <p data-fade>
            An open account and a first investment are two different things. Finishing KYC doesn’t mean someone knows what to do next, so 3.0 carries on past the last KYC step.
          </p>
          <p data-fade data-delay="0.1">
            While the account activates, people build a watchlist. Once it’s ready, alerts on those stocks give them a reason to make a first trade. The same nudge setup can carry other prompts across the app.
          </p>
        </div>
      </Chapter>

      {/* ---------- 07 reflection ---------- */}
      <Chapter n="07" label="Reflection" title="I stopped counting screens and started looking at effort.">
        <div className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
          <p data-fade>
            A flow can have fewer screens and still be tiring. Sometimes a confirmation does more than a better form, and sometimes the best thing to do with a screen is remove the reason it exists.
          </p>
          <p data-fade className="mt-6">
            Not every fix here was a design fix. Auto-fetch did more for speed than any layout change, and getting it in meant working with PMs and vendors, not just in Figma.
          </p>
          <p data-fade className="mt-6">
            For an investing app, an open account isn’t the goal. It’s where investing starts.
          </p>
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
