"use client";

// Makes the "View tax & charges" row of the review still tappable. The open
// state is a second capture of the same screen, revealed over the first, so
// the row expands and collapses the way it does in the prototype.
// Positions are fractions of the 720×1600 capture: the row sits at 844–956px
// and the three charges at 956–1172px.
import { useState } from "react";

export function FeesToggle() {
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);
  const layer = "pointer-events-none absolute inset-0 block h-full w-full";
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/work/nps/byReviewOpen.jpg"
        alt=""
        aria-hidden
        className={`${layer} transition-[clip-path] duration-300 ease-out`}
        style={{ clipPath: open ? "inset(59.75% 0 26.75% 0)" : "inset(59.75% 0 40.25% 0)" }}
      />
      {/* the chevron, which flips */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/work/nps/byReviewOpen.jpg"
        alt=""
        aria-hidden
        className={`${layer} transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        style={{ clipPath: "inset(52.75% 0 40.25% 80%)" }}
      />
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Hide tax and charges" : "View tax and charges: GST ₹77.40, platform fees ₹400, transaction processing fees ₹30"}
        onClick={() => {
          setOpen((o) => !o);
          setUsed(true);
        }}
        className="absolute inset-x-0 top-[52.75%] h-[7%] cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#7B5CB8]"
      >
        {!used && (
          <span aria-hidden className="absolute right-[4.2%] top-1/2 grid size-[11cqw] -translate-y-1/2 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#7B5CB8]/30 motion-reduce:animate-none" />
          </span>
        )}
      </button>
    </>
  );
}
