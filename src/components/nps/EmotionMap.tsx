"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// From the emotion mapping board in Figma (UP_NPS › Emotion mapping).
const STAGES = [
  {
    key: "Explore",
    needs: ["Work out how much to invest, based on the tax exemption", "Choose a plan based on my age", "Pick a provider on risk and returns", "Already investing? Port my PRAN to Upstox"],
    mood: "Excited, then worried",
    worries: [
      "How much should I invest? Can I afford this? Am I getting the full tax benefit?",
      "What are these plans? Should I be safe?",
      "These are all banks I know. I thought the government ran this?",
      "Which provider should I pick? Who is better?",
      "How can I withdraw this at maturity? Is my money locked in?",
      "Is this my best option? Should I invest in mutual funds instead?",
    ],
    feel: ["I have the right information to make a decision", "I am confident about these choices", "This is the right decision for my future"],
  },
  {
    key: "Buy",
    needs: ["Decide how much to invest", "Choose a payment mode and autopay", "Already have a PRAN? Nudge me to transfer", "Download tax proof"],
    mood: "Worried, then happy",
    worries: [
      "Am I investing the right amount?",
      "How much will I get at maturity? Pension? Lump sum?",
      "Am I using the correct bank account to pay?",
      "Will autopay be set? Do I have to contribute every year?",
    ],
    feel: ["This is super easy to do", "I made the right choices at every step", "I have secured my future"],
  },
  {
    key: "Track",
    needs: ["Track the total worth of my portfolio", "Track investments and returns", "Download tax proof", "Track every holding and transaction, and invest more"],
    mood: "Worried, after every change",
    worries: [
      "Is my money growing enough? Should I invest more?",
      "Has my investment gone through in time for my taxes?",
      "I suddenly saw a ₹50k transaction. What was it for?",
      "Why did my plan update? Am I losing returns on an aggressive plan?",
    ],
    feel: ["I can track everything in one place", "I can see my portfolio value", "Transactions are easy and simple"],
  },
];

/** Tabs across the journey; each shows what people need, what they fear, and how they should feel. */
export function EmotionMap() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const s = STAGES[i];

  useGSAP(
    () => {
      gsap.from("[data-em]", { autoAlpha: 0, y: 24, stagger: 0.05, duration: 0.8, ease: "expo.out" });
    },
    { scope: ref, dependencies: [i], revertOnUpdate: true },
  );

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STAGES.map((st, k) => (
          <button
            key={st.key}
            type="button"
            onClick={() => setI(k)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-500 ${k === i ? "bg-ink text-bg" : "bg-white text-ink/70 hover:text-ink"}`}
          >
            {String(k + 1).padStart(2, "0")} · {st.key}
          </button>
        ))}
        <span className="rounded-full border border-dashed border-ink/20 px-5 py-2.5 text-sm text-muted">04 · Withdraw, next phase</span>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1.3fr_1fr]">
        <div data-em className="rounded-[2rem] bg-white p-7">
          <span className="label">What they need to do</span>
          <ul className="mt-5 flex flex-col gap-3">
            {s.needs.map((n) => (
              <li key={n} className="flex gap-3 text-[15px]">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink" />
                {n}
              </li>
            ))}
          </ul>
        </div>
        <div data-em className="rounded-[2rem] bg-[#121110] p-7 text-white">
          <div className="flex items-center justify-between">
            <span className="label !text-white/55">What goes through their head</span>
            <span className="rounded-full bg-[#F0443A] px-2.5 py-1 text-[11px] font-medium">{s.mood}</span>
          </div>
          <div className="mt-5 flex flex-col gap-2.5">
            {s.worries.map((w, k) => (
              <p key={w} data-em className="rounded-2xl bg-white/[0.07] px-4 py-3 text-[15px] leading-snug" style={{ marginLeft: k % 2 ? 24 : 0 }}>
                “{w}”
              </p>
            ))}
          </div>
        </div>
        <div data-em className="rounded-[2rem] bg-[#E6F6EE] p-7">
          <span className="label !text-[#0d7a48]">How we want them to feel</span>
          <div className="mt-5 flex flex-col gap-3">
            {s.feel.map((f) => (
              <p key={f} className="flex items-start gap-3 text-[15px] font-medium">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#14A363] text-xs text-white">✓</span>
                {f}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
