"use client";

// One book for the reading note in Outside work. It stands on its spine and
// turns all the way round, without stopping. As it turns it opens until the
// pages fan out in a full circle, holds there, then closes again.
// Built from plain elements with CSS 3D transforms: two stiff covers and a
// block of pages, each page made of three strips so it can bend.
import { useEffect, useRef } from "react";
import { serif } from "./serif";

const PAGES = 12; // sheets between the covers
const N = PAGES + 2;
const STRIPS = 3;
const W = 40; // page width, as a share of the box width
const H = 58; // page height
const LOOP = 12; // seconds for one open-and-close; the book turns twice in that time

const PAPER = "#f1efe9";
const INK = "#131313";

// ── The printed pages ───────────────────────────────────────────────────────
// A made-up magazine about reading, set like an editorial lookbook: a tall
// serif in capitals, small columns of text, black-and-white pictures and page
// numbers. All of it is placeholder copy. Sizes are in container units.
const PHOTOS = ["berlin-4", "paris-1", "prague-6", "vienna-2", "salzburg-4", "madrid-2", "zurich-3", "colombo-4"].map((n) => `/about/cities/${n}.jpg`);
const HEADS = [
  "Always a novel on the go",
  "The last page is never the end",
  "Newsprint mornings",
  "Read slowly, then again",
  "Notes in the margin",
  "One more chapter",
  "A quiet hour with a loud book",
  "Fiction first",
];
const BODY = [
  "The afternoon went the way good afternoons go, one page at a time. Nobody was keeping count. The light moved across the table, the tea went cold and the chapter refused to end where it should have.",
  "A paper folds into quarters and fits under an arm. A paperback bends to the shape of a coat pocket. Neither asks for a charger or a signal. They wait, open at the right place, until there is a minute to spare.",
  "Some stories are read once and kept for years. Others are read every year and still surprise. The shelf keeps both without comment, spines out, in no order that anyone else could follow.",
];

function Head({ children, size, italic = false }: { children: React.ReactNode; size: number; italic?: boolean }) {
  return (
    <span
      className={serif.className}
      style={{ display: "block", width: "128%", fontSize: `${size}cqw`, lineHeight: italic ? 0.95 : 0.84, letterSpacing: "-0.02em", textTransform: italic ? "none" : "uppercase", fontStyle: italic ? "italic" : "normal", transform: "scaleX(0.78)", transformOrigin: "left top" }}
    >
      {children}
    </span>
  );
}
const tiny: React.CSSProperties = { fontSize: "0.92cqw", lineHeight: 1.28, letterSpacing: "-0.005em" };
const caps: React.CSSProperties = { fontSize: "0.72cqw", lineHeight: 1.2, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 };

function Photo({ n, style }: { n: number; style?: React.CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={PHOTOS[n % PHOTOS.length]} alt="" draggable={false} style={{ display: "block", objectFit: "cover", filter: "grayscale(1) contrast(1.08)", ...style }} />;
}

/** One printed side of a sheet. `n` is its page number, starting at 1. */
function PageArt({ n }: { n: number }) {
  const head = HEADS[n % HEADS.length], body = BODY[n % BODY.length], body2 = BODY[(n + 1) % BODY.length];
  const kind = n % 6;
  const dark = kind === 3;
  const fill = kind === 1;
  const fg = dark || fill ? PAPER : INK;
  const pad = "2.6cqw";
  const running = (
    <span style={{ ...caps, display: "flex", justifyContent: "space-between" }}>
      <span>Printed Matter</span>
      <span>Vol. 01</span>
    </span>
  );
  const folio = <span className={serif.className} style={{ position: "absolute", bottom: "1.8cqw", [n % 2 ? "right" : "left"]: pad, fontSize: "1.9cqw", lineHeight: 1 }}>{n}</span>;
  return (
    <div style={{ position: "absolute", inset: 0, padding: pad, background: dark ? "#141414" : PAPER, color: fg, overflow: "hidden", textAlign: "left" }}>
      {fill && (
        <>
          <Photo n={n} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          <span style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }} />
        </>
      )}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
        {running}
        {kind === 0 && (
          <>
            <Photo n={n} style={{ width: "34%", aspectRatio: "4 / 3", margin: "3.2cqw auto 1.8cqw" }} />
            <span style={{ display: "block", textAlign: "center", marginLeft: "11%" }}><Head size={7.4}>{head}</Head></span>
            <span style={{ ...caps, display: "block", textAlign: "center", marginTop: "1.4cqw" }}>It is everywhere and nowhere, this habit of reading</span>
            <span style={{ ...tiny, columnCount: 2, columnGap: "1.6cqw", marginTop: "auto", marginBottom: "3.4cqw", textAlign: "justify" }}>{body} {body2}</span>
          </>
        )}
        {kind === 1 && <span style={{ marginTop: "auto", marginBottom: "3.6cqw" }}><Head size={6.4}>{head}</Head></span>}
        {kind === 2 && (
          <>
            <span style={{ marginTop: "3cqw" }}><Head size={5.2}>&ldquo;{BODY[2].split(".")[0]}.&rdquo;</Head></span>
            <span style={{ display: "flex", gap: "1.6cqw", alignItems: "flex-end", marginTop: "auto", marginBottom: "3.4cqw" }}>
              <Photo n={n} style={{ width: "40%", aspectRatio: "3 / 4" }} />
              <span style={{ ...tiny, flex: 1 }}>{body}</span>
            </span>
          </>
        )}
        {kind === 3 && (
          <>
            <span className={serif.className} style={{ fontSize: "2.2cqw", fontStyle: "italic", marginTop: "2.4cqw" }}>Chapter {Math.ceil(n / 6)}</span>
            <span style={{ marginTop: "auto", marginBottom: "3.6cqw" }}><Head size={8.6}>{head}</Head></span>
          </>
        )}
        {kind === 4 && (
          <>
            <span style={{ ...tiny, columnCount: 2, columnGap: "1.6cqw", marginTop: "2.6cqw", textAlign: "justify" }}>{body} {body2}</span>
            <Photo n={n} style={{ width: "100%", flex: 1, minHeight: 0, marginTop: "2cqw" }} />
            <span style={{ ...caps, marginTop: "0.8cqw", marginBottom: "3.2cqw", opacity: 0.7 }}>Somewhere to sit with a book</span>
          </>
        )}
        {kind === 5 && (
          <>
            <span style={{ marginTop: "2.6cqw" }}><Head size={5} italic>In this volume</Head></span>
            <span style={{ display: "block", marginTop: "2.4cqw" }}>
              {HEADS.slice(0, 6).map((h, k) => (
                <span key={h} className={serif.className} style={{ display: "flex", justifyContent: "space-between", gap: "1cqw", borderTop: `0.12cqw solid ${INK}`, padding: "0.9cqw 0", fontSize: "1.9cqw", lineHeight: 1.05 }}>
                  <span>{h}</span>
                  <span>{String(k * 4 + 3).padStart(2, "0")}</span>
                </span>
              ))}
            </span>
          </>
        )}
      </div>
      {folio}
    </div>
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** How open the book is, 0 to 1, at a point in the loop: shut, opening, held open, closing. */
const openAt = (p: number) => {
  if (p < 0.06) return 0;
  if (p < 0.42) return ease((p - 0.06) / 0.36);
  if (p < 0.6) return 1;
  if (p < 0.94) return 1 - ease((p - 0.6) / 0.34);
  return 0;
};

/** One of the three strips a page is made of. Each side shows its own third of the printed page. */
function Strip({ front, back, k }: { front: React.ReactNode; back: React.ReactNode; k: number }) {
  const side = (art: React.ReactNode, slot: number, flip: boolean) => (
    <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]" style={flip ? { transform: "rotateY(180deg)" } : undefined}>
      <div className="absolute top-0 h-full" style={{ width: `${STRIPS * 100}%`, left: `${-slot * 100}%` }}>{art}</div>
      <span className="absolute inset-0 bg-black" style={{ opacity: "var(--sh)" }} />
    </div>
  );
  return (
    <div
      className="absolute top-0 origin-left [transform-style:preserve-3d]"
      style={{ left: k ? "100%" : 0, width: `${W / STRIPS}cqw`, height: `${H}cqw`, transform: "rotateY(var(--c))" }}
    >
      {side(front, k, false)}
      {side(back, STRIPS - 1 - k, true)}
      {k < STRIPS - 1 && <Strip front={front} back={back} k={k + 1} />}
    </div>
  );
}

export function SpinBook({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const sheets = [...root.querySelectorAll<HTMLElement>("[data-sheet]")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = false, clock = still ? LOOP * 0.3 : 0, last = 0;

    const draw = () => {
      const p = (clock % LOOP) / LOOP;
      const open = openAt(p);
      const spread = 7 + ((360 * (N - 1)) / N - 7) * open;
      const spin = p * 720 - 25;
      // pages bend most while the book is on its way open or shut
      const bend = 3 + 9 * Math.sin(Math.PI * open) + 4 * open;
      sheets.forEach((el, i) => {
        const a = spin + (i / (N - 1) - 0.5) * spread;
        el.style.transform = `rotateY(${a.toFixed(2)}deg)`;
        el.style.setProperty("--c", `${bend.toFixed(2)}deg`);
        el.style.setProperty("--sh", (0.02 + 0.5 * (1 - Math.abs(Math.cos((a * Math.PI) / 180)))).toFixed(3));
      });
    };
    const frame = (now: number) => {
      clock += Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      draw();
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    draw();
    if (still) return;
    const wake = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    }, { rootMargin: "100px" });
    io.observe(root);
    document.addEventListener("visibilitychange", wake);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  const cover: React.CSSProperties = { width: `${W + 1}cqw`, height: `${H + 1.4}cqw`, top: "-0.7cqw" };
  const shade = <span className="absolute inset-0 bg-black" style={{ opacity: "var(--sh)" }} />;
  return (
    <div ref={ref} aria-hidden className={`relative aspect-square select-none [container-type:inline-size] ${className}`}>
      <div className="absolute inset-0" style={{ perspective: "230cqw" }}>
        <div className="absolute left-1/2 size-0 [transform-style:preserve-3d]" style={{ top: `${(100 - H) / 2}cqw`, transform: "rotateX(-13deg)" }}>
          {Array.from({ length: N }, (_, i) => {
            const front = i === 0, back = i === N - 1;
            return (
              <div key={i} data-sheet className="absolute left-0 top-0 size-0 [transform-style:preserve-3d]" style={{ "--c": "4deg", "--sh": 0.1 } as React.CSSProperties}>
                {front || back ? (
                  <>
                    {/* the printed outside of the cover */}
                    <div
                      className="absolute left-0 flex flex-col justify-between overflow-hidden [backface-visibility:hidden]"
                      style={{ ...cover, padding: "3cqw", background: front ? PAPER : "#181818", color: front ? INK : PAPER, borderRadius: front ? "0 0.8cqw 0.8cqw 0" : "0.8cqw 0 0 0.8cqw", boxShadow: front ? undefined : "inset 0 0 0 0.15cqw rgba(255,255,255,0.14)", transform: front ? undefined : "rotateY(180deg)" }}
                    >
                      {front ? (
                        <>
                          <span className="flex items-center justify-between" style={caps}>
                            <span>Printed Matter</span>
                            <span>Vol. 01</span>
                          </span>
                          <span>
                            <Head size={9.4}>Always a novel on the go</Head>
                            <span className="block" style={{ height: "0.2cqw", background: INK, margin: "2.2cqw 0 1.2cqw" }} />
                            <span className="flex items-center justify-between" style={caps}>
                              <span>Fiction</span>
                              <span>The reading issue</span>
                            </span>
                          </span>
                        </>
                      ) : (
                        <>
                          <span />
                          <span style={{ ...caps, opacity: 0.7 }}>Printed Matter · Vol. 01</span>
                        </>
                      )}
                      {shade}
                    </div>
                    {/* its plain inside */}
                    <div className="absolute left-0 [backface-visibility:hidden]" style={{ ...cover, background: "#e6e3dc", transform: front ? "rotateY(180deg)" : undefined }}>
                      {shade}
                    </div>
                  </>
                ) : (
                  <Strip front={<PageArt n={i * 2 - 1} />} back={<PageArt n={i * 2} />} k={0} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
