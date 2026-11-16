"use client";

import { scrollToId } from "../Smoother";

/** A row of chapter links under the hero. */
export function ChapterIndex({ items }: { items: [string, string][] }) {
  return (
    <nav aria-label="Chapters" className="grid grid-cols-2 gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-4 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ ["--n" as string]: items.length }}>
      {items.map(([label, id], i) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollToId(id)}
          className="group flex items-baseline gap-2 bg-white px-3 py-4 text-left text-sm transition-colors hover:bg-[#5B2EBD] hover:text-white"
        >
          <span className="font-mono text-[11px] text-muted group-hover:text-white/60">{String(i + 1).padStart(2, "0")}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
