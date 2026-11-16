"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { lockScroll } from "./Shell";

// "Ask" is a command palette that answers questions about the work. The answers
// are Sal's own notes, matched to the question on the device; nothing is sent
// anywhere. Swap `answer()` for a model call to make it open-ended.

type Note = { id: string; q: string; keys: string[]; a: string; links: [string, string][] };

// Draft copy: review before launch. Every figure comes from the case studies.
const NOTES: Note[] = [
  {
    id: "ao",
    q: "How did account opening go from 12 minutes to 2?",
    keys: ["account", "opening", "onboard", "kyc", "demat", "12", "minute", "pan", "fetch", "sign up", "signup", "conversion", "drop"],
    a: "Version 2.0 took 10–12 minutes, and 59% of people left at PAN verification. In Version 3.0 the mobile number fetches PAN, bank and personal details, so people confirm what we found and stop typing. The happy path now takes about 2–3 minutes with ~38% fewer steps, and conversion is at ~65%.",
    links: [["Account Opening case study", "/fable/work/account-opening"]],
  },
  {
    id: "watchlist",
    q: "What changed in the Watchlist?",
    keys: ["watchlist", "watch", "trader", "trading", "orders", "5.2", "lists", "chart", "stock"],
    a: "A three-release redesign of the Upstox Watchlist, shaped by trader research and product data. Orders from Watchlist rows went up 420.8%, which is 5.2× more. New lists created rose 2,038.2% and Watchlist tab opens rose 138%.",
    links: [["Watchlist case study", "/work/watchlist-revised"]],
  },
  {
    id: "nps",
    q: "What was the NPS project?",
    keys: ["nps", "pension", "retire", "tax", "0 to 1", "zero", "government", "captcha", "new product", "launch"],
    a: "A 0 → 1 product. Opening an NPS account meant a government portal, eight-step wizards and a captcha. We turned that into a few guided taps inside Upstox. Month one brought 124 accounts and ₹19.7 L in AUM, with no marketing spend.",
    links: [["NPS case study", "/work/nps"]],
  },
  {
    id: "ai",
    q: "How do you work with AI?",
    keys: ["ai", "claude", "llm", "code", "prototype", "tool", "agent", "automation", "built", "site", "vibe", "gpt", "model"],
    a: "I prototype in code as well as in Figma. The Account Opening and NPS prototypes on this site are coded with Claude, so every path can be tapped through, including the ones where a fetch fails. I also built small tools for the work: one renders Figma files into screens, another records a prototype and cuts it into clips. This site was made the same way.",
    links: [["Working with AI", "/fable#ai"], ["Try the prototype", "/fable/work/account-opening#prototype"]],
  },
  {
    id: "about",
    q: "Who is Sal?",
    keys: ["who", "about", "background", "architect", "experience", "years", "sal", "salaath", "career", "story", "lead", "team", "mentor", "upstox"],
    a: "I trained as an architect before I moved to screens. Now I lead design for investing at Upstox, making first trades, risk and diversification feel calm. Eight years in design, previously at Tata CLiQ. I also mentor on ADPList.",
    links: [["About", "/fable#about"]],
  },
  {
    id: "before",
    q: "What did you do before Upstox?",
    keys: ["before", "tata", "cliq", "ecommerce", "e-commerce", "luxury", "beauty", "seller", "previous", "marketplace", "earlier"],
    a: "Four products from my years at Tata CLiQ: a beauty homepage that re-themes for every sale, a shoppable luxury magazine, filters and a seller portal. Homepage orders rose 11.5% on Palette, conversion rose 6.5% on Luxe Editorial, and seller onboarding time fell 60%.",
    links: [["Before Upstox", "/work/previous-work"]],
  },
  {
    id: "contact",
    q: "Are you open to new roles?",
    keys: ["hire", "hiring", "role", "job", "open", "contact", "email", "reach", "talk", "available", "resume", "résumé", "cv", "linkedin"],
    a: "Yes. I’m open to lead and senior IC roles. The quickest way to reach me is the contact section at the bottom of the home page.",
    links: [["Get in touch", "/fable#contact"]],
  },
];
const FALLBACK: Note = {
  id: "none",
  q: "",
  keys: [],
  a: "I don’t have a note on that yet. I can tell you about Account Opening, the Watchlist, NPS, my work before Upstox, or how I work with AI.",
  links: [],
};

function answer(q: string): Note {
  const text = ` ${q.toLowerCase()} `;
  let best = FALLBACK, top = 0;
  for (const n of NOTES) {
    const score = n.keys.reduce((s, k) => s + (text.includes(k.length <= 3 ? ` ${k}` : k) ? (k.length > 5 ? 2 : 1) : 0), 0);
    if (score > top) [best, top] = [n, score];
  }
  return best;
}

/** Open the palette from anywhere, optionally with a question already asked. */
export const ask = (q?: string) => window.dispatchEvent(new CustomEvent("fable:ask", { detail: q }));

export function Ask() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [asked, setAsked] = useState("");
  const [note, setNote] = useState<Note | null>(null);
  const [shown, setShown] = useState(0);
  const [thinking, setThinking] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = useCallback((q: string) => {
    const question = q.trim();
    if (!question) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setAsked(question);
    setValue("");
    setNote(null);
    setShown(0);
    setThinking(true);
    const n = answer(question);
    const words = n.a.split(" ").length;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(
      setTimeout(() => {
        setThinking(false);
        setNote(n);
        if (still) return setShown(words);
        for (let i = 1; i <= words; i++) timers.current.push(setTimeout(() => setShown(i), i * 34));
      }, 620),
    );
  }, []);

  useEffect(() => {
    const onAsk = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) run(q);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("fable:ask", onAsk);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("fable:ask", onAsk);
      window.removeEventListener("keydown", onKey);
    };
  }, [run]);

  useEffect(() => {
    lockScroll(open);
    if (open) setTimeout(() => input.current?.focus(), 60);
  }, [open]);

  const words = note ? note.a.split(" ") : [];
  const finished = note !== null && shown >= words.length;
  const others = NOTES.filter((n) => n.id !== note?.id).slice(0, note ? 3 : 5);

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12svh] transition-[opacity,visibility] duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Ask about the work"
      style={{ cursor: "auto" }}
    >
      <button type="button" aria-label="Close" tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" style={{ cursor: "auto" }} />
      <div
        data-lenis-prevent
        className={`f-glass relative flex max-h-[76svh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl text-[#f2f1ed] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-y-0 scale-100" : "translate-y-4 scale-[0.98]"}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
          }}
          className="flex items-center gap-3 border-b border-white/10 px-5 py-4"
        >
          <Spark />
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about my work…"
            className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-white/35"
            style={{ cursor: "text" }}
          />
          <kbd className="hidden rounded-md border border-white/15 px-2 py-1 font-mono text-[10px] text-white/50 sm:block">ESC</kbd>
        </form>

        <div className="overflow-y-auto px-5 py-5">
          {asked ? (
            <div>
              <p className="label !text-white/45">You asked</p>
              <p className="mt-1 text-white/80">{asked}</p>
              <div className="mt-5 min-h-[7rem]">
                {thinking ? (
                  <p className="flex items-center gap-2 font-mono text-xs text-white/50">
                    <span className="f-live !bg-[#a78bfa]" style={{ animationName: "none" }} />
                    <span className="f-caret">Reading the case studies</span>
                  </p>
                ) : (
                  <>
                    <p className={`text-xl leading-snug tracking-[-0.01em] ${finished ? "" : "f-caret"}`}>{words.slice(0, shown).join(" ")}</p>
                    {finished && note?.links.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {note.links.map(([label, href], i) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className="f-rise group flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
                            style={{ animationDelay: `${i * 80}ms`, cursor: "pointer" }}
                          >
                            {label}
                            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-white/60">Ask anything about the projects, the numbers, or how I work. Or pick one:</p>
          )}

          {!thinking && (finished || !asked) ? (
            <ul className="mt-5 border-t border-white/10 pt-3">
              {others.map((n, i) => (
                <li key={n.id} className="f-rise" style={{ animationDelay: `${i * 50}ms` }}>
                  <button type="button" onClick={() => run(n.q)} className="group flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white" style={{ cursor: "pointer" }}>
                    <span>{n.q}</span>
                    <span className="font-mono text-xs text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/70">→</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <p className="border-t border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
          Answers are my own notes, matched on your device. Nothing is sent anywhere.
        </p>
      </div>
    </div>
  );
}

export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`size-5 shrink-0 text-[#a78bfa] ${className}`} fill="currentColor">
      <path d="M12 2C12.6 7.4 16.6 11.4 22 12C16.6 12.6 12.6 16.6 12 22C11.4 16.6 7.4 12.6 2 12C7.4 11.4 11.4 7.4 12 2Z" />
    </svg>
  );
}
