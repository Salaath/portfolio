"use client";

// Research findings as five identical tiles in one row: the number from the
// evidence, what it measures, the finding, and what we did about it. Same size,
// same order, one way of showing data. Below lg the row scrolls sideways.

const PURPLE = "#5B2EBD";

export type Finding = { stat: string; statLabel: string; evidence: string; finding: string; so: string };

export function FindingTiles({ items }: { items: Finding[] }) {
  return (
    <ol className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
      {items.map((f, i) => (
        <li key={f.finding} data-fade data-delay={String(i * 0.05)}
          className="flex w-[17rem] shrink-0 snap-start flex-col rounded-[1.5rem] bg-white p-6 shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] lg:w-auto">
          <span className="font-mono text-[11px] tracking-[0.12em] text-muted">0{i + 1}</span>
          <b className="mt-8 block text-[2.6rem] font-semibold leading-none tracking-[-0.05em]" style={{ color: PURPLE }}>{f.stat}</b>
          <span className="mt-3 block min-h-[3.75rem] text-[13px] leading-snug text-muted">{f.statLabel}</span>
          <span aria-hidden className="my-5 block h-px bg-line" />
          <h4 className="text-[17px] font-semibold leading-snug tracking-[-0.02em]">{f.finding}</h4>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{f.evidence}</p>
          <p className="mt-auto pt-6 text-[13.5px] font-medium leading-snug" style={{ color: PURPLE }}>→ {f.so}</p>
        </li>
      ))}
    </ol>
  );
}
