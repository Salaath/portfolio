"use client";

import { useState } from "react";

export type Finding = { title: string; who: string; text: string; changed: string; visual: React.ReactNode };

/**
 * Five findings as one explorer: a row of numbered tabs across the top and
 * the open finding below with its evidence on the right.
 */
export function Findings({ items }: { items: Finding[] }) {
  const [i, setI] = useState(0);
  const f = items[i];
  return (
    <div>
      <div role="tablist" className="grid grid-cols-2 border-t border-ink sm:grid-cols-3 lg:grid-cols-5">
        {items.map((x, k) => (
          <button
            key={x.title}
            role="tab"
            aria-selected={i === k}
            onClick={() => setI(k)}
            className={`group relative border-b border-line p-4 text-left transition-colors lg:border-b-0 lg:border-r lg:last:border-r-0 ${i === k ? "bg-ink text-bg" : "hover:bg-[#F6F5F2]"}`}
          >
            <span className={`font-mono text-xs ${i === k ? "text-bg/50" : "text-muted"}`}>F{k + 1}</span>
            <span className="mt-6 block text-[15px] font-semibold leading-snug tracking-[-0.01em]">{x.title}</span>
            <span className={`mt-1 block text-xs ${i === k ? "text-bg/55" : "text-muted"}`}>{x.who}</span>
          </button>
        ))}
      </div>
      <div key={i} className="grid gap-10 border-b border-ink py-10 [animation:wlIn_.45s_ease_both] lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="flex flex-col justify-between gap-8">
          <p className="text-xl leading-snug tracking-[-0.01em]">{f.text}</p>
          <p className="border-l-2 border-[#5B2EBD] pl-4 text-[15px]">
            <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-[#5B2EBD]">What it changed</span>
            <span className="mt-1 block">{f.changed}</span>
          </p>
        </div>
        <div className="min-w-0">{f.visual}</div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="text-muted transition-colors hover:text-ink disabled:opacity-30">← Previous</button>
        <span className="font-mono text-xs text-muted">{i + 1} / {items.length}</span>
        <button type="button" disabled={i === items.length - 1} onClick={() => setI(i + 1)} className="font-medium transition-colors hover:text-[#5B2EBD] disabled:opacity-30">Next finding →</button>
      </div>
      <style>{`@keyframes wlIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
