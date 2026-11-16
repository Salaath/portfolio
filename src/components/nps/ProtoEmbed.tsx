"use client";

import { useEffect, useRef, useState } from "react";

// The prototype's own scenario switches (data-scn), in the order its panel lists them.
const SWITCHES = [
  ["holdings", "Has NPS investments", "Off: Portfolio shows the zero-holdings state.", false],
  ["nominee", "Nominee already added", "Off: the buy flow asks for nominee details.", true],
  ["married", "Married", "On: asks for spouse details before review.", false],
] as const;

const GROUPS = [
  ["pay", "Payment outcome", [["success", "Success"], ["processing", "Processing"], ["failed", "Failed"]]],
  ["load", "Page load", [["ok", "Loaded"], ["loading", "Loading"], ["fail", "Load failed"]]],
] as const;

const STEPS = [
  ["home", "Home"], ["stories", "Stories"], ["calc", "Contribution"], ["plans", "Plans"], ["explore", "Explore"],
  ["allFunds", "All funds"], ["fund", "Fund details"], ["buyAmount", "Amount"], ["byPersonal", "Details"],
  ["byNominee", "Nominee"], ["byReview", "Review"], ["byPayTimer", "Payment"], ["byStatus", "Order status"], ["pfInvest", "Portfolio"],
] as const;

/**
 * The live NPS prototype: only the phone, fitted to the window, with its scenarios
 * beside it. It's served from this site, so the page drives the prototype's own
 * panel, which stays hidden here and is still there in the full-screen view.
 */
export function NpsProtoEmbed({ url }: { url: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);
  const [show, setShow] = useState(false);
  const [scn, setScn] = useState<Record<string, boolean>>(() => Object.fromEntries(SWITCHES.map(([k, , , on]) => [k, on])));
  const [sel, setSel] = useState<Record<string, string>>({ pay: "success", load: "ok" });
  // The iframe stays wide and tall enough for the prototype's desktop layout at full
  // size (no mobile layout, no self-scaling); only the phone is shown.
  const W = 386, H = 826, FW = 840, FH = 900;
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(0.9, (window.innerHeight - 120) / H, (window.innerWidth - 80) / W));
    fit();
    window.addEventListener("resize", fit);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "600px" });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);
  const doc = () => frame.current?.contentDocument ?? null;
  const press = (selector: string) => doc()?.querySelector<HTMLElement>(selector)?.click();
  const onLoad = () => {
    const d = doc();
    if (!d) return;
    const st = d.createElement("style");
    st.textContent =
      "html,body{background:transparent!important}.panel{display:none!important}.stage{padding:0!important;gap:0!important}.device{transform:none!important;box-shadow:0 0 0 1.5px #3a3a3e inset,0 0 0 3px #1b1b1e!important}";
    d.head.appendChild(st);
  };

  return (
    <div className="grid gap-10 rounded-[2rem] bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:p-12">
      <div className="min-w-0">
        <p className="label">Set the scenario</p>
        <ul className="mt-4">
          {SWITCHES.map(([id, h, p]) => {
            const on = scn[id];
            return (
              <li key={id} className="border-t border-ink/10">
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => {
                    setScn((s) => ({ ...s, [id]: !s[id] }));
                    press(`[data-scn="${id}"]`);
                  }}
                  className="group flex w-full items-center justify-between gap-6 py-3.5 text-left"
                >
                  <span>
                    <b className={`block font-semibold transition-colors ${on ? "text-ink" : "text-ink/70"}`}>{h}</b>
                    <span className="text-sm text-muted">{p}</span>
                  </span>
                  <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-ink" : "bg-ink/15 group-hover:bg-ink/25"}`}>
                    <span className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-300 ${on ? "translate-x-4" : ""}`} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {GROUPS.map(([attr, label, opts]) => (
            <div key={attr}>
              <p className="label">{label}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {opts.map(([v, l]) => {
                  const on = sel[attr] === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setSel((s) => ({ ...s, [attr]: v }));
                        press(`[data-${attr}="${v}"]`);
                      }}
                      className={`flex items-center gap-2 transition-colors ${on ? "text-ink" : "text-muted hover:text-ink"}`}
                    >
                      <span className={`size-2 rounded-full border transition-colors ${on ? "border-ink bg-ink" : "border-ink/30"}`} />
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="label mt-8">Jump to a screen</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {STEPS.map(([id, l]) => (
            <button key={id} type="button" onClick={() => press(`[data-j="${id}"]`)} className="text-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
              {l}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <button type="button" onClick={() => press("#restart")} className="rounded-full border border-ink/25 px-4 py-2 transition-colors hover:bg-ink hover:text-bg">
            ↺ Start again
          </button>
          <a href={url} target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">
            Open full screen ↗
          </a>
        </div>
      </div>

      <div ref={box} className="mx-auto">
        <div className="relative mx-auto overflow-hidden rounded-[40px]" style={{ width: W * scale, height: H * scale }}>
          {show ? (
            <iframe
              ref={frame}
              src={url}
              onLoad={onLoad}
              title="Upstox NPS interactive prototype"
              style={{
                width: FW,
                height: FH,
                transform: `scale(${scale}) translate(${-(FW - W) / 2}px, ${-(FH - H) / 2}px)`,
                transformOrigin: "0 0",
                border: 0,
                background: "transparent",
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
