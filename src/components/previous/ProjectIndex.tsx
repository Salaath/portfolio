"use client";

import { scrollToId } from "../Smoother";

/** Four project links under the hero, each with its brand tint on hover. */
export function ProjectIndex({ items }: { items: { label: string; id: string; tint: string }[] }) {
  return (
    <nav aria-label="Projects" className="grid grid-cols-2 gap-px overflow-hidden border-y border-line bg-line md:grid-cols-4">
      {items.map(({ label, id, tint }, i) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollToId(id)}
          style={{ ["--tint" as string]: tint }}
          className="group flex items-baseline gap-2 bg-white px-4 py-4 text-left text-sm transition-colors hover:bg-[var(--tint)] hover:text-white sm:px-10"
        >
          <span className="font-mono text-[11px] text-muted group-hover:text-white/60">{String(i + 1).padStart(2, "0")}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
