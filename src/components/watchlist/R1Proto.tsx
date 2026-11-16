"use client";

import { useState } from "react";
import { WlPhone } from "./WlPhone";

// A shipped release, running end to end: a cut of the coded watchlist
// prototype (public/proto/watchlist/r1.html, r2.html, r3.html) loaded inside the same
// bezel as every other phone on the page. The shipped screenshot sits
// underneath until the prototype has loaded.

const BUILDS = {
  r1: {
    src: "/proto/watchlist/r1.html?embed",
    poster: "ex/r1-after",
    title: "Release 1 watchlist prototype",
    caption: "The Release 1 watchlist. Use it like the app: tabs, lists, Sort, Add list and ⋮ all work.",
  },
  r2: {
    src: "/proto/watchlist/r2.html?embed",
    poster: "ex/m5-home",
    title: "Release 2 watchlist prototype",
    caption: "Release 2. Tap Table view above the list, switch lists, sort a column, Manage columns, or long-press a row.",
  },
  r3: {
    src: "/proto/watchlist/r3.html?embed",
    poster: "home",
    title: "Release 3 watchlist prototype",
    caption: "Release 3. Tap Analyze in the bar, then try every control: view, chart type, interval, indicators, list, Table view, or any card.",
  },
} as const;

export function ReleaseProto({ build, width = 280 }: { build: keyof typeof BUILDS; width?: number }) {
  const [run, setRun] = useState(0);
  const b = BUILDS[build];
  return (
    <figure className="m-0 flex flex-col items-center">
      <WlPhone src={b.poster} alt={b.title} width={width}>
        <iframe key={run} src={b.src} title={b.title} loading="eager" className="absolute inset-0 h-full w-full border-0 bg-transparent" />
      </WlPhone>
      <figcaption className="mt-5 max-w-[17rem] text-center text-[13px] leading-snug text-muted">{b.caption}</figcaption>
      <button type="button" onClick={() => setRun((n) => n + 1)} className="mt-2 text-[13px] font-medium underline underline-offset-4">
        Start again
      </button>
    </figure>
  );
}

export const R1Proto = ({ width }: { width?: number }) => <ReleaseProto build="r1" width={width} />;
