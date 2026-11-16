"use client";

import { scrollToId } from "../Smoother";

export type Release = {
  n: string;
  title: string;
  status: "Shipped" | "In build";
  img: string;
  steps: [string, string][];
  to: string;
};

const TONE: Record<Release["status"], string> = {
  Shipped: "bg-[#E7F6EE] text-[#0E7A48]",
  "In build": "bg-[#E8F1FD] text-[#1F5FB4]",
};

/** Each release as a card: what we tried, why it changed, what went out.
 *  The image zooms into the part of the screen that release turned on. */
export function RoundRail({ releases }: { releases: Release[] }) {
  return (
    <ol className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
      {releases.map((r) => (
        <li key={r.n} className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-auto sm:max-w-none">
          <button type="button" onClick={() => scrollToId(r.to)} className="group block w-full text-left">
            <span className="block overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-500 group-hover:-translate-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/work/watchlist/ex/${r.img}.jpg`} alt={r.title} width={720} height={600} loading="eager" decoding="async" className="block aspect-[6/5] w-full object-cover" />
            </span>
            <span className="mt-5 flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-ink font-mono text-[10px] text-white">{r.n}</span>
              <span className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] ${TONE[r.status]}`}>{r.status}</span>
            </span>
            <b className="mt-2.5 block text-lg font-semibold leading-snug tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4">{r.title}</b>
            <span className="mt-3 grid gap-2.5 border-l border-line pl-3">
              {r.steps.map(([k, v]) => (
                <span key={k} className="block">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{k}</span>
                  <span className="mt-0.5 block text-[14px] leading-snug">{v}</span>
                </span>
              ))}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
