"use client";

import { useState } from "react";
import { LOANS_IMG } from "./LoansPhone";

// Every round the product went through, from the first scope to the app that
// shipped. Each verdict lands as a stamp.

type Round = { tag: string; title: string; tried: string; verdict: "Rescoped" | "Rejected" | "Declined" | "Cut" | "Blocked" | "Shipped"; why: string; img?: string };

const ROUNDS: Round[] = [
  { tag: "Scope", title: "Two loan products at once", tried: "Personal loans with Fibe and loans against mutual funds, side by side.", verdict: "Rescoped", why: "The partnership moved to Yubi, a marketplace of banks and NBFCs. We narrowed to pre-approved personal loans and LAMF became its own launch later." },
  { tag: "KYC", title: "One-step C-KYC", tried: "Fetch Central KYC records so people skip DigiLocker and the selfie entirely.", verdict: "Rejected", why: "Most lenders on Yubi wouldn’t accept C-KYC. Selfie and Aadhaar via DigiLocker stayed." },
  { tag: "Mandate", title: "UPI autopay for EMIs", tried: "A UPI mandate instead of net banking or debit card: one tap in a UPI app.", verdict: "Rejected", why: "UPI mandates were capped at ₹15,000, below most EMIs. It stayed one option among four." },
  { tag: "Product", title: "A line of credit", tried: "Approve once, withdraw whenever, like a credit line inside the app.", verdict: "Declined", why: "The business went with fixed-term loans for launch." },
  { tag: "Tech", title: "A snapping slider, live schedules", tried: "A custom slider with snap points and a repayment schedule for every EMI plan.", verdict: "Cut", why: "The snap points couldn’t be built in time and per-plan schedules needed a heavy API call that made screens glitch. Plan cards, with the schedule on demand, replaced both." },
  { tag: "IA", title: "Loans inside Upstox", tried: "Same components, same IA: Loans under More, with My loans and Explore as tabs. Built and developed.", verdict: "Blocked", why: "Compliance didn’t approve. Lending couldn’t be clubbed with Upstox’s broking products, so it had to be its own app.", img: "v-explore" },
  { tag: "Launch", title: "Upstox Loans, its own app", tried: "A separate app for existing Upstox users: its own icon and splash, log in with your Upstox account, a bottom nav.", verdict: "Shipped", why: "Live on Android and iOS. The components and flows we’d built for scale carried straight over.", img: "app-explore" },
];

const COLORS: Record<Round["verdict"], string> = {
  Rescoped: "#E79D0D",
  Rejected: "#F0443A",
  Declined: "#F0443A",
  Cut: "#DB542A",
  Blocked: "#F0443A",
  Shipped: "#14A363",
};

export function Rounds() {
  const [i, setI] = useState(0);
  const r = ROUNDS[i];

  return (
    <div>
      {/* the rail */}
      <div className="relative flex items-center justify-between gap-1">
        <span className="absolute inset-x-4 top-1/2 h-px -translate-y-1/2 bg-white/15" />
        <span
          className="absolute left-4 top-1/2 h-px -translate-y-1/2 bg-[#F5B83D] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `calc((100% - 2rem) * ${i / (ROUNDS.length - 1)})` }}
        />
        {ROUNDS.map((x, k) => (
          <button
            key={x.title}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Round ${k + 1}: ${x.title}`}
            className={`relative grid size-9 place-items-center rounded-full font-mono text-xs transition-all duration-500 md:size-11 ${k === i ? "scale-110 bg-[#F5B83D] text-[#170833]" : k < i ? "bg-white text-[#170833]" : "bg-[#2a1a45] text-white/60 hover:text-white"}`}
          >
            {String(k + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <div key={i} className="mt-10 grid items-center gap-8 [animation:rd-in_.7s_cubic-bezier(.16,1,.3,1)_both] md:grid-cols-[1.3fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-white/[0.06] p-7 ring-1 ring-white/10 md:p-10">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/45">Round {String(i + 1).padStart(2, "0")} · {r.tag}</span>
          <h3 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">{r.title}</h3>
          <p className="mt-6 max-w-lg text-white/70"><span className="text-white/45">We tried </span>{r.tried.charAt(0).toLowerCase() + r.tried.slice(1)}</p>
          <p className="mt-4 max-w-lg text-white/70">{r.why}</p>
          {/* the stamp */}
          <span
            className="pointer-events-none absolute right-6 top-6 rounded-lg border-[3px] px-3 py-1 font-mono text-sm font-bold uppercase tracking-[0.18em] [animation:rd-stamp_.55s_.25s_cubic-bezier(.2,1.6,.4,1)_both] md:right-10 md:top-10 md:text-base"
            style={{ color: COLORS[r.verdict], borderColor: COLORS[r.verdict] }}
          >
            {r.verdict}
          </span>
          <div className="mt-10 flex gap-3">
            <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="rounded-full px-4 py-2 text-sm ring-1 ring-white/20 disabled:opacity-30">←</button>
            <button type="button" disabled={i === ROUNDS.length - 1} onClick={() => setI(i + 1)} className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#170833] disabled:opacity-30">
              {i === ROUNDS.length - 2 ? "See what shipped →" : "Next round →"}
            </button>
          </div>
        </div>
        <div className="relative mx-auto w-[220px] md:w-[250px]">
          {r.img ? (
            <div className="rounded-[2.2rem] bg-[#111] p-[6px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${LOANS_IMG}/${r.img}.webp`} alt={r.title} className={`block aspect-[9/20] w-full rounded-[1.9rem] bg-white object-cover object-top ${r.verdict === "Blocked" ? "grayscale-[60%]" : ""}`} />
            </div>
          ) : (
            <div className="grid aspect-[9/20] place-items-center rounded-[2.2rem] border border-dashed border-white/20 p-8 text-center">
              <div>
                <span className="block text-6xl font-semibold tracking-[-0.06em]" style={{ color: COLORS[r.verdict] }}>
                  {r.verdict === "Rescoped" ? "↻" : r.verdict === "Cut" ? "✂" : "✕"}
                </span>
                <span className="mt-4 block text-sm text-white/55">Never made it to a screen</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes rd-in{from{opacity:0;transform:translateY(18px)}}@keyframes rd-stamp{from{opacity:0;transform:scale(2.4) rotate(-14deg)}to{opacity:1;transform:scale(1) rotate(-8deg)}}`}</style>
    </div>
  );
}
