"use client";

import { useState } from "react";
import { LOANS_IMG } from "./LoansPhone";

// The same product before and after compliance moved it out of Upstox.
// Flip the switch to swap the phone and the list of what changed.

const ROWS = [
  ["Way in", "More tab → Loans", "Its own app icon and splash"],
  ["Navigation", "My loans · Explore as top tabs", "Explore · My loans · Profile in a bottom nav"],
  ["Log in", "Already signed in to Upstox", "Upstox number, OTP and PIN, then consent"],
  ["Brand", "Upstox", "Upstox Loans, with a looping money background"],
] as const;

export function IaSwitch() {
  const [app, setApp] = useState(true);
  return (
    <div className="grid items-center gap-10 rounded-[2.4rem] bg-white p-6 md:grid-cols-[1fr_auto] md:p-12">
      <div>
        <div className="inline-flex rounded-full bg-[#F3F3F1] p-1 text-sm font-medium">
          {[["Inside Upstox", false], ["Upstox Loans app", true]].map(([l, v]) => (
            <button
              key={String(l)}
              type="button"
              onClick={() => setApp(v as boolean)}
              className={`rounded-full px-4 py-2 transition-colors duration-500 ${app === v ? "bg-ink text-bg" : "text-ink/60 hover:text-ink"}`}
            >
              {l as string}
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-col">
          {ROWS.map(([k, before, after]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line py-4 md:grid-cols-[8rem_1fr]">
              <span className="label">{k}</span>
              <span className="relative block min-h-[1.5rem] overflow-hidden">
                <span className={`block transition-all duration-500 ${app ? "-translate-y-full opacity-0" : "opacity-100"}`}>{before}</span>
                <span className={`absolute inset-0 block font-medium transition-all duration-500 ${app ? "opacity-100" : "translate-y-full opacity-0"}`}>{after}</span>
              </span>
            </div>
          ))}
          <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line py-4 md:grid-cols-[8rem_1fr]">
            <span className="label" style={{ color: "#14A363" }}>Kept</span>
            <span>Every component, the application flow and the lending engine behind it</span>
          </div>
        </div>
      </div>
      <div className="relative mx-auto w-[230px] md:w-[260px]">
        <div className="rounded-[2.4rem] bg-[#111] p-[7px] shadow-[0_40px_80px_-30px_rgba(40,10,80,0.45)]">
          <div className="relative aspect-[9/20] overflow-hidden rounded-[2rem] bg-white">
            {[["v-explore", !app], ["app-explore", app]].map(([src, on]) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={String(src)}
                src={`${LOANS_IMG}/${src}.webp`}
                alt={src === "app-explore" ? "Upstox Loans app: Explore with a bottom nav" : "Loans inside Upstox: Explore with My loans and Explore tabs"}
                className="absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ opacity: on ? 1 : 0, transform: on ? "none" : "scale(0.94)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
