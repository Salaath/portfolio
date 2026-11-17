"use client";

import { useEffect, useRef, useState } from "react";

// How the best pre-approved offer is found (from the launch deck):
// Upstox picks eligible customers, Yubi runs a soft check across its lenders,
// and the lowest rate and fee wins. Plays itself when scrolled into view.

// Illustrative: which lenders answer and with what, changes per customer.
const LENDERS = [
  ["Federal Bank", "Offer"],
  ["HDFC Bank", "No offer"],
  ["ICICI Bank", "Offer"],
  ["Kotak", "No offer"],
  ["Kinara Capital", "Offer"],
  ["EarlySalary", "Offer"],
  ["InCred", "12.53%"],
  ["Kanakadurga", "No offer"],
] as const;
const BEST = 6;

const STEPS = [
  ["01", "Upstox finds who qualifies", "Customers with more than ₹10 lakh across stocks and mutual funds."],
  ["02", "Yubi runs a soft check", "Details go to Yubi, which asks its lenders for an offer without touching the credit score."],
  ["03", "Lenders respond", "Banks and NBFCs come back with a rate and a processing fee, or no offer at all."],
  ["04", "The best one is shown", "Lowest rate and fees win. If nobody says yes, Loans simply stays hidden."],
] as const;

export function OfferEngine() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStep((s) => (s < 0 ? 0 : s)), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (step < 0 || step >= 3) return;
    const t = setTimeout(() => setStep(step + 1), step === 2 ? 1700 : 1100);
    return () => clearTimeout(t);
  }, [step, run]);

  const replay = () => {
    setStep(0);
    setRun((r) => r + 1);
  };

  return (
    <div ref={ref} className="grid gap-6 rounded-[2.4rem] bg-[#170833] p-6 text-white md:grid-cols-[1fr_1.3fr] md:p-10">
      <ol className="flex flex-col gap-2">
        {STEPS.map(([n, h, p], i) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`w-full rounded-2xl p-4 text-left transition-colors duration-500 ${i === step ? "bg-white/[0.09]" : "hover:bg-white/[0.04]"}`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors duration-500 ${i <= step ? "bg-[#F5B83D] text-[#170833]" : "bg-white/10 text-white/60"}`}
                >
                  {i < step ? "✓" : n}
                </span>
                <b className="font-semibold tracking-[-0.02em]">{h}</b>
              </span>
              <span className={`mt-2 block overflow-hidden pl-10 text-sm text-white/60 transition-all duration-700 ${i === step ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>{p}</span>
            </button>
          </li>
        ))}
        <li className="mt-2 pl-4">
          <button type="button" onClick={replay} className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50 hover:text-white">
            ↻ Run it again
          </button>
        </li>
      </ol>

      {/* the diagram */}
      <div className="relative min-h-[24rem] overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-[#2a0f5c] to-[#14062b] p-5 pb-32 md:p-8 md:pb-32">
        <div className="flex items-center justify-between">
          <Node on={step >= 0} label="Upstox" sub="AUM > ₹10 L" />
          <Wire on={step >= 1} />
          <Node on={step >= 1} label="Yubi" sub="Soft pull" pulse={step === 1} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LENDERS.map(([name, rate], i) => {
            const shown = step >= 2;
            const best = step >= 3 && i === BEST;
            return (
              <div
                key={name}
                className="rounded-xl px-3 py-2.5 text-xs transition-all duration-700"
                style={{
                  transitionDelay: shown && step === 2 ? `${i * 90}ms` : "0ms",
                  background: best ? "#F5B83D" : "rgba(255,255,255,0.07)",
                  color: best ? "#170833" : undefined,
                  opacity: shown ? (step >= 3 && !best ? 0.35 : 1) : 0.15,
                  transform: best ? "scale(1.06)" : shown ? "none" : "translateY(8px)",
                }}
              >
                <span className="block truncate font-medium">{name}</span>
                <b className="mt-0.5 block font-mono tabular-nums">{shown ? rate : "···"}</b>
              </div>
            );
          })}
        </div>
        <div
          className="absolute inset-x-5 bottom-5 flex md:inset-x-8 md:bottom-8 items-center justify-between gap-4 rounded-2xl bg-white p-4 text-[#170833] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: step >= 3 ? "none" : "translateY(140%)" }}
        >
          <div>
            <span className="text-xs text-[#6a6a6a]">You’re eligible for a loan up to</span>
            <b className="block text-3xl font-semibold tracking-[-0.04em]">₹10.92 L</b>
          </div>
          <div className="text-right text-sm">
            <span className="block font-semibold text-[#148564]">12.53% p.a.</span>
            <span className="text-[#6a6a6a]">Best rate for you</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Node({ on, label, sub, pulse }: { on: boolean; label: string; sub: string; pulse?: boolean }) {
  return (
    <div className={`relative rounded-2xl px-4 py-3 transition-all duration-700 ${on ? "bg-white text-[#170833]" : "bg-white/10 text-white/50"}`}>
      {pulse ? <span className="absolute inset-0 animate-ping rounded-2xl bg-white/30" /> : null}
      <b className="relative block font-semibold">{label}</b>
      <span className="relative text-xs opacity-70">{sub}</span>
    </div>
  );
}

function Wire({ on }: { on: boolean }) {
  return (
    <div className="relative mx-3 h-px flex-1 bg-white/15">
      <span className="absolute inset-y-0 left-0 bg-[#F5B83D] transition-all duration-1000 ease-out" style={{ width: on ? "100%" : "0%" }} />
      <span
        className="absolute -top-[5px] size-[11px] rounded-full bg-[#F5B83D] shadow-[0_0_14px_#F5B83D] transition-all duration-1000 ease-out"
        style={{ left: on ? "calc(100% - 11px)" : "0%", opacity: on ? 1 : 0 }}
      />
    </div>
  );
}
