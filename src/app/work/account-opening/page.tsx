import Link from "next/link";
import type { Metadata } from "next";
import { cases } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { HScroll } from "@/components/HScroll";
import { RollButton } from "@/components/RollButton";

// Account Opening 3.0, revised. Structure follows the user's storytelling
// blueprint (problem → investigation → reframe → redesign → outcome → next
// step → reflection). Screens live in /public/work/ao3.

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

function Body({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p data-fade className={`mt-6 max-w-2xl leading-relaxed text-muted ${className}`}>
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

const CHANGES = [
  {
    title: "Give people a reason to start",
    problem: "The first screen was a bare sign-up form with our licences in the footer. We were asking people to begin KYC before telling them anything about us.",
    change: "A welcome screen that answers the first questions people have: is this regulated, what does it cost, do other people use it. SEBI registration, ₹0 account opening and the app rating all sit above the first ask.",
    before: [["o03", "Old sign up or log in screen"]],
    beforeCap: "A sign-up form, licences in the footer.",
    after: [["n00", "New welcome screen with trust signals"]],
    afterCap: "SEBI registered, ₹0 account opening fee, a 4.3 rating, before anything is asked.",
  },
  {
    title: "Turn PAN entry into a confirmation",
    problem: "This is where 60% of the drop-off happened. People went through a primer, logged in to DigiLocker, and then checked their PAN details line by line. If any of that failed, they typed it in themselves.",
    change: "We fetch PAN details from the mobile number through a vendor, show what's being fetched while it happens, and present the result as a PAN card to confirm. Anyone whose details are wrong can still edit them.",
    result: "PAN auto-fetch: 16% fewer drop-offs at this step",
    before: [["o10", "DigiLocker login"], ["o14", "Confirm PAN details form"], ["o15", "PAN details with consent"]],
    beforeCap: "A primer, a DigiLocker login, then PAN details to check line by line.",
    after: [["n07", "Securely fetching details sheet"], ["n08", "Confirm PAN shown as a PAN card"]],
    afterCap: "A checklist while details are fetched, then the PAN as a card.",
  },
  {
    title: "Remove the ₹1 bank payment",
    problem: "To verify a bank account, people left the app, paid ₹1 over UPI, entered their PIN and waited for the refund. It was a payment in the middle of a sign-up.",
    change: "Bank details are fetched from the mobile number and shown as a card under the confirmed PAN. Nobody has to leave the app.",
    result: "Bank auto-fetch: 50% fewer drop-offs at this step",
    before: [["o22", "Pick a UPI app to pay ₹1"], ["o24", "Enter UPI PIN"]],
    beforeCap: "Pick a UPI app, enter the PIN, wait for the refund.",
    after: [["n09", "Confirm bank details card"]],
    afterCap: "The bank account appears as a card under the PAN.",
  },
  {
    title: "Bring personal details onto one screen",
    problem: "AO 2.0 asked one question per screen to keep each one simple: a primer, then occupation, income, trading experience, marital status and settlement preference. Six screens for answers we mostly already had.",
    change: "The details we can fetch arrive pre-filled on a single card, grouped by section. People review them, change what's wrong, and each section folds into a tick once it's confirmed.",
    before: [],
    beforeWide: ["ao2_personal", "AO 2.0 personal details: a primer followed by five single-question screens"],
    beforeCap: "A primer, then five questions, one at a time.",
    after: [["n10", "Personal details pre-filled on one card"], ["n11", "All details confirmed"]],
    afterCap: "Fetched details on one card. Each section collapses once confirmed.",
  },
  {
    title: "Let people add a nominee later",
    problem: "Most people skip the nominee. But choosing yes opened a form of up to 22 screens, one field each, and the question sat between people and their account.",
    change: "It's now a single question with “I'll do it later” as an equal option. The nominee can be added from the profile at any time, so the decision no longer holds up account opening.",
    before: [["o38", "Nominee name field"], ["o42", "Nominee relation"], ["o46", "Nominee address"]],
    beforeCap: "Name, relation, date of birth, address, phone, email, ID and more.",
    after: [["n21", "Would you like to add a nominee? with No, I'll do it later"]],
    afterCap: "One question. Details can be added from the profile.",
  },
  {
    title: "Make the end of KYC a starting point",
    problem: "Submitting ended on a congratulations screen, followed by a Plus trial upsell, at a point where people couldn't even trade yet.",
    change: "People now land in the app with a live tracker for their account activation and a nudge to build a watchlist while they wait. When the account is ready, they already have something to act on.",
    before: [["o67", "Congratulations, application submitted"], ["p1", "15-day Plus free trial interstitial"]],
    beforeCap: "A wait screen, then an upsell.",
    after: [["n28", "Account activation in progress"], ["n29", "Explore with an activation tracker"]],
    afterCap: "Explore with an activation tracker, then a watchlist nudge.",
  },
] as {
  title: string;
  problem: string;
  change: string;
  result?: string;
  before: string[][];
  beforeWide?: string[];
  beforeCap: string;
  after: string[][];
  afterCap: string;
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
            Making it easier to start investing.
          </h1>
          <p data-fade data-load data-delay="0.6" className="mt-6 max-w-xl text-lg text-bg/70">
            Redesigning Upstox account opening to cut the work people had to do, and to give them a clear path from sign-up to their first investment.
          </p>
          <dl className="mt-12 grid gap-x-6 sm:grid-cols-2 md:max-w-[44vw]">
            {[
              ["My role", "Lead product designer. I owned the design direction and the end-to-end flow."],
              ["Worked with", "Product managers, engineering, KYC vendors"],
              ["Scope", "Funnel diagnosis, benchmarking, journey and interaction design, handoff"],
              ["Constraints", "SEBI KYC rules, what vendors could fetch, engineering feasibility"],
            ].map(([k, v], i) => (
              <div key={k} className="relative py-4">
                <span data-grow data-load data-delay={(0.7 + i * 0.08).toFixed(2)} className="absolute inset-x-0 top-0 h-px bg-bg/25" />
                <dt data-fade data-load data-delay={(0.8 + i * 0.08).toFixed(2)} className="label !text-bg/50">{k}</dt>
                <dd data-fade data-load data-delay={(0.85 + i * 0.08).toFixed(2)} className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p data-fade data-load data-delay="1.1" className="mt-6 flex items-center gap-3 text-sm text-bg/60">
            <Chip tone="red">Starting point</Chip>
            Opening an account on Upstox took 8 to 12 minutes.
          </p>
        </div>
      </header>

      {/* ---------- 01 the problem ---------- */}
      <Chapter n="01" label="The problem" title="We had redesigned account opening twice. People were still dropping off.">
        <Lede>
          Before anyone can buy a share on Upstox, they have to finish KYC: PAN, bank, personal details, signature, selfie and an Aadhaar eSign. Getting through it took 8 to 12 minutes, and most people who started never finished.
        </Lede>
        <Body>
          This wasn’t the first attempt at fixing it. Each earlier version had a clear idea of what was wrong, and each fixed that one thing.
        </Body>
        <div className="mt-16 flex flex-col gap-16">
          {[
            ["AO 1.0", "Too much on every screen", "The first version put a lot in front of people at once: dense forms, several questions per screen and long declaration lists. It ran to 24 steps, and every screen looked like work.", "ao1_flow", "AO 1.0: 24 numbered screens from email entry to application submitted"],
            ["AO 2.0 · released Sept 2025", "Less on each screen, more screens", "For 2.0 we went after cognitive load. Every step was broken into smaller screens with one question each, a primer before each section and plenty of visual help to prevent mistakes. Each screen got easier to read. The journey got longer: 16 steps on paper, many more screens and taps in practice.", "ao2_flow", "AO 2.0: 16 numbered steps with primers and branched flows"],
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

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">What happened after 2.0 launched</h3>
        <Lede>
          Each screen asked less of people, but there were far more of them. At launch almost a third of taps went nowhere, onboarding took longer than before, and conversion dropped before slowly recovering.
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
        <p data-label className="label mb-10 text-center">[ Where that left us ]</p>
        <p data-scrub-words className="mx-auto max-w-5xl text-center text-4xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[4.4vw]">
          Every screen was easier to get through. The whole thing still felt long.
        </p>
      </section>

      {/* ---------- 02 the investigation ---------- */}
      <Chapter n="02" label="The investigation" title="The biggest drop wasn’t at the end. It was at PAN verification.">
        <Lede>
          “Account opening takes too long” was too broad to design for. I mapped the whole funnel, stage by stage: where people left, and what each stage was asking them to do at that moment.
        </Lede>
        <div className="mt-14">
          <div className="label grid grid-cols-[1fr_5rem] gap-4 pb-3 md:grid-cols-[14rem_9rem_1fr]">
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
        <Body className="mt-10">
          One number stood out. Around 60% of the drop-off happened at PAN verification, so that’s where I started. When details couldn’t be pulled from DigiLocker, people fell back to typing them in, one field per screen.
        </Body>
        <Body>
          It wasn’t the only problem. Across the journey, people were typing in information we could have fetched, repeating things they had already done, and moving through screens without knowing what came next. Many of the steps were asking people to do work that didn’t get them any closer to an account.
        </Body>

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">How other apps handled it</h3>
        <Body>
          I recorded the full sign-up on eight other broking apps alongside ours. Upstox was the slowest. The fastest ones fetched PAN and most of the profile from the phone number, so people only had to check their details and confirm.
        </Body>
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
              Both earlier versions judged progress by the screens. 1.0 put too much on each one, 2.0 had too many of them. In both, people were still typing, checking and waiting. So I stopped asking how to make the journey shorter and started asking how much work each step needed from the person doing it.
            </p>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Fetch, don’t ask", "If a vendor or integration can give us the data, we use it instead of asking people to type it."],
                ["02", "Confirm, don’t repeat", "When we already have the information, the step becomes a quick review and a confirm."],
                ["03", "Keep the momentum", "People can always see how far they’ve come and what’s next. No dead ends, no decisions that can wait."],
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

      {/* ---------- 04 the redesign ---------- */}
      <Chapter n="04" label="The redesign" title="Six changes, each aimed at a specific kind of effort.">
        <div className="mt-10">
          {CHANGES.map((b, i) => (
            <div key={b.title} className="border-t border-line py-16 first:border-t-0 first:pt-6">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 data-split="lines" className="text-3xl font-semibold tracking-[-0.035em]">{b.title}</h3>
              </div>
              <div className="mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
                <div data-fade className="flex flex-col gap-2">
                  <span className="label" style={{ color: RED }}>The problem</span>
                  <p className="text-muted">{b.problem}</p>
                </div>
                <div data-fade data-delay="0.08" className="flex flex-col gap-2">
                  <span className="label !text-ink">What we did</span>
                  <p className="text-muted">{b.change}</p>
                </div>
              </div>
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
              {b.result ? (
                <p data-fade className="mt-8 flex items-center gap-3 font-medium">
                  <Chip tone="ink">Measured</Chip>
                  {b.result}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Chapter>

      {/* the new journey, sideways */}
      <HScroll
        className="bg-card"
        intro={
          <>
            <p data-label className="label mb-6">[ 04b — Put together ]</p>
            <h3 data-split="lines" className="text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-[3.4vw]">
              The new journey, mostly confirming
            </h3>
            <p data-fade className="mt-6 max-w-sm text-muted">
              Seven steps on the happy path, most of them around ten seconds. F&amp;O activation and income proof move to after the account is submitted.
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

      {/* ---------- visual direction ---------- */}
      <Chapter n="04c" label="Visual direction" title="Choosing how it should feel.">
        <Lede>
          Leadership asked for a guided setup that felt light rather than like a form. We explored two directions, then tested one expressive idea against something we could sustain across every step.
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
        <Lede>Most of these exist to answer a doubt before it turns into a reason to leave.</Lede>
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

      {/* ---------- 05 the outcome ---------- */}
      <Chapter n="05" label="The outcome" title="A shorter flow, less manual work, and a clearer path to investing.">
        <Lede>
          Some of this is live and measured. The rest is what we expect from 3.0 as a whole, and it’s labelled that way.
        </Lede>

        <h3 data-split="lines" className="mt-16 text-2xl font-semibold tracking-[-0.03em]">Measured: fetching instead of asking</h3>
        <Body>
          I worked with PMs to bring in vendor auto-fetch wherever a vendor could do the work. These are live, and they removed most of the manual entry from the journey.
        </Body>
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

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">Projected: the full 3.0 journey</h3>
        <Body>These come from the research phase and will be measured once 3.0 ships.</Body>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ["~1–2 min", "to submit on the happy path, down from 8–12"],
            ["11 → 7", "steps on the happy path, most of them confirmations"],
            ["~35%", "completion, up about 7 points from ~28%"],
          ].map(([big, s], i) => (
            <div key={big} data-fade data-delay={i * 0.08} className="flex min-h-[17rem] flex-col justify-between rounded-2xl bg-card p-7">
              <Chip tone="red">Projected</Chip>
              <div>
                <b data-count className="block whitespace-nowrap text-5xl font-semibold tabular-nums tracking-[-0.05em] lg:text-[3.4vw]">{big}</b>
                <p className="mt-3 text-sm text-muted">{s}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em]">How we’ll know it worked</h3>
        <div className="mt-8 grid gap-x-6 md:grid-cols-3">
          {[
            ["Effort", "Time to submit, taps, and how many fields people still type by hand."],
            ["Completion", "From starting KYC to an account that’s opened, with drop-off at PAN watched closely."],
            ["Activation", "From an opened account to a first investment, and whether moving F&O activation after eSign costs us F&O users."],
          ].map(([h, p], i) => (
            <div key={h} data-fade data-delay={i * 0.08} className="relative py-6">
              <span data-grow className="absolute inset-x-0 top-0 h-px bg-line" />
              <h4 className="text-xl font-semibold tracking-[-0.02em]">{h}</h4>
              <p className="mt-2 text-muted">{p}</p>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 06 the next step ---------- */}
      <Chapter n="06" label="The next step" title="Getting people through KYC was only half the job.">
        <div className="mt-8 grid gap-6 text-muted md:grid-cols-2">
          <p data-fade>
            Opening an account and making a first investment are two different things. Finishing KYC doesn’t mean someone knows what to do next, so 3.0 doesn’t stop at the last KYC step.
          </p>
          <p data-fade data-delay="0.1">
            While the account activates, people are nudged to build a watchlist, which is the one useful thing they can do before they’re able to trade. Once the account is ready, alerts on those stocks give them a reason to make a first trade. The same nudge setup can carry other prompts across the app.
          </p>
        </div>
        <div className="mt-16 grid items-center gap-10 md:grid-cols-[1fr_15rem]">
          <div>
            <p data-fade className="text-xl leading-relaxed">
              The prototype covers the whole journey: welcome, mobile and OTP, Google sign-in for email, fetched PAN, bank and personal details, signature, selfie, eSign, then Explore with the activation tracker.
            </p>
            <p data-fade data-delay="0.1" className="mt-4 text-muted">Prototype available on request.</p>
          </div>
          <div data-fade data-delay="0.15">
            <Phone src="n00" alt="The welcome screen, where the prototype journey starts" />
          </div>
        </div>
      </Chapter>

      {/* ---------- 07 reflection ---------- */}
      <Chapter n="07" label="Reflection" title="I stopped counting screens and started looking at effort.">
        <div className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
          <p data-fade>
            This project changed how I look at onboarding. A flow can have fewer screens and still be tiring. Sometimes a confirmation does more than a better form, and sometimes the best thing to do with a screen is to remove the reason it exists.
          </p>
          <p data-fade className="mt-6">
            Not every fix here was a design fix. Auto-fetch did more for speed than any layout change, and getting it in meant working closely with PMs and vendors rather than staying in the screens.
          </p>
          <p data-fade className="mt-6">
            And for an investing app, an open account isn’t the goal. It’s where investing starts, so that’s what the journey should lead to.
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
