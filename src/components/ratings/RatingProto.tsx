"use client";

import { useEffect, useRef, useState } from "react";

// The coded prototype, live in the page (public/proto/in-app-rating). "#demo-<trigger>"
// plays the five-star flow on a loop; "#embed-<trigger>" is the same phone for you to tap,
// and the chips switch it between the other triggers without reloading it. Both tiles are
// built the same way, so the two phones match in size and position.

const PROTO = "/proto/in-app-rating/index.html";

const OPTIONS = [
  { id: "squareoff", label: "Square off" },
  { id: "funds", label: "Funds added" },
  { id: "ipo", label: "IPO allotted" },
] as const;

export function RatingProto({ ground, mode }: { ground: string; mode: "demo" | "live" }) {
  const [trigger, setTrigger] = useState<(typeof OPTIONS)[number]["id"]>("squareoff");
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  // the prototype switches and restarts in place, so the phone never reloads
  const tell = (msg: object) => frame.current?.contentWindow?.postMessage(msg, window.location.origin);

  // load the prototype once it is on screen, so its sheet slides up while you are looking
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} data-native-cursor={mode === "live" ? "" : undefined} className="relative grid place-items-center overflow-hidden rounded-[1.75rem] py-8 md:rounded-[2.25rem] md:py-12" style={{ background: ground }}>
      {/* says plainly which phone you can touch */}
      <p className="mb-6 flex min-h-[2.25rem] items-center gap-2.5 px-4 text-center">
        {mode === "live" ? (
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Tap the screen to interact</span>
        ) : (
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Plays on a loop</span>
        )}
      </p>
      <div className="aspect-[376/816] h-[min(68svh,640px)] max-w-full">
        {seen ? (
          <iframe
            ref={frame}
            src={mode === "demo" ? `${PROTO}#demo-order` : `${PROTO}#embed-squareoff`}
            title={mode === "demo" ? "The rating sheet after an order is placed, playing on a loop" : "In-app rating interactive prototype"}
            tabIndex={mode === "demo" ? -1 : undefined}
            className={`block h-full w-full border-0 bg-transparent ${mode === "demo" ? "pointer-events-none" : ""}`}
          />
        ) : null}
      </div>
      <div className="mt-6 flex min-h-[2.625rem] flex-wrap items-center justify-center gap-2 px-4">
        {mode === "demo" ? (
          <span aria-hidden />
        ) : (
          <>
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={o.id === trigger}
                onClick={() => { if (o.id === trigger) return; setTrigger(o.id); tell({ type: "rating-trigger", trigger: o.id }); }}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${o.id === trigger ? "border-ink bg-ink text-bg" : "border-ink/20 hover:border-ink"}`}
              >
                {o.label}
              </button>
            ))}
            <button type="button" onClick={() => tell({ type: "rating-restart" })} className="px-3 py-2 text-sm text-muted underline-offset-4 hover:text-ink hover:underline">
              Restart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
