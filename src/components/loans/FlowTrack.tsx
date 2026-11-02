"use client";

import { useState } from "react";

// The four-phase flow chart from Figma (Process and explorations → Flow chart),
// as a track a coin runs along. Click a phase to open it.

const PHASES = [
  {
    name: "Discovery",
    time: "seconds",
    nodes: ["Spot it on Explore, in a notification or a campaign", "Eligibility runs quietly in the background", "Eligible: the offer, benefits, rates, paperwork and FAQs", "Not eligible: Loans stays out of the way"],
  },
  {
    name: "Application",
    time: "minutes",
    nodes: ["Personal details and income check", "Amount and EMI plan", "Selfie and Aadhaar KYC", "Bank verification and auto-EMI mandate", "Review every charge, accept, submit"],
  },
  {
    name: "Tracking",
    time: "usually < 2 hrs",
    nodes: ["Disbursal pending, with an ETA", "Loan active: amount, rate, next EMI", "Repayment schedule and loan agreement", "If it fails, why and what next"],
  },
  {
    name: "Closure",
    time: "whenever",
    nodes: ["Pay EMIs, or prepay early", "Close the loan", "Download the closure statement", "Apply again if still eligible"],
  },
];

export function FlowTrack() {
  const [p, setP] = useState(0);
  return (
    <div className="rounded-[2.4rem] bg-white p-6 md:p-10">
      <div className="relative grid grid-cols-4 gap-2">
        <span className="absolute left-[12.5%] right-[12.5%] top-5 h-[3px] rounded-full bg-[#F3F3F1]" />
        <span
          className="absolute left-[12.5%] top-5 h-[3px] rounded-full bg-[#5A298B] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${p * 25}%` }}
        />
        {/* the coin */}
        <span
          aria-hidden
          className="absolute top-[3px] grid size-9 -translate-x-1/2 place-items-center rounded-full bg-[#F5B83D] text-sm font-bold text-[#7a4a00] shadow-[0_6px_16px_-4px_rgba(245,184,61,0.8),inset_0_-3px_0_rgba(0,0,0,0.15)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: `${12.5 + p * 25}%` }}
        >
          ₹
        </span>
        {PHASES.map((ph, i) => (
          <button key={ph.name} type="button" onClick={() => setP(i)} className="relative flex flex-col items-center gap-3 pt-14 text-center">
            <b className={`text-sm font-semibold tracking-[-0.01em] transition-colors md:text-lg ${i === p ? "text-ink" : "text-muted"}`}>{ph.name}</b>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted md:text-[11px]">{ph.time}</span>
          </button>
        ))}
      </div>
      <ol key={p} className="mt-10 grid gap-2 md:grid-cols-2">
        {PHASES[p].nodes.map((n, i) => (
          <li
            key={n}
            className="flex items-start gap-4 rounded-2xl bg-[#F3F3F1] p-4 [animation:ft-in_.6s_cubic-bezier(.16,1,.3,1)_both]"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] text-bg">{i + 1}</span>
            <span className="pt-0.5 text-[15px]">{n}</span>
          </li>
        ))}
      </ol>
      <style>{`@keyframes ft-in{from{opacity:0;transform:translateY(12px)}}`}</style>
    </div>
  );
}
