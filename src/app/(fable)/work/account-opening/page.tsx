import type { Metadata } from "next";
import { getCase } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { FlowVideo, LoopVideo, PhonePlayer } from "@/components/ao/FlowVideo";
import { IPhone } from "@/components/ao/IPhone";
import { Zoomable } from "@/components/ao/Zoomable";
import { DropOff } from "@/components/ao/DropOff";
import { BenchClocks } from "@/components/ao/Benchmark";
import { HeatScreen, ProtoEmbed } from "@/components/ao/Bits";
import { ReadBar } from "@/components/fable/Bits";
import { NextCase } from "@/components/fable/Sections";
import { ChapterDock } from "@/components/fable/Case";
import { HeldPhone } from "@/components/ao/HeldPhone";

// Account Opening in the Fable template: same story, figures and assets as the classic page. Every Version 3.0 screen and clip here is captured
// from the final prototype (see "Case study/proto-video"); screens starting with
// "o" are Version 2.0, from the older case study assets; "v2-" are rendered from the
// Version 2.0 Figma file (see "Case study/ao2-video").

export const metadata: Metadata = { title: "Account Opening — Salaath Shaikh" };

const IMG = "/work/ao3";
// hero-held.webp sits on a flat #d4d4d4 backdrop; the phone's screen is centred at HELD_CX of its width
// The photo is lifted until that grey turns white, then multiplied over HERO_BG (see .f-held), so the backdrop can be any light colour.
const HERO_BG = "#ece7dc";
const HELD_CX = 0.314;
const RED = "#D93A2B";
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

/** One change: every screen on one surface, big enough to read, all the same height. */
function Compare({ before, after }: { before: string[][]; after: string[][] }) {
  const n = before.length + after.length;
  // As large as the window allows: the whole card (padding, labels, captions) stays within one screen
  // height and all the phones stay within one screen width.
  // Up to three phones also leave room for the text beside them.
  const phone = `min(22rem, calc((100vw - ${n <= 3 ? "42rem" : "320px"}) / ${n}), calc((100svh - 14rem) / 2.25))`;
  const group = (label: string, items: string[][]) => (
    <div className="shrink-0">
      <p className="label mb-5 text-center">{label}</p>
      <div className="flex justify-center gap-4">
        {items.map(([src, alt]) => {
          const final = src.startsWith("p/");
          return (
            <figure key={src} className={`shrink-0 ${final ? "w-[61.6vw] md:w-[calc(var(--phone)*1.0263)]" : "w-[60vw] md:w-[var(--phone)]"}`}>
              <Shot src={src} alt={alt} />
              <figcaption className="mt-3 text-center text-sm leading-snug text-muted">{alt}</figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
  return (
    <div data-fade className="flex w-full gap-8 overflow-x-auto rounded-3xl bg-card p-6 md:w-fit md:max-w-full md:shrink-0 md:justify-center md:p-10" style={{ "--phone": phone } as React.CSSProperties}>
      {group("Version 2.0", before)}
      <span aria-hidden className="w-px shrink-0 self-stretch bg-ink/10" />
      {group("Version 3.0", after)}
    </div>
  );
}

function Clip({ src, label }: { src: string; label: string }) {
  return (
    <IPhone>
      <LoopVideo src={`${IMG}/${src}.mp4`} poster={`${IMG}/${src}-poster.jpg`} label={label} className="absolute inset-0 h-full w-full object-cover" />
    </IPhone>
  );
}

/** Chapter: a large numeral and label that stay in view on the left, the story on the right. */
function Chapter({ id, n, label, title, children, className = "" }: { id: string; n: string; label: string; title: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <section id={id} data-chapter={n} data-chapter-label={label} className={`border-t border-line px-4 py-24 sm:px-10 md:py-40 ${className}`}>
      <div className="grid gap-10 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28">
            <span data-fade aria-hidden className="block text-[22vw] leading-[0.8] tracking-[-0.06em] text-ink/[0.1] md:text-[9vw]">{n}</span>
            <div className="mt-5"><Label>{label}</Label></div>
          </div>
        </div>
        <div className="min-w-0 md:col-span-9">
          <h2 data-split="lines" className="max-w-4xl text-4xl font-semibold leading-[1] tracking-[-0.04em] md:text-[3.9vw]">{title}</h2>
          {children}
        </div>
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
  { at: 5.4, label: "Mobile and OTP", note: "The OTP is read from messages and fills itself in." },
  { at: 14.7, label: "Email", note: "One tap with Google instead of typing an address." },
  { at: 19.6, label: "Confirm PAN, bank, personal", note: "Details are fetched while you watch, then confirmed card by card." },
  { at: 42.5, label: "Signature", note: "Draw it, or tap to sign. A small win when it's saved." },
  { at: 54, label: "Selfie", note: "A quick tip, the camera, done." },
  { at: 64.4, label: "Three quick questions", note: "Trading experience, segments and nominee, on a single screen." },
  { at: 73.9, label: "Aadhaar eSign", note: "Inside the app, with the OTP filled in for you." },
  { at: 89.1, label: "F&O activation", note: "Offered after submitting, not in the way of it." },
  { at: 92.8, label: "Link a bank for income proof", note: "Two OTPs filled in for you, one account to pick and the statement is shared." },
  { at: 107.4, label: "Activation tracker", note: "Where the application stands and when you can trade." },
  { at: 115.5, label: "First watchlist", note: "Something useful to do while the account activates." },
  { at: 132.2, label: "Home", note: "Into the app, with a tracker showing when you can trade." },
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
    change: "Fetched details arrive pre-filled on one card and confirmed sections stack up above it.",
    before: [["v2-per1", "Primer: enter personal details"], ["v2-per2", "Trading experience"], ["v2-per3", "Annual income"], ["v2-per4", "Settlement duration"], ["v2-per5", "Occupation"], ["v2-per6", "Marital status"]],
    after: [["p/personal", "Personal details pre-filled on one card"]],
  },
  {
    title: "Take the nominee form out of the journey",
    problem: "Most people skip it, but saying yes opened up to 22 screens before the account.",
    change: "The long form is gone from the flow. Nominee is now one yes-or-no question on the same screen as two others and can be added later from the accounts section.",
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
] as { title: string; problem: string; change: string; result?: [string, string]; before: string[][]; after: string[][] }[];

const MOMENTS = [
  ["coin", "Trust", "SEBI-registered social proofing app rating trust marker before we ask for anything"],
  ["otp", "Effort", "The OTP arrives and fills itself in"],
  ["fetch", "Trust", "You can see what's being fetched"],
  ["cards", "Clarity", "Your details stack up as you confirm them"],
  ["confirm", "Momentum", "A small win when your details are confirmed"],
  ["selfie", "Momentum", "Small wins celebrated after every step"],
  ["clock", "Clarity", "A clear status and the exact date your account goes live"],
  ["alerts", "Momentum", "A first step towards investing, while the account activates"],
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
  return (
    <Choreo className="paper">
      <ReadBar />
      <ChapterDock />
      {/* ---------- hero: a statement, one phone, one number ---------- */}
      <header className="relative flex min-h-svh flex-col overflow-hidden px-4 pb-8 pt-32 text-ink sm:px-10" style={{ background: HERO_BG }}>
        <HeldPhone
          still={`${IMG}/hero-held.webp`}
          src={`${IMG}/hero-reel.mp4`}
          poster={`${IMG}/hero-reel-poster.jpg`}
          mask={`${IMG}/hero-screen-mask.png`}
          label="Key moments of the Version 3.0 journey playing on a phone held in someone's hands: welcome, OTP filling itself in, fetching details, PAN card, signature, selfie, activation tracker and all set"
          className="f-held pointer-events-none !absolute top-0 hidden h-full md:block"
          style={{ left: "74%", transform: `translateX(${-HELD_CX * 100}%)`, background: HERO_BG }}
        />
        <div className="relative z-10 flex items-start justify-between">
          <p data-label data-load className="label !text-ink/60">[ Selected work — 01 / Upstox ]</p>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center py-4 md:max-w-[52vw]">
          <h1 data-split="words" data-load data-delay="0.15" className="text-[9vw] font-semibold leading-[1] tracking-[-0.045em] md:text-[3.5vw]">
            Turning a 12-minute demat account opening process into a delightful 2-minute experience.
          </h1>
          <p data-fade data-load data-delay="0.6" className="mt-6 max-w-lg text-lg text-ink/75">
            How we reimagined Upstox’s account-opening journey, replacing tedious form filling with automated verification, fewer steps and a simpler way to start investing.
          </p>
          <div data-fade data-load data-delay="0.8" className="mt-6 flex items-end gap-6">
            <b className="shrink-0 whitespace-nowrap text-[17vw] font-semibold leading-[0.8] tracking-[-0.06em] md:text-[5vw]">10–12</b>
            <span className="max-w-[13rem] pb-1 text-sm leading-snug text-ink/70">minutes to open an account when we started, after two redesigns.</span>
          </div>
          <dl className="mt-6 grid max-w-2xl grid-cols-2 gap-x-6 md:grid-cols-3">
            {[
              ["Role", "Lead product designer"],
              ["Timeline", "April – May 2026 · 45 days"],
              ["Released", "October 2026"],
              ["Team", "Salaath Shaikh — Lead Product Designer\nSathvik — Product Designer\nSydney — Product Manager\nEngineering — Cross-functional team"],
            ].map(([k, v], i) => (
              <div key={k} className={`relative py-4 ${k === "Team" ? "col-span-full" : ""}`}>
                <span data-grow data-load data-delay={(0.9 + i * 0.08).toFixed(2)} className="absolute inset-x-0 top-0 h-px bg-ink/20" />
                <dt data-fade data-load data-delay={(1 + i * 0.08).toFixed(2)} className="label !text-ink/55">{k}</dt>
                <dd data-fade data-load data-delay={(1.05 + i * 0.08).toFixed(2)} className={`mt-1 whitespace-pre-line text-sm font-medium ${k === "Team" ? "md:columns-2" : ""}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* phones: zoomed in on the phone, so it reads at this size */}
        <div className="-mx-4 -mb-8 mt-4 w-[calc(100%+2rem)] overflow-hidden sm:-mx-10 sm:w-[calc(100%+5rem)] md:hidden">
        <HeldPhone
          still={`${IMG}/hero-held.webp`}
          src={`${IMG}/hero-reel.mp4`}
          poster={`${IMG}/hero-reel-poster.jpg`}
          mask={`${IMG}/hero-screen-mask.png`}
          label="Key moments of the Version 3.0 journey playing on a phone held in someone's hands"
          className="f-held w-[160%] max-w-none"
          style={{ background: HERO_BG }}
        />
        </div>
      </header>

      {/* ---------- 01 the problem ---------- */}
      <Chapter id="problem" n="01" label="The problem" title="We had redesigned account opening twice. People were still dropping off." className="!border-t-0">
        <Lede>
          Before anyone can buy a share, they finish KYC: PAN, bank, personal details, signature, selfie and an Aadhaar eSign. Each earlier version fixed the thing it thought was wrong.
        </Lede>
        <div className="mt-16 flex flex-col gap-16">
          {([
            ["Version 1.0", "Too much on every screen", "Dense forms, several questions at once, long declarations. 24 steps and every one looked like work.", "ao1_flow", "Version 1.0: 24 screens from email entry to application submitted", 2295, 938],
            ["Version 2.0 · Sept 2025", "Less on each screen, more screens", "We went after cognitive load: one question per screen, a primer before each section, lots of visual help. Every screen got easier. The journey got longer.", "ao2_flow", "Version 2.0: 26 screens from the happy path, in order", 4590, 1820],
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
            <PhonePlayer src={`${IMG}/ao2-flow.mp4`} poster={`${IMG}/ao2-flow-poster.jpg`} aspect="741/1631" label="Tapping through the Version 2.0 Figma prototype, from the phone's home screen to the app" />
          </div>
          <div>
            <Chip>Version 2.0, tap by tap</Chip>
            <p data-fade className="mt-6 text-3xl font-medium leading-[1.1] tracking-[-0.03em] md:text-[2.6vw]">Watch it to feel how long it goes on.</p>
            <p data-fade data-delay="0.1" className="mt-5 max-w-md text-muted">
              Every tap on the happy path, recorded in the Figma prototype. Filling it in for real took 10–12 minutes.
            </p>
          </div>
        </div>

        <H3>After Version 2.0 launched in September 2025</H3>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="31%" label="dead clicks at launch (10.4% after fixes)" bad />
          <Stat value="18 min" label="to onboard at launch (12 min after fixes)" bad delay={0.06} />
          <Stat value="17.7%" label="conversion in Oct 2025, against ~30% for Version 1.0" bad delay={0.12} />
          <Stat value="~28%" label="by Feb 2026, roughly back where Version 1.0 had been" delay={0.18} />
        </div>
      </Chapter>

      {/* the takeaway, read word by word */}
      <section className="border-t border-line px-4 py-32 sm:px-10 md:py-56">
        <p data-label className="label mb-10 text-center !text-sm">[ Where that left us ]</p>
        <p data-scrub-words className="mx-auto max-w-5xl text-center text-4xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[4.4vw]">
          Every screen was easier to get through. The whole journey still felt long.
        </p>
      </section>

      {/* ---------- 02 the investigation ---------- */}
      <Chapter id="investigation" n="02" label="The investigation" title="The biggest drop wasn’t at the end. It was at PAN verification.">
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Stat value="~28%" label="of people complete the full Version 2.0 flow" />
          <Stat value="10–12" label="minutes on average to complete" delay={0.06} />
          <Stat value="11" label="steps" delay={0.12} />
          <Stat value="55" label="screens" delay={0.18} />
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
      <section id="approach" data-chapter="03" data-chapter-label="Approach" className="mx-2 rounded-[2rem] bg-ink px-4 py-28 text-bg sm:px-8 md:mx-4 md:rounded-[3rem] md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <Label light>03 — Approach</Label>
          <div className="md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[4.6vw]">Our approach</h2>
            <p data-fade className="mt-8 max-w-2xl text-lg leading-relaxed text-bg/70 md:text-xl">
              Fewer screens hadn’t meant less effort. So we ran two tracks: design fixes we could ship straight away and a vendor unlock that changed what the product could do.
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
      <Chapter id="concept" n="03B" label="Visual concept" title="Borrowed from Upstox’s premium products. Built on top.">
        <Lede>
          Leadership asked for a guided setup that felt light, not like a form. We took two concepts forward. The first won.
        </Lede>

        <div className="mt-14 overflow-hidden rounded-3xl bg-white p-6 text-[#141217] md:p-10">
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
                Borrowed from our user’s routine. Journey that feels relatable.
              </h3>
              <p data-fade className="mt-5 max-w-md text-muted">
                A story-led approach that feels like home: relatable, intuitive, deeply personal and made for every kind of India.
              </p>
              <div data-fade className="mt-6 flex flex-wrap gap-2">
                {["Immersive", "Realism", "Storytelling"].map((t) => (
                  <span key={t} className="rounded-lg bg-ink/[0.07] px-3 py-1.5 text-sm font-medium text-ink">{t}</span>
                ))}
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/c2-mood.webp`} alt="Concept 02 mood board: a wooden desk with a newspaper, a glass of chai and a trader at work" loading="lazy" className="block h-auto w-full mix-blend-multiply" />
          </div>

          <div className="mt-16 grid items-center gap-10 border-t border-line pt-14 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-14">
            <div data-fade className="mx-auto w-[62vw] max-w-[17rem] md:w-full">
              <IPhone aspect="360/809">
                <LoopVideo src={`${IMG}/c2-flow.mp4`} label="Recording of the Concept 02 prototype: entering a phone number over a desk scene, fetching details on a newspaper, then confirming a PAN card held in a hand" className="absolute inset-0 h-full w-full object-cover" />
              </IPhone>
            </div>
            <div>
              <h3 data-split="lines" className="text-3xl font-semibold leading-[1.1] tracking-[-0.035em] md:text-[2.6vw]">
                Not a process. A conversation.
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
                    <span className="rounded-lg bg-ink/[0.07] px-3 py-1.5 text-sm font-medium text-ink">{tag}</span>
                    <b className="mt-5 block text-lg font-semibold">{h}</b>
                    <p className="mt-2 text-sm text-muted">{p}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-fade src={`${IMG}/c2-screens.webp`} alt="Three Concept 02 screens: phone number over a desk, fetching details on an Upstox newspaper and confirming a PAN card" loading="lazy" className="mx-auto mt-16 block h-auto w-full max-w-4xl mix-blend-multiply" />
        </div>
      </Chapter>

      {/* ---------- 04 the redesign ---------- */}
      <Chapter id="redesign" n="04" label="The redesign" title="Six changes, each aimed at a specific kind of effort." className="!pb-0" />
      <section className="px-4 pb-24 sm:px-10 md:pb-36">
        {CHANGES.map((b, i) => (
          // The card hugs its phones. When there's room beside it the text sits there; when the phones need
          // the full width the text moves above and spreads into columns (it's a container, so it adapts itself).
          <div key={b.title} className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 border-t border-line py-16 first:border-t-0 md:gap-x-16 md:py-24">
            <div className="@container min-w-0 flex-1 basis-[18rem]">
              <div className="grid gap-8 @3xl:grid-cols-12 @3xl:gap-6">
                <div className="flex items-baseline justify-between gap-6 @3xl:col-span-3 @3xl:flex-col @3xl:justify-start">
                  <span data-fade className="font-mono text-sm uppercase tracking-[0.12em] text-muted">Change {String(i + 1).padStart(2, "0")} / {String(CHANGES.length).padStart(2, "0")}</span>
                  {b.result ? (
                    <p data-fade data-delay="0.1" className="text-right @3xl:mt-10 @3xl:text-left">
                      <b data-count className="block text-5xl font-semibold tabular-nums tracking-[-0.05em] @3xl:text-[5.3cqi] @3xl:leading-[0.9]">{b.result[0]}</b>
                      <span className="mt-2 block text-sm text-muted">{b.result[1]}</span>
                    </p>
                  ) : null}
                </div>
                <div className="@3xl:col-span-9">
                  <h3 data-split="lines" className="text-3xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-[2.5vw] @3xl:md:text-[3.4cqi] @3xl:leading-[1]">{b.title}</h3>
                  <div className="mt-8 grid gap-x-10 gap-y-7 @3xl:mt-10 @3xl:grid-cols-2">
                    {([["Version 2.0", b.problem, false], ["Version 3.0", b.change, true]] as const).map(([v, text, now], k) => (
                      <div key={v} className="relative pt-5">
                        <span data-grow data-delay={k * 0.12} className={`absolute inset-x-0 top-0 h-px ${now ? "bg-ink" : "bg-ink/25"}`} />
                        <span data-fade data-delay={k * 0.12} className={`label flex items-center gap-2 ${now ? "!text-ink" : ""}`}>
                          {now ? <i className="size-1.5 rounded-full bg-[#5b2ebd]" /> : null}
                          {v}
                        </span>
                        <p data-fade data-delay={k * 0.12 + 0.05} className={`mt-3 max-w-md text-lg leading-snug ${now ? "text-ink" : "text-muted"}`}>{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Compare before={b.before} after={b.after} />
          </div>
        ))}
      </section>

      {/* ---------- 04b the whole journey ---------- */}
      <section id="journey" data-chapter="04B" data-chapter-label="The whole journey" className="mx-2 rounded-[2rem] bg-ink px-4 py-28 text-bg sm:px-8 md:mx-4 md:rounded-[3rem] md:py-40">
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
      <Chapter id="prototype" n="04C" label="Prototype" title="Try it yourself.">
        <p data-fade className="mt-6 max-w-2xl text-lg text-muted">
          The live prototype. Tap through the phone, or pick a path to see what happens when an auto-fetch fails.
        </p>
        <div data-fade className="mt-10">
          <ProtoEmbed url={PROTO} />
        </div>
      </Chapter>

      {/* ---------- 04d small moments: columns drift at different speeds ---------- */}
      <Chapter id="moments" n="04D" label="Small moments" title="Delight is built in.">
        <Lede>Delight is woven into every interaction from the very beginning. Every step is designed to reduce anxiety, build confidence and create moments of joy.</Lede>
        <H3>Micro-moments that compound into the feel</H3>
        <div className="mt-12 grid grid-cols-2 gap-x-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((col) => (
            <div key={col} data-parallax={col % 2 ? "-0.08" : "0.06"} className="flex flex-col gap-10">
              {MOMENTS.filter((_, i) => i % 4 === col).map(([src, chip, h]) => (
                <figure key={src} className="group">
                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
                    <Clip src={`clips/${src}`} label={h} />
                  </div>
                  <figcaption className="mt-4 flex flex-col gap-2">
                    <Chip>{chip}</Chip>
                    <span className="text-lg font-normal leading-tight tracking-[-0.01em]">{h}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
        <p data-fade className="mt-24 max-w-3xl text-3xl font-medium leading-[1.1] tracking-[-0.03em] md:text-[2.6vw]">
          An onboarding experience that users actually look forward to completing.
        </p>
      </Chapter>

      {/* ---------- 05 the outcome ---------- */}
      <section id="outcome" data-chapter="05" data-chapter-label="The outcome" className="mx-2 rounded-[2rem] bg-ink px-4 py-28 text-bg sm:px-8 md:mx-4 md:rounded-[3rem] md:py-40">
        <div className="grid gap-10 md:grid-cols-6 md:gap-0">
          <Label light>05 — The outcome</Label>
          <div className="md:col-span-4 md:pl-3">
            <h2 data-split="lines" className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-[4.6vw]">Fewer steps. Faster activation. More people finishing.</h2>
            <p data-fade className="mt-6 text-bg/65">Version 3.0, released October 2026.</p>
          </div>
        </div>
        <div data-fade className="mt-16 rounded-3xl border border-bg/15 p-6 md:p-10">
          <p className="label !text-bg/60">Time to open an account, on a 12-minute scale</p>
          {([["Version 2.0", "10–12 min", 83.3, 100, "rgba(244,243,239,0.4)"], ["Version 3.0", "2–3 min", 16.7, 25, "#a78bfa"]] as const).map(([name, t, lo, hi, c]) => (
            <div key={name} className="mt-6 grid grid-cols-[6.5rem_1fr] items-center gap-4 md:grid-cols-[9rem_1fr_8rem]">
              <span className="text-bg/80">{name}<b className="block font-normal text-bg/50 md:hidden">{t}</b></span>
              <span className="relative block h-10 overflow-hidden rounded-full bg-bg/[0.07] md:h-12">
                <span data-grow className="absolute inset-y-0 left-0 rounded-full opacity-40" style={{ width: `${hi}%`, background: c }} />
                <span data-grow data-delay="0.2" className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${lo}%`, background: c }} />
              </span>
              <b className="hidden text-right text-2xl tabular-nums tracking-[-0.03em] md:block">{t}</b>
            </div>
          ))}
          <p className="mt-6 text-sm text-bg/50">The solid bar is the fastest time, the lighter bar is the slowest.</p>
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-3xl bg-bg/15 md:grid-cols-3">
          {[
            ["~38%", "fewer onboarding steps", "A leaner flow, with less friction at every stage of sign-up."],
            ["~2–3 min", "to complete the happy path", "Down from 10–12 minutes."],
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
      <Chapter id="next" n="06" label="The next step" title="Getting people through KYC was only half the job.">
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
      <Chapter id="reflection" n="07" label="Reflection" title="I stopped counting screens and started looking at effort.">
        <div className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">
          <p data-fade>
            A flow can have fewer screens and still be tiring. Sometimes a confirmation does more than a better form and sometimes the best thing to do with a screen is remove the reason it exists.
          </p>
          <p data-fade className="mt-6">
            Not every fix here was a design fix. Auto-fetch did more for speed than any layout change and getting it in meant working with PMs and vendors, not just in Figma.
          </p>
          <p data-fade className="mt-6">
            For an investing app, an open account isn’t the goal. It’s where investing starts.
          </p>
        </div>
      </Chapter>

      <NextCase c={getCase("watchlist-revised")!} href="/work/watchlist-revised" foot="Account Opening · 2026" />
    </Choreo>
  );
}
