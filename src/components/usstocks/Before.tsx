"use client";

import { useEffect, useRef, useState } from "react";
import { IPhone } from "@/components/ao/IPhone";
import { Bezel } from "./FlowStage";

// Evidence for the US Stocks one-pager: what moving between Pro and Invest
// takes in the live app, what the split journey would have asked of a trader,
// and the wallet as it shipped.

const IMG = "/work/us-stocks";

/** Moments in the live-app recording, in seconds. */
const SWITCH: [number, string, string][] = [
  [0, "Start in Pro", "The trader’s home screen."],
  [1.5, "Open the account menu", "The switch lives behind the settings icon."],
  [3.5, "Flip the mode toggle", "A full-screen page asks you to confirm."],
  [5.25, "Wait while the app reloads", "About three seconds on the splash screen."],
  [8.5, "You’re in Invest", "A different home, navigation and search."],
  [14.5, "Tap Trade to go back", "The app reloads a second time."],
  [17.75, "Back in Pro", "Where you started."],
];

/** The live app going from Pro to Invest and back, with each step called out as it happens. */
export function SwitchDemo() {
  const ref = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !still && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    let raf = 0;
    const tick = () => {
      setT(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const active = SWITCH.reduce((a, [at], i) => (t >= at ? i : a), 0);
  const seek = (at: number) => {
    const v = ref.current;
    if (!v) return;
    userPaused.current = false;
    v.currentTime = at;
    v.play().catch(() => {});
  };
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <figure className="m-0">
      <figcaption className="label">Switching modes in the live app today</figcaption>
      <div className="mt-6 grid items-center gap-8 sm:grid-cols-[13.5rem_1fr] sm:gap-10">
        <div className="mx-auto w-[13.5rem]">
          <IPhone aspect="540/1170">
            <video
              ref={ref}
              src={`${IMG}/switch.mp4`}
              poster={`${IMG}/switch-poster.jpg`}
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onClick={toggle}
              aria-label="Screen recording of the Upstox app: opening the account menu in Pro, flipping the mode toggle, confirming, waiting for the app to reload in Invest, then tapping Trade and waiting again to return to Pro"
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            />
          </IPhone>
          <button type="button" onClick={toggle} className="mx-auto mt-4 block text-[13px] text-muted underline underline-offset-4 hover:text-ink">
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <ol>
          {SWITCH.map(([at, h, p], i) => {
            const on = i === active;
            return (
              <li key={h}>
                <button type="button" onClick={() => seek(at + 0.05)} aria-current={on ? "step" : undefined} className={`grid w-full grid-cols-[1.75rem_1fr] items-baseline gap-2 border-t py-2.5 text-left transition-colors duration-500 ${on ? "border-ink text-ink" : "border-line text-ink/45 hover:text-ink/80"}`}>
                  <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block">{h}</span>
                    <span className={`grid text-sm text-muted transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden">
                        <span className="block pt-0.5">{p}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-6 text-sm text-muted">Three taps and a reload to reach Invest, then another reload to come back. Recorded on my own account.</p>
    </figure>
  );
}

/** Under the split: buy in Pro, then cross to Invest to see what you bought. */
export function SplitCost() {
  return (
    <figure className="m-0">
      <figcaption className="label">What the split would have meant</figcaption>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5b2ebd]">
            <i className="size-1.5 rounded-full bg-[#5b2ebd]" /> Pro
          </p>
          <Bezel className="w-full max-w-[13rem] !shadow-[inset_0_0_0_1.5px_#3a3a3e,0_0_0_3px_#1b1b1e,0_30px_50px_-28px_rgba(20,10,40,0.45)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/pro-order-complete.jpg`} alt="Order complete for Apple in Upstox Pro" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </Bezel>
          <p className="mt-4 text-sm">Buy a US stock in Pro.</p>
        </div>

        <div className="flex flex-col items-center gap-2 text-center text-[#d9482b]">
          <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.1em]">Switch<br />modes</span>
          <svg aria-hidden width="46" height="12" viewBox="0 0 46 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="max-sm:w-8">
            <path d="M1 6h42" strokeDasharray="4 4" />
            <path d="m39 1.5 5 4.5-5 4.5" />
          </svg>
          <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.1em]">3 taps<br />+ reload</span>
        </div>

        <div>
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <i className="size-1.5 rounded-full border border-current" /> Invest
          </p>
          <Bezel className="w-full max-w-[13rem] !shadow-[inset_0_0_0_1.5px_#3a3a3e,0_0_0_3px_#1b1b1e,0_30px_50px_-28px_rgba(20,10,40,0.45)]">
            {/* the whole Invest portfolio page, scrollable inside the phone */}
            <div data-lenis-prevent tabIndex={0} aria-label="Invest mode: US Stocks portfolio with the wallet and holdings. Scroll to see the full screen." className="f-hide-scroll absolute inset-0 overflow-y-auto overscroll-contain">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/invest-portfolio.webp`} alt="The US Stocks portfolio in Invest mode: portfolio value, US Stocks wallet with Add funds and the list of investments" loading="lazy" className="block w-full" />
            </div>
          </Bezel>
          <p className="mt-4 text-sm">Go to Invest to see your wallet and holdings.</p>
        </div>
      </div>
      <p className="mt-6 text-sm text-muted">The Invest screen is the design from last year. Scroll inside the phone to see the wallet and holdings.</p>
    </figure>
  );
}

const WALLETS = [
  { id: "in", label: "Indian wallet", src: "wallet-indian.png", alt: "The wallet screen in Pro with the Indian wallet tab selected: ₹1,66,000 available to trade" },
  { id: "us", label: "US wallet", src: "wallet-us.png", alt: "The wallet screen in Pro with the US wallet tab selected: $10.01 available to invest" },
] as const;

/** The wallet as designed for Pro: the US wallet is a second tab beside the Indian one. */
export function WalletTabs() {
  const [tab, setTab] = useState<"in" | "us">("us");
  return (
    <div>
      <div role="tablist" aria-label="Wallet" className="flex gap-2">
        {WALLETS.map((w) => (
          <button key={w.id} type="button" role="tab" aria-selected={tab === w.id} onClick={() => setTab(w.id)} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-300 ${tab === w.id ? "border-[#5b2ebd] bg-[#5b2ebd] text-white" : "border-ink/20 hover:border-ink/50"}`}>
            {w.label}
          </button>
        ))}
      </div>
      <Bezel className="mt-5 w-full max-w-[13rem] !shadow-[inset_0_0_0_1.5px_#3a3a3e,0_0_0_3px_#1b1b1e,0_30px_50px_-28px_rgba(20,10,40,0.45)]">
        {WALLETS.map((w) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={w.id} src={`${IMG}/${w.src}`} alt={w.alt} aria-hidden={tab !== w.id} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${tab === w.id ? "opacity-100" : "opacity-0"}`} />
        ))}
      </Bezel>
    </div>
  );
}
