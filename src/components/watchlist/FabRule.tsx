"use client";

import { useState } from "react";
import { WlPhone } from "./WlPhone";

// Where "create a list" sat, before and after we applied the floating-bar rule.
const STATES = [
  {
    key: "v1",
    label: "First full version",
    src: "ex/v1-home",
    alt: "First full version: a + New chip at the end of the list chips, filter and sort in the floating bar",
    createNote: "+ New sits at the end of the chips, up with the lists themselves.",
    barNote: "The floating bar holds filter, sort and a menu: tools for reading a list, not making one.",
    verdict: "Breaks the rule",
  },
  {
    key: "shipped",
    label: "After the rule",
    src: "ex/r1-after",
    alt: "My lists with Add list in the middle of the floating bar, Sort to its left and More to its right",
    createNote: "Add list is the middle of the floating bar, the label everyone can read.",
    barNote: "Sort sits to its left and More to its right, each as its own round button.",
    verdict: "Follows the rule",
  },
];

export function FabRule() {
  const [i, setI] = useState(0);
  const s = STATES[i];
  return (
    <div className="grid items-center gap-10 rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-6 md:grid-cols-[auto_1fr] md:p-10">
      <div className="mx-auto w-[min(250px,70vw)]">
        <WlPhone key={s.key} src={s.src} alt={s.alt} />
      </div>
      <div>
        <div role="tablist" className="inline-flex rounded-[10px] bg-[#F4F2F7] p-1 text-sm">
          {STATES.map((x, k) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={i === k}
              onClick={() => setI(k)}
              className={`px-4 py-1.5 font-medium transition-all ${i === k ? "rounded-[7px] bg-white text-ink shadow-[0_0_0_1px_rgba(42,27,61,0.08)]" : "rounded-[7px] text-muted hover:text-ink"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">The rule</p>
        <p className="mt-2 max-w-md text-2xl font-semibold leading-tight tracking-[-0.03em]">
          Each tab’s main action lives in its floating bar. On My lists, the main action is making a list.
        </p>
        <ul className="mt-8 grid max-w-md gap-4 text-[15px] leading-snug">
          <li>
            <span><b className="font-semibold">Create a list.</b> {s.createNote}</span>
          </li>
          <li>
            <span><b className="font-semibold">Floating bar.</b> {s.barNote}</span>
          </li>
        </ul>
        <span className={`mt-8 inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${i ? "bg-[#E7F6EE] text-[#0E7A48]" : "bg-[#FDECEA] text-[#B4321F]"}`}>{s.verdict}</span>
      </div>
    </div>
  );
}
