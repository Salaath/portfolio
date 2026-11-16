"use client";

import { useState } from "react";
import { WlPhone } from "./WlPhone";

export type Opt = {
  label: string;
  verdict?: string;
  picked?: boolean;
  shots: { src: string; caption: string }[];
  notes: string[];
};

/** Design options from one round, side by side. Tabs switch option; phones show its screens. */
export function OptionSwitch({ title, options, footer }: { title: string; options: Opt[]; footer?: React.ReactNode }) {
  const [i, setI] = useState(0);
  const o = options[i];
  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{title}</p>
        <div role="tablist" className="flex flex-wrap gap-1 rounded-[10px] bg-[#F4F2F7] p-1 text-sm">
          {options.map((x, k) => (
            <button
              key={x.label}
              role="tab"
              aria-selected={i === k}
              onClick={() => setI(k)}
              className={`px-3.5 py-1.5 font-medium transition-all ${i === k ? "rounded-[7px] bg-white text-ink shadow-[0_0_0_1px_rgba(42,27,61,0.08)]" : "rounded-[7px] text-muted hover:text-ink"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
      </div>
      <div key={i} className="grid gap-8 p-5 [animation:osIn_.45s_ease_both] md:p-8 lg:grid-cols-[1fr_17rem]">
        <div className="-mx-3 -mb-10 flex gap-4 overflow-x-auto px-3 pb-12 md:gap-6">
          {o.shots.map((s) => (
            <figure key={s.src} className="w-[min(11.5rem,42vw)] shrink-0 md:w-[12.5rem]">
              <WlPhone src={s.src} alt={s.caption} />
              <figcaption className="mt-3 text-[13px] leading-snug text-muted">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div>
          {o.verdict && (
            <span className={`inline-block rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] ${o.picked ? "bg-[#E7F6EE] text-[#0E7A48]" : "bg-[#F3F3F1] text-muted"}`}>{o.verdict}</span>
          )}
          <ul className="mt-4 grid gap-3">
            {o.notes.map((n) => (
              <li key={n} className="border-l-2 border-[#5B2EBD]/40 pl-3 text-[15px] leading-snug">{n}</li>
            ))}
          </ul>
        </div>
      </div>
      {footer && <div className="border-t border-line bg-[#FAF9F7] px-5 py-4 text-sm text-muted md:px-8">{footer}</div>}
      <style>{`@keyframes osIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
