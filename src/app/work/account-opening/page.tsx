import Link from "next/link";
import type { Metadata } from "next";
import { cases } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { RollButton } from "@/components/RollButton";
import { FlowVideo, LoopVideo } from "@/components/ao/FlowVideo";
import { HeroMock } from "@/components/ao/HeroMock";
import { IPhone } from "@/components/ao/IPhone";
import { Zoomable } from "@/components/ao/Zoomable";
import { DropOff } from "@/components/ao/DropOff";
import { BenchClocks } from "@/components/ao/Benchmark";
import { HeatScreen, ProtoEmbed } from "@/components/ao/Bits";

// Account Opening, revised. Every Version 3.0 screen and clip here is captured
// from the final prototype (see "Case study/proto-video"); screens starting with
// "o" are Version 2.0, from the older case study assets; "v2-" are rendered from the
// Version 2.0 Figma file (see "Case study/ao2-video").

export const metadata: Metadata = { title: "Account Opening — Salaath Shaikh" };

const IMG = "/work/ao3";
const RED = "#D93A2B";
const SERIF = { fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: "italic", fontWeight: 400, color: "#9b5b97" } as const;
// The prototype is served from this site so it always matches the page.
const PROTO = "/work/ao3/prototype/index.html";

/* ---------- building blocks ---------------------------------------------- */

const Label = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <p data-label className={`font-mono text-sm uppercase tracking-[0.12em] md:col-span-2 md:text-base ${light ? "text-bg/75" : "text-ink/70"}`}>[ {children} ]</p>
);

/** A real screen in an iPhone. "p/…" is final Version 3.0; anything else is older. */
function Shot({ src, alt, old }: { src: string; alt: string; old?: boolean }) {
  const final = src.startsWith("p/");
  return (
    <IPhone aspect={final ? "375/812" : "360/800"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${IMG}/${src}.${final ? "jpg" : "webp"}`} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${old ? "grayscale-[30%]" : ""}`} />
    </IPhone>
  );
}

function Clip({ src, label }: { src: string; label: string }) {
  return (
    <IPhone>
      <LoopVideo src={`${IMG}/${src}.mp4`} poster={`${IMG}/${src}-poster.jpg`} label={label} className="absolute inset-0 h-full w-full object-cover" />
    </IPhone>
  );
}

/** Chapter: label column on the left (pinned on desktop), story on the right. */
function Chapter({ n, label, title, children, className = "" }: { n: string; label: string; title: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <section className={`grid gap-10 border-t border-line px-4 py-24 sm:px-10 md:grid-cols-6 md:gap-0 md:py-36 ${className}`}>
      <div className="md:col-span-2">
        <div data-pin className="md:pr-10">
          <Label>{n} — {label}</Label>
        </div>
      </div>
      <div className="min-w-0 md:col-span-4 md:pl-3">
        <h2 data-split="lines" className="max-w-4xl text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-[3.5vw]">{title}</h2>
        {children}
      </div>
    </section>
  );
}

const Lede = ({ children }: { children: React.ReactNode }) => (
  <p data-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{children}</p>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 data-split="lines" className="mt-24 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{children}</h3>
);

function Stat({ value, label, bad, delay = 0 }: { value: string; label: string; bad?: boolean; delay?: number }) {
  return (
    <div data-fade data-delay={delay} className="flex flex-col gap-3 border-t border-ink/15 pt-5">
      <b data-count className="text-5xl font-semibold tabular-nums tracking-[-0.05em]" style={bad ? { color: RED } : undefined}>{value}</b>
      <span className="text-sm leading-snug text-muted">{label}</span>
    </div>
  );
}

function Chip({ children, tone = "line" }: { children: React.ReactNode; tone?: "line" | "ink" | "red" }) {
  const cls = tone === "ink" ? "bg-ink text-bg border-ink" : tone === "red" ? "border-transparent text-white" : "border-ink/20 text-ink";
  return (
    <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${cls}`} style={tone === "red" ? { background: RED } : undefined}>
      {children}
    </span>
  );
}

/* ---------- content ----------------------------------------------------------- */

// seconds into ao3-flow.mp4 where each part of the journey starts
const CHAPTERS = [
  { at: 0, label: "Welcome", note: "Who we are and what it costs, before we ask for anything." },
  { at: 5.3, label: "Mobile and OTP", note: "The OTP is read from messages and fills itself in." },
  { at: 14.5, label: "Email", note: "One tap with Google instead of typing an address." },
  { at: 19.4, label: "Confirm PAN, bank, personal", note: "Details are fetched while you watch, then confirmed card by card." },
  { at: 42.1, label: "Signature", note: "Draw it, or tap to sign. A small win when it's saved." },
  { at: 53.6, label: "Selfie", note: "A quick tip, the camera, done." },
  { at: 63.8, label: "Three quick questions", note: "Trading experience, segments and nominee, on a single screen." },
  { at: 73.2, label: "Aadhaar eSign", note: "Inside the app, with the OTP filled in for you." },
  { at: 88.3, label: "F&O activation", note: "Offered after submitting, not in the way of it." },
  { at: 92.2, label: "Link a bank for income proof", note: "Two OTPs filled in for you, one account to pick, and the statement is shared." },
  { at: 106.9, label: "Activation tracker", note: "Where the application stands, and when you can trade." },
  { at: 113.4, label: "First watchlist", note: "Something useful to do while the account activates." },
  { at: 129.7, label: "Home", note: "Into the app, with a tracker showing when you can trade." },
];

const CHANGES = [
  {
    title: "Give people a reason to start",
    problem: "The first screen was a bare sign-up form, asking for KYC before saying anything about us.",
    change: "A welcome that answers the first doubts: SEBI registered, ₹0 to open, rated 4.3.",
    before: [["o03", "Version 2.0 sign up or log in screen"]],
    after: [["p/welcome", "Version 3.0 welcome screen with trust signals"]],
  },
  {
    title: "Turn PAN entry into a confirmation",
    problem: "59% of people left here. A primer, a DigiLocker login, then PAN details checked line by line.",
    change: "PAN is fetched from the mobile number and shown as a card to confirm. Edit stays one tap away.",
    result: ["−16%", "drop-offs at PAN"],
    before: [["o10", "DigiLocker login"], ["o14", "Confirm PAN details form"], ["o15", "PAN details with consent"]],
    after: [["p/fetch", "Securely fetching details sheet"], ["p/pan", "Confirm PAN shown as a PAN card"]],
  },
  {
    title: "Remove the ₹1 bank payment",
    problem: "Leave the app, pay ₹1 over UPI, enter a PIN, wait for the refund.",
    change: "Bank details are fetched and shown as a card under the PAN. Nobody leaves the app.",
    result: ["−50%", "drop-offs at bank verification"],
    before: [["o22", "Pick a UPI app to pay ₹1"], ["o24", "Enter UPI PIN"]],
    after: [["p/bank", "Confirm bank details card"]],
  },
  {
    title: "Bring personal details onto one screen",
    problem: "A primer and five single-question screens, for answers we mostly already had.",
    change: "Fetched details arrive pre-filled on one card, and confirmed sections stack up above it.",
    before: [],
    beforeWide: ["ao2_personal", "Version 2.0 personal details: a primer followed by five single-question screens"],
    after: [["p/personal", "Personal details pre-filled on one card"]],
  },
  {
    title: "Take the nominee form out of the journey",
    problem: "Most people skip it, but saying yes opened up to 22 screens before the account.",
    change: "The long form is gone from the flow. Nominee is now one yes-or-no question on the same screen as two others, and can be added later from the accounts section.",
    before: [["o38", "Nominee name field"], ["o42", "Nominee relation"], ["o46", "Nominee address"]],
    after: [["p/questions", "Three quick questions on one screen, including nominee"]],
  },
  {
    title: "Make the end of KYC a starting point",
    problem: "A congratulations screen, then a Plus trial upsell, at a point where nobody could trade yet.",
    change: "A live activation tracker, then a first watchlist to build while the account gets ready.",
    before: [["o67", "Congratulations, application submitted"], ["p1", "15-day Plus free trial interstitial"]],
    after: [["p/waiting", "Account activation in progress"], ["p/home", "Home with an activation tracker"]],
  },
] as { title: string; problem: string; change: string; result?: [string, string]; before: string[][]; beforeWide?: string[]; after: string[][] }[];

const MOMENTS = [
  ["coin", "Trust", "The coin settles before anything is asked of you"],
  ["otp", "Effort", "The OTP arrives and fills itself in"],
  ["fetch", "Trust", "You can see what's being fetched"],
  ["cards", "Clarity", "Your details stack up as you confirm them"],
  ["sign", "Momentum", "A small win when the signature is saved"],
  ["selfie", "Momentum", "The same win after the selfie"],
  ["clock", "Clarity", "A clock that makes the wait feel like progress"],
  ["alerts", "Momentum", "Alerts draw themselves, then you're all set"],
] as const;

// heat spots are in % of the screen, placed from the Version 2.0 click-map slide
const HEAT = [
  { src: `${IMG}/v2-going.webp`, alt: "Version 2.0: Get going in 3 steps", note: "Tapping steps that look clickable but aren't", spots: [{ x: 80, y: 42, r: 26, hot: true }, { x: 64, y: 49, r: 20 }, { x: 72, y: 52, r: 16 }, { x: 86, y: 92, r: 20 }, { x: 10, y: 92, r: 12 }], trail: [[60, 52], [68, 50], [74, 47], [82, 42], [70, 50], [64, 53]] },
  { src: `${IMG}/v2-sign.webp`, alt: "Version 2.0: Draw your signature", note: "Pressing Next around the signature", spots: [{ x: 60, y: 93, r: 18 }, { x: 72, y: 95, r: 22, hot: true }, { x: 84, y: 92, r: 18, hot: true }] },
  { src: `${IMG}/v2-photo.webp`, alt: "Version 2.0: Click a photo", note: "Tapping the illustration", spots: [{ x: 72, y: 32, r: 24, hot: true }, { x: 46, y: 50, r: 14 }, { x: 80, y: 92, r: 18 }], trail: [[72, 32], [75, 55], [77, 90]] },
  { src: `${IMG}/v2-upi.webp`, alt: "Version 2.0: Verify bank with UPI", note: "Repeated taps on the payment options", spots: [{ x: 86, y: 33, r: 22, hot: true }, { x: 46, y: 41, r: 14 }, { x: 80, y: 92, r: 18 }] },
];

const PAN_ROUTE = [
  ["v2-pan1", "DigiLocker login"],
  ["v2-pan2", "DigiLocker OTP"],
  ["v2-pan3", "DigiLocker consent"],
  ["v2-pan4", "Enter PAN"],
  ["v2-pan5", "PAN entered"],
  ["v2-pan6", "Confirm PAN details"],
];

/* ---------- page ----------------------------------------------------------- */

export default function AccountOpening() {
  const next = cases.find((c) => c.slug !== "account-opening")!;

  return (
    <Choreo>
      {/* ---------- hero: a statement, one phone, one number ---------- */}
      <header className="relative flex min-h-svh flex-col overflow-hidden px-4 pb-10 pt-28 text-[#141217] sm:px-10" style={{ background: "#e4e4e6" }}>
        <HeroMock
          image={`${IMG}/hero-mock.jpg`}
          src={`${IMG}/ao3-hero.mp4`}
          poster={`${IMG}/ao3-hero-poster.jpg`}
          label="Recording from the Version 3.0 prototype: details are fetched securely, then the PAN appears as a card to confirm"
          className="pointer-events-none absolute -right-[16vw] bottom-0 hidden h-[112%] [mask-image:linear-gradient(90deg,transparent_0,#000_24%)] md:block"
        />

        <div className="relative z-10 flex items-start justify-between">
          <p data-label data-load className="label !text-[#141217]/60">[ Selected work — 01 / Upstox ]</p>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center py-10 md:max-w-[52vw]">
          <h1 data-split="words" data-load data-delay="0.15" className="max-w-[16ch] text-[12vw] font-semibold leading-[0.95] tracking-[-0.05em] md:text-[5.2vw]">
            Making it easier to start investing.
          </h1>
          <p data-fade data-load data-delay="0.6" className="mt-6 max-w-md text-lg text-[#141217]/65">
            Account opening on Upstox, redesigned around the work people had to do, and what they came to do next.
          </p>
          <div data-fade data-load data-delay="0.8" className="mt-10 flex items-end gap-6">
            <b className="shrink-0 whitespace-nowrap text-[17vw] font-semibold leading-[0.8] tracking-[-0.06em] md:text-[7vw]" style={{ color: RED }}>10–12</b>
            <span className="max-w-[13rem] pb-1 text-sm leading-snug text-[#141217]/60">minutes to open an account when we started, after two redesigns.</span>
          </div>
          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 md:grid-cols-4">
            {[
              ["Role", "Lead product designer"],
              ["Timeline", "April to May, 45 days"],
              ["Released", "October 2026"],
              ["Vendors", "Ignosis, Equifax, Decentro"],
              ["Team", "Salaath, Lead PD · Sathvik, PD · Sydney, Product manager · Engineering team"],
            ].map(([k, v], i) => (
              <div key={k} className={`relative py-4 ${k === "Team" ? "col-span-full" : ""}`}>
                <span data-grow data-load data-delay={(0.9 + i * 0.08).toFixed(2)} className="absolute inset-x-0 top-0 h-px bg-[#141217]/15" />
                <dt data-fade data-load data-delay={(1 + i * 0.08).toFixed(2)} className="label !text-[#141217]/50">{k}</dt>
                <dd data-fade data-load data-delay={(1.05 + i * 0.08).toFixed(2)} className="mt-1 text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative -mx-4 sm:-mx-10 md:hidden">
          <HeroMock image={`${IMG}/hero-mock.jpg`} src={`${IMG}/ao3-hero.mp4`} poster={`${IMG}/ao3-hero-poster.jpg`} label="Recording from the Version 3.0 prototype" className="relative w-full" />
        </div>
      </header>

      {/* ---------- 01 the problem ---------- */}
      <Chapter n="01" label="The problem" title="We had redesigned account opening twice. People were still dropping off.">
        <Lede>
          Before anyone can buy a share, they finish KYC: PAN, bank, personal details, signature, selfie and an Aadhaar eSign. Each earlier version fixed the thing it thought was wrong.
        </Lede>
        <div className="mt-16 flex flex-col gap-16">
          {([
            ["Version 1.0", "Too much on every screen", "Dense forms, several questions at once, long declarations. 24 steps, and every one looked like work.", "ao1_flow", "Version 1.0: 24 numbered screens from email entry to application submitted", 2298, 1288],
            ["Version 2.0 · Sept 2025", "Less on each screen, more screens", "We went after cognitive load: one question per screen, a primer before each section, lots of visual help. Every screen got easier. The journey got longer.", "ao2_flow", "Version 2.0: every screen of the happy path, in order", 4410, 3419],
          ] as const).map(([chip, h, p, img, alt, w, hh]) => (
            <div key={chip}>
              <div className="grid gap-4 md:grid-cols-2">
                <div data-fade className="flex flex-col gap-3">
                  <Chip>{chip}</Chip>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">{h}</h3>
                </div>
                <p data-fade data-delay="0.1" className="text-muted">{p}</p>
              </div>
              <figure data-wipe className="mt-8 overflow-hidden rounded-2xl bg-card ring-1 ring-black/5">
                <Zoomable src={`${IMG}/${img}.webp`} alt={alt} width={w} height={hh}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img data-wipe-inner src={`${IMG}/${img}.webp`} alt={alt} loading="lazy" width={w} height={hh} className="block h-auto w-full" />
                </Zoomable>
              </figure>
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-10 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-14">
          <div data-fade className="mx-auto w-[62vw] max-w-[17rem] md:w-full">
            <IPhone aspect="360/800">
              <LoopVideo src={`${IMG}/ao2-flow.mp4`} poster={`${IMG}/ao2-flow-poster.jpg`} label="Tapping through the Version 2.0 Figma prototype, from the phone's home screen to the app" className="absolute inset-0 h-full w-full object-cover" />
            </IPhone>
          </div>
          <div>
            <Chip>Version 2.0, tap by tap</Chip>
            <p data-fade className="mt-6 text-3xl font-medium leading-[1.1] tracking-[-0.03em] md:text-[2.6vw]">Watch it to feel how long it goes on.</p>
            <p data-fade data-delay="0.1" className="mt-5 max-w-md text-muted">
              Every tap on the happy path, from the Figma prototype, sped up to a minute and a half. Filling it in for real took 10–12 minutes.
            </p>
          </div>
        </div>

        <H3>After Version 2.0 launched</H3>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="31%" label="dead clicks at launch (10.4% after fixes)" bad />
          <Stat value="18 min" label="to onboard at launch (12 min after fixes)" bad delay={0.06} />
          <Stat value="17.7%" label="conversion in Oct 2025, against ~30% for Version 1.0" bad delay={0.12} />
          <Stat value="~28%" label="by Feb 2026, roughly back where Version 1.0 had been" delay={0.18} />
        </div>
      </Chapter>

      {/* the takeaway, read word by word */}
      <section className="px-4 py-32 sm:px-10 md:py-48">
        <p data-label className="label mb-10 text-center !text-sm">[ Where that left us ]</p>
        <p data-scrub-words className="mx-auto max-w-5xl text-center text-4xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[4.4vw]">
          Every screen was easier to get through. The whole thing still felt long.
        </p>
      </section>

      {/* ---------- 02 the investigation ---------- */}
      <Chapter n="02" label="The investigation" title="The biggest drop wasn’t at the end. It was at PAN verification.">
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="~28%" label="of people complete the full Version 2.0 flow" />
          <Stat value="10–12 min" label="average time to complete" delay={0.06} />
          <Stat value="11" label="steps" delay={0.12} />
          <Stat value="30" label="screens" delay={0.18} />
        </div>

        <H3>Where people left</H3>
        <DropOff />

        <H3>What Verify PAN asked for</H3>
        <p data-fade className="mt-4 max-w-2xl text-muted">
          Right after sign-up, with no warning that KYC was coming: a DigiLocker login with its own OTP, a consent screen, then a PAN typed in by hand and checked.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-3 md:grid-cols-6">
          {PAN_ROUTE.map(([src, alt], i) => (
            <figure key={src} data-fade data-delay={i * 0.05}>
              <Shot src={src} alt={alt} />
              <figcaption className="mt-2 text-xs leading-snug text-muted">{alt}</figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <p data-fade className="text-3xl font-medium leading-[1.1] tracking-[-0.03em] md:text-[2.6vw]">
            The 59% drop at PAN is an intent problem. When people sign up, they don’t expect to enter PAN details or do KYC.
          </p>
          <div className="flex flex-col">
            {[
              ["60%", "are gone in the first three steps, so most starters never see bank verification. It rises to 72% for non-KRA users."],
              ["Nudges", "on and off the app weren’t recovering PAN drop-offs. It could be low trust, or no intent to continue."],
              ["2.3%", "at eSign is reasonable. People who get there are committed. The leak is much earlier."],
            ].map(([n, p], i) => (
              <div key={n} data-fade data-delay={i * 0.08} className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-t border-line py-4">
                <b className="text-2xl font-semibold tabular-nums tracking-[-0.04em]">{n}</b>
                <p className="text-sm text-muted">{p}</p>
              </div>
            ))}
          </div>
        </div>

        <H3>The clicks that went nowhere</H3>
        <p data-fade className="mt-4 max-w-2xl text-muted">
          Session recordings told the same story. Dead clicks and rage clicks were 50% higher in Version 2.0. Hover a screen to see it clearly.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {HEAT.map((h, i) => (
            <figure key={h.src} data-fade data-delay={i * 0.08}>
              <IPhone aspect="360/800">
                <HeatScreen src={h.src} alt={h.alt} spots={h.spots} trail={h.trail} aspect="360/800" />
              </IPhone>
              <figcaption className="mt-4 text-sm leading-snug text-muted">{h.note}</figcaption>
            </figure>
          ))}
        </div>
        <div data-fade className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-2"><i className="size-3 rounded-full bg-[radial-gradient(circle,#d9fbff,#39c6ff_40%,#3a6bff)]" /> Dead clicks</span>
          <span className="flex items-center gap-2"><i className="size-3 rounded-full bg-[radial-gradient(circle,#fff6c2,#ffb02e_40%,#ff4d2e)]" /> Rage clicks</span>
        </div>

        <H3>Eight other apps, timed end to end</H3>
        <p data-fade className="mt-4 max-w-2xl text-muted">
          Upstox was the slowest. The fastest fetched PAN and most of the profile from the phone number, so people only confirmed.
        </p>
        <BenchClocks />
      </Chapter>

      {/* ---------- 03 our approach (inverted) ---------- */}
      <section className="bg-ink px-4 py-28 text-bg sm:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <Label light>03 — Approach</Label>
          <div className="md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[4.6vw]">Our approach</h2>
            <p data-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-bg/70 md:text-xl">
              Fewer screens hadn’t meant less effort. So we ran two tracks: design fixes we could ship straight away, and a vendor unlock that changed what the product could do.
            </p>
            <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-10">
              <div data-fade>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Design fixes</h3>
                <p className="mt-1 text-sm text-bg/55">Immediate changes with no external dependency</p>
                <ul className="mt-6">
                  {[
                    "OTP read and submitted automatically",
                    "Multi-screen bank, personal and nominee forms merged into one",
                    "Redundant priming screens removed",
                    "Stepper screens replaced with a slim progress bar on top",
                    "Nominee consent inline, not a full screen",
                    "All declarations on a single page",
                    "Segment activation and email verification moved after eSign, to reduce decision fatigue",
                  ].map((t) => (
                    <li key={t} className="border-t border-bg/15 py-3 text-bg/85">{t}</li>
                  ))}
                </ul>
              </div>
              <div data-fade data-delay="0.1">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Vendor unlock</h3>
                <p className="mt-1 text-sm text-bg/55">With Ignosis, Equifax and Decentro, fetching from the mobile number</p>
                <ul className="mt-6">
                  {[
                    "The phone number alone can fetch PAN, bank and most personal details",
                    "People move from typing everything to reviewing it, which saves time",
                    "Fetched: PAN, name, father’s name, gender, address, bank and personal details",
                  ].map((t) => (
                    <li key={t} className="border-t border-bg/15 py-3 text-bg/85">{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-20 grid gap-4 md:grid-cols-2">
              {([
                ["PAN auto-fetch", "Equifax", "−16%", "drop-offs. PAN details fetched from the mobile number.", 35, 10],
                ["Bank auto-fetch", "Decentro", "−50%", "drop-offs. Bank details fetched from the mobile number.", 60, 4],
              ] as const).map(([top, by, big, note, withF, without], i) => (
                <div key={top} data-fade data-delay={i * 0.08} className="flex flex-col rounded-2xl border border-bg/15 p-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <b className="text-xl font-semibold tracking-[-0.02em]">{top}</b>
                    <span className="label !text-bg/60">with {by}</span>
                  </div>
                  <b data-count className="mt-10 block text-7xl font-semibold tabular-nums tracking-[-0.05em]">{big}</b>
                  <p className="mt-2 text-sm text-bg/65">{note}</p>
                  <div className="mt-8 flex flex-col gap-3 border-t border-bg/15 pt-5 font-mono text-[11px] text-bg/60">
                    <span>Conversion</span>
                    {([["Fetched", withF, "var(--bg)"], ["Manual", without, "rgba(127,127,127,0.6)"]] as const).map(([k, v, c]) => (
                      <div key={k} className="grid grid-cols-[4rem_1fr_2.5rem] items-center gap-3">
                        <span>{k}</span>
                        <span className="h-2 overflow-hidden rounded-full bg-bg/10">
                          <span data-grow className="block h-full rounded-full" style={{ width: `${v}%`, background: c }} />
                        </span>
                        <span className="text-right tabular-nums">{v}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 03b visual concept ---------- */}
      <Chapter n="03B" label="Visual concept" title="Borrowed from Upstox’s premium products. Built on top.">
        <Lede>
          Leadership asked for a guided setup that felt light, not like a form. We took two concepts forward. The first won.
        </Lede>

        <div className="mt-14 overflow-hidden rounded-3xl bg-[#f1eef8] p-6 text-[#141217] md:p-10">
          <Chip tone="ink">Concept 01 · chosen</Chip>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 data-split="lines" className="max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-[2.8vw]">Glass, light and considered.</h3>
              <p data-fade className="mt-5 max-w-lg text-[#141217]/70">
                This visual language was already in our newer premium products. We took the cues and grew the system to carry the entire opening flow.
              </p>
              <div data-fade className="mt-6 flex flex-wrap gap-2">
                {["Glass forms", "Soft gradients", "Translucent depth"].map((t) => (
                  <span key={t} className="rounded-lg bg-[#5a2a9c]/10 px-3 py-1.5 text-sm font-medium text-[#5a2a9c]">{t}</span>
                ))}
              </div>
              <ul className="mt-10">
                {[
                  ["Positioning, not paperwork", "A clear value proposition before any KYC."],
                  ["Trust building", "A SEBI registration badge you see straight away."],
                  ["Social proof", "“Trusted by 2 Crore+ Indians” right on the welcome."],
                ].map(([h, p], i) => (
                  <li key={h} data-fade data-delay={i * 0.06} className="border-t border-[#141217]/10 py-3">
                    <b className="font-semibold">{h}</b>
                    <span className="block text-sm text-[#141217]/65">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <LoopVideo src={`${IMG}/glass-spin.mp4`} label="A glass form from the Version 3.0 visual language, rotating" className="mx-auto w-full max-w-[280px] rounded-2xl mix-blend-multiply" />
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 md:gap-6">
            {[["coin", "The welcome, in final form"], ["fetch", "Fetching, in glass"], ["clock", "The activation tracker"]].map(([c, a], i) => (
              <div key={c} data-parallax={i === 1 ? "-0.05" : "0.04"}>
                <Clip src={`clips/${c}`} label={a} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-card p-6 md:p-10">
          <Chip>Concept 02 · explored</Chip>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h3 data-split="lines" className="text-3xl font-semibold leading-[1.1] tracking-[-0.035em] md:text-[2.6vw]">
                Borrowed from our user’s routine. Journey that <em style={SERIF}>feels relatable.</em>
              </h3>
              <p data-fade className="mt-5 max-w-md text-muted">
                A story-led approach that feels like home: relatable, intuitive, deeply personal, and made for every kind of India.
              </p>
              <div data-fade className="mt-6 flex flex-wrap gap-2">
                {["Immersive", "Realism", "Storytelling"].map((t) => (
                  <span key={t} className="rounded-lg bg-[#8a2a78]/10 px-3 py-1.5 text-sm font-medium text-[#8a2a78]">{t}</span>
                ))}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/c2-mood.webp`} alt="Concept 02 mood board: a wooden desk with a newspaper, a glass of chai, and a trader at work" loading="lazy" className="block h-auto w-full mix-blend-multiply" />
          </div>

          <div className="mt-16 grid items-center gap-10 border-t border-line pt-14 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-14">
            <div data-fade className="mx-auto w-[62vw] max-w-[17rem] md:w-full">
              <IPhone aspect="360/809">
                <LoopVideo src={`${IMG}/c2-flow.mp4`} label="Recording of the Concept 02 prototype: entering a phone number over a desk scene, fetching details on a newspaper, then confirming a PAN card held in a hand" className="absolute inset-0 h-full w-full object-cover" />
              </IPhone>
            </div>
            <div>
              <h3 data-split="lines" className="text-3xl font-semibold leading-[1.1] tracking-[-0.035em] md:text-[2.6vw]">
                Not a process. <em style={SERIF}>A conversation.</em>
              </h3>
              <p data-fade className="mt-5 max-w-lg text-muted">
                Like stepping into a lobby so welcoming, you slow down on purpose. The kind you actually want to walk into.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {[
                  ["Minimal", "Clutter-free", "Every element serves a purpose. No unnecessary distractions."],
                  ["Immersive", "Feels personal", "A real conversation. One that walks with you, not ahead of you."],
                ].map(([tag, h, p], i) => (
                  <div key={h} data-fade data-delay={i * 0.08}>
                    <span className="rounded-lg bg-[#8a2a78]/10 px-3 py-1.5 text-sm font-medium text-[#8a2a78]">{tag}</span>
                    <b className="mt-5 block text-lg font-semibold">{h}</b>
                    <p className="mt-2 text-sm text-muted">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-fade src={`${IMG}/c2-screens.webp`} alt="Three Concept 02 screens: phone number over a desk, fetching details on an Upstox newspaper, and confirming a PAN card" loading="lazy" className="mx-auto mt-16 block h-auto w-full max-w-4xl mix-blend-multiply" />
        </div>
      </Chapter>

      {/* ---------- 04 the redesign ---------- */}
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
                    <span className="label">Version 2.0</span>
                    <p className="mt-2 min-h-[3rem] text-sm text-muted">{b.problem}</p>
                  </div>
                  {b.beforeWide ? (
                    <Zoomable src={`${IMG}/${b.beforeWide[0]}.webp`} alt={b.beforeWide[1]} width={2402} height={1364} className="mt-auto overflow-hidden rounded-xl ring-1 ring-black/10" />
                  ) : (
                    <div className="mt-auto grid grid-cols-3 gap-3">
                      {b.before.map(([src, alt]) => <Shot key={src} src={src} alt={alt} old />)}
                    </div>
                  )}
                </div>
                <div data-fade data-delay="0.12" className="relative flex flex-col gap-5 rounded-2xl p-5 ring-1 ring-ink/15">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span className="label !text-ink">Version 3.0</span>
                      <p className="mt-2 min-h-[3rem] text-sm text-muted">{b.change}</p>
                    </div>
                    {b.result ? (
                      <div className="shrink-0 text-right">
                        <b data-count className="block text-4xl font-semibold tabular-nums tracking-[-0.05em] md:text-5xl">{b.result[0]}</b>
                        <span className="mt-1 block max-w-[8rem] text-[11px] leading-tight text-muted">{b.result[1]}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-3">
                    {b.after.map(([src, alt]) => <Shot key={src} src={src} alt={alt} />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Chapter>

      {/* ---------- 04b the whole journey ---------- */}
      <section className="bg-ink px-4 py-28 text-bg sm:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <Label light>04B — The whole journey</Label>
          <div className="min-w-0 md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="max-w-3xl text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[3.5vw]">Sign-up to home, in one take.</h2>
            <p data-fade className="mt-6 max-w-xl text-bg/65">
              Recorded from the prototype, at the pace someone would really go through it. Pause, skip, or jump to any step.
            </p>
            <div className="mt-14">
              <FlowVideo src={`${IMG}/ao3-flow.mp4`} poster={`${IMG}/ao3-flow-poster.jpg`} chapters={CHAPTERS} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 04c prototype ---------- */}
      <Chapter n="04C" label="Prototype" title="Try it yourself.">
        <p data-fade className="mt-6 max-w-2xl text-lg text-muted">
          The live prototype. Tap through the phone, or use the switches to make an auto-fetch fail and see the manual fallback.
        </p>
        <div data-fade className="mt-10">
          <ProtoEmbed url={PROTO} />
        </div>
      </Chapter>

      {/* ---------- 04d small moments: columns drift at different speeds ---------- */}
      <Chapter n="04D" label="Small moments" title="The details that keep people going.">
        <Lede>Most of these answer a doubt before it turns into a reason to leave.</Lede>
        <div className="mt-16 grid grid-cols-2 gap-x-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} data-parallax={col % 2 ? "-0.08" : "0.06"} className="flex flex-col gap-10">
              {MOMENTS.filter((_, i) => i % 4 === col).map(([src, chip, h]) => (
                <figure key={src} className="group">
                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
                    <Clip src={`clips/${src}`} label={h} />
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
      <section className="bg-ink px-4 py-28 text-bg sm:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <Label light>05 — The outcome</Label>
          <div className="md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[4.6vw]">Fewer steps. Faster activation. More people finishing.</h2>
            <p data-fade className="mt-6 text-bg/65">Version 3.0, released October 2026.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-bg/15 md:grid-cols-3">
          {[
            ["~38%", "fewer onboarding steps", "A leaner flow, with less friction at every stage of sign-up."],
            ["~1–2 min", "to complete the happy path", "Down from 10–12 minutes."],
            ["~65%", "conversion", "Up 38% on Version 2.0."],
          ].map(([big, h, p], i) => (
            <div key={h} data-fade data-delay={i * 0.08} className="flex min-h-[24rem] flex-col justify-between bg-ink p-8 md:p-10">
              <div>
                <b data-count className="block whitespace-nowrap text-6xl font-semibold tabular-nums tracking-[-0.05em] md:text-[5.4vw]">{big}</b>
                <span className="mt-3 block text-lg">{h}</span>
              </div>
              <p className="text-sm text-bg/60">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 06 the next step ---------- */}
      <Chapter n="06" label="The next step" title="Getting people through KYC was only half the job.">
        <div className="mt-12 grid items-center gap-12 md:grid-cols-[1fr_17rem]">
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-muted">
            <p data-fade>
              An open account and a first investment are two different things. Finishing KYC doesn’t mean someone knows what to do next, so Version 3.0 carries on past the last KYC step.
            </p>
            <p data-fade data-delay="0.1">
              While the account activates, people build a watchlist. Once it’s ready, alerts on those stocks give them a reason to make a first trade. The same nudge setup can carry other prompts across the app.
            </p>
          </div>
          <div data-fade data-delay="0.15">
            <Clip src="ao3-watchlist" label="Picking stocks for a first watchlist, turning on alerts, then landing on the home screen" />
          </div>
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
          <span>Account Opening · 2026</span>
        </div>
      </section>
    </Choreo>
  );
}
