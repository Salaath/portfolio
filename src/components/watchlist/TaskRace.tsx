"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The old and new watchlist prototypes side by side, driven by one task list.
// Both are served from this site (public/proto/watchlist), so the page can
// press their own task buttons and read their tap counters. Each prototype's
// side panel is hidden here; it is still there when opened full screen.

type Side = "old" | "new";

// [title, old how, new how, index in old task list, index in new task list]
const TASKS: [string, string, string, number | null, number][] = [
  ["Switch to another list", "Tap the list name, then pick a list", "Tap a list chip under the tabs", 0, 0],
  ["Follow a ready-made list", "List name, Discover more lists, open one, Follow", "Add list, pick Long buildup, Follow", 1, 1],
  ["Create a new list", "List name, +, type a name, Create", "Add list, Create, type a name, Create list", 2, 2],
  ["Add a stock to your list", "+ at the top, type “rel”, + on a result", "Search & add stocks, type “rel”, + on a result", 3, 3],
  ["Check the charts", "Tap a stock, then Chart. One stock at a time", "Tap Analyze in the bottom bar", 4, 4],
  ["Buy a stock", "Swipe a row right, then swipe to buy", "Swipe a row right, then swipe to buy", 5, 5],
  ["Rename or reorder lists", "List name, Manage, edit, Save", "Long-press a chip, edit, Save", 6, 6],
  ["Buy several stocks at once", "Not possible: one order per stock", "⋮, Create basket order, tick stocks, Add to Basket", null, 7],
  ["Read the list your way", "Not possible: symbol and price only", "Analyze, Table view, pick a preset", null, 8],
];

const W = 384, H = 824, FW = 416;
const CSS =
  "html,body{background:transparent!important;overflow:hidden!important;height:auto!important}.rail,.rbtn{display:none!important}.wrap{padding:0!important;margin:0!important;display:block!important}.stage{display:block!important}.phone{box-shadow:none!important}";

function useFrame(side: Side) {
  const ref = useRef<HTMLIFrameElement>(null);
  const doc = useCallback(() => {
    try {
      return ref.current?.contentDocument ?? null;
    } catch {
      return null;
    }
  }, []);
  const onLoad = useCallback(() => {
    const d = doc();
    if (!d) return;
    d.documentElement.setAttribute("data-theme", "light");
    const st = d.createElement("style");
    st.textContent = CSS;
    d.head.appendChild(st);
  }, [doc]);
  const startTask = useCallback(
    (idx: number | null) => {
      const d = doc();
      if (!d) return;
      if (idx === null) return void d.getElementById("restartBtn")?.click();
      d.querySelectorAll<HTMLButtonElement>("#tasks .task")[idx]?.click();
    },
    [doc],
  );
  const read = useCallback(() => {
    const d = doc();
    if (!d) return { taps: 0, done: null as number | null };
    const taps = Number(d.getElementById("tapCount")?.textContent ?? 0);
    const cost = d.querySelector("#tasks .task.active.done .t-cost")?.textContent ?? "";
    const m = cost.match(/(\d+)/);
    return { taps, done: m ? Number(m[1]) : null };
  }, [doc]);
  return { ref, onLoad, startTask, read, side };
}

export function TaskRace() {
  const oldF = useFrame("old");
  const newF = useFrame("new");
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [show, setShow] = useState(false);
  const [task, setTask] = useState<number | null>(null);
  const [stats, setStats] = useState({ old: { taps: 0, done: null as number | null }, new: { taps: 0, done: null as number | null } });
  const [results, setResults] = useState<Record<number, { old?: number; new?: number }>>({});

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(0.78, (window.innerHeight - 200) / H, (el.clientWidth / 2 - 24) / W));
    fit();
    window.addEventListener("resize", fit);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "800px" });
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  // read both tap counters while a task runs
  useEffect(() => {
    if (task === null) return;
    const t = window.setInterval(() => {
      const o = oldF.read(), n = newF.read();
      setStats({ old: o, new: n });
      setResults((r) => {
        const cur = r[task] ?? {};
        const next = { ...cur };
        if (o.done !== null && TASKS[task][3] !== null) next.old = o.done;
        if (n.done !== null) next.new = n.done;
        return next.old === cur.old && next.new === cur.new ? r : { ...r, [task]: next };
      });
    }, 250);
    return () => window.clearInterval(t);
  }, [task, oldF, newF]);

  const pick = (i: number) => {
    setTask(i);
    oldF.startTask(TASKS[i][3]);
    newF.startTask(TASKS[i][4]);
  };

  const cur = task === null ? null : TASKS[task];

  return (
    <div className="rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-6 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[19rem_1fr]">
        <div>
          <p className="label">Pick a task</p>
          <ol className="mt-4 flex flex-col gap-1.5">
            {TASKS.map(([t, , , o], i) => {
              const r = results[i];
              return (
                <li key={t}>
                  <button
                    type="button"
                    aria-pressed={task === i}
                    onClick={() => pick(i)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[15px] transition-colors ${task === i ? "bg-ink text-bg" : "hover:bg-[#F3F3F1]"}`}
                  >
                    <span className="font-medium">
                      {t}
                      {o === null && <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${task === i ? "bg-white/15" : "bg-[#EFE9FA] text-[#5B2EBD]"}`}>NEW</span>}
                    </span>
                    {r && (r.old !== undefined || r.new !== undefined) && (
                      <span className={`shrink-0 font-mono text-[11px] ${task === i ? "text-bg/60" : "text-muted"}`}>
                        {r.old ?? "–"} → {r.new ?? "–"}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-5 text-xs text-muted">Results show taps old → new once you finish a task on each phone. Prices are sample values and tick live.</p>
        </div>

        <div ref={box} className="min-w-0">
          <div className="grid grid-cols-2 gap-4">
            {([
              ["old", oldF, "Before", "/proto/watchlist/old.html"],
              ["new", newF, "After", "/proto/watchlist/new.html"],
            ] as const).map(([k, f, label, url]) => {
              const s = stats[k];
              const how = cur ? (k === "old" ? cur[1] : cur[2]) : null;
              const na = cur && k === "old" && cur[3] === null;
              return (
                <div key={k} className="flex min-w-0 flex-col items-center">
                  <div className="flex w-full items-baseline justify-between gap-2" style={{ maxWidth: W * scale }}>
                    <span className={`text-sm font-semibold ${k === "new" ? "text-[#5B2EBD]" : ""}`}>{label}</span>
                    <span className="flex items-baseline gap-1.5">
                      <b className="text-3xl font-semibold tabular-nums tracking-[-0.04em]">{task === null ? 0 : s.taps}</b>
                      <span className="text-xs text-muted">taps</span>
                    </span>
                  </div>
                  <p className="mt-1 min-h-[2.5rem] w-full text-xs leading-snug text-muted" style={{ maxWidth: W * scale }}>
                    {task === null ? "Pick a task on the left." : s.done !== null && !na ? <b className="font-semibold text-[#14A363]">Done in {s.done} {s.done === 1 ? "tap" : "taps"}</b> : how}
                  </p>
                  <div className="relative mt-3 overflow-hidden rounded-[34px]" style={{ width: W * scale, height: H * scale }}>
                    {show && (
                      <iframe
                        ref={f.ref}
                        src={url}
                        onLoad={f.onLoad}
                        title={`${label}: the ${k === "old" ? "old" : "new"} Upstox watchlist, interactive prototype`}
                        style={{ width: FW, height: H, transform: `scale(${scale})`, transformOrigin: "0 0", border: 0, background: "transparent" }}
                      />
                    )}
                    {na && (
                      <div className="absolute inset-0 grid place-items-center bg-[#121110]/70 p-6 text-center text-sm font-medium text-white backdrop-blur-sm">
                        The old watchlist couldn’t do this
                      </div>
                    )}
                  </div>
                  <a href={url} target="_blank" rel="noreferrer" className="mt-3 text-xs font-medium underline-offset-4 hover:underline">
                    Open full screen ↗
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
