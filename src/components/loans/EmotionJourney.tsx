"use client";

import { useState } from "react";

// The user journey map from Figma (Process and explorations → User Journey Map),
// redrawn as an emotion curve. Pick a stage to read what people do, think,
// struggle with, and what we did about it.

type Stage = { name: string; score: number; mood: string; does: string; thinks: string; pain: string; fix: string };

const STAGES: Stage[] = [
  { name: "Discover", score: -0.15, mood: "Curious, a little suspicious", does: "Spots an instant loan offer inside the app and taps Apply now.", thinks: "“This seems too good to be true. Is this a gimmick?”", pain: "No preview of the steps, unclear eligibility and paperwork.", fix: "Lead with the offer, the rate and the lender, plus FAQs and a short video on how lenders are picked." },
  { name: "See the offer", score: 0.45, mood: "Delighted, then unsure", does: "Reads the pre-approved amount, the rate and the EMI options.", thinks: "“I’m eligible for this much? Is this really the best rate for me?”", pain: "No min and max amount, no sense of whether it’s fully digital.", fix: "“Best rate for you”, collateral-free, borrow from ₹10k, and the lending partner named up front." },
  { name: "Set the amount", score: -0.35, mood: "Frustrated", does: "Types the amount they actually need.", thinks: "“Let me quickly type my desired amount.”", pain: "Manual entry is fiddly and there’s no range to drag within.", fix: "A slider between min and max. (The custom snap points we wanted couldn’t be built in time.)" },
  { name: "Choose an EMI", score: -0.55, mood: "Anxious", does: "Compares plans, rates and tenures, shortlists one.", thinks: "“So many plans. Which one saves me the most interest?”", pain: "Hard to compare, and no view of the repayment schedule.", fix: "Plan cards with monthly EMI and total interest, and the schedule one tap away." },
  { name: "Add a bank", score: -0.6, mood: "Frustrated", does: "Picks or adds the account for the money and the EMIs.", thinks: "“Is this where my loan lands, or where EMIs come from?”", pain: "Adding an account is long, and typing the number twice is tedious.", fix: "Popular banks up front, account type as chips, and a ₹1 penny drop to verify." },
  { name: "KYC", score: 0.2, mood: "Relieved, but wary", does: "Takes a selfie and verifies Aadhaar through DigiLocker.", thinks: "“Quick. But is my data being used safely?”", pain: "Worry that KYC details might be misused.", fix: "A consent sheet before anything is shared, in plain words, and only for this loan." },
  { name: "Auto-EMI mandate", score: -0.3, mood: "Anxious", does: "Reviews the EMI amount and sets up autopay with their bank.", thinks: "“What are the fees? When is my first EMI?”", pain: "Processing fees, taxes and the first EMI date weren’t visible.", fix: "A review screen with every charge, the first EMI date and the bank, before submitting." },
  { name: "Money arrives", score: 0.75, mood: "Impatient, then delighted", does: "Submits and waits for the disbursal.", thinks: "“Should I wait, or can I close the app? …Oh, it’s already here.”", pain: "No idea how long it takes or whether closing the app loses progress.", fix: "A live tracker: usually within 2 hours, and a notification when it lands." },
];

const W = 760, H = 220, PAD = 40;
const x = (i: number) => PAD + (i * (W - PAD * 2)) / (STAGES.length - 1);
const y = (s: number) => H / 2 - s * (H / 2 - 30);

function curve() {
  const pts = STAGES.map((s, i) => [x(i), y(s.score)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}

export function EmotionJourney() {
  const [active, setActive] = useState(0);
  const s = STAGES[active];
  const d = curve();

  return (
    <div className="rounded-[2.4rem] bg-white p-5 md:p-10">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H + 40}`} className="block min-w-[640px]" role="img" aria-label="Emotion curve across eight stages of borrowing">
          <defs>
            <linearGradient id="emo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#14A363" />
              <stop offset="0.5" stopColor="#975bd4" />
              <stop offset="1" stopColor="#F0443A" />
            </linearGradient>
          </defs>
          <line x1={PAD} x2={W - PAD} y1={H / 2} y2={H / 2} stroke="#e9e9e7" strokeDasharray="4 6" />
          <text x={4} y={34} className="fill-[#6e6e6e] font-mono text-[10px] uppercase">Good</text>
          <text x={4} y={H - 22} className="fill-[#6e6e6e] font-mono text-[10px] uppercase">Bad</text>
          <path d={d} fill="none" stroke="url(#emo)" strokeWidth={3} strokeLinecap="round" pathLength={1} className="[stroke-dasharray:1] [animation:emo-draw_2.4s_cubic-bezier(.16,1,.3,1)_both]" />
          {STAGES.map((st, i) => (
            <g key={st.name} onClick={() => setActive(i)} className="cursor-pointer" role="button" aria-label={st.name}>
              <rect x={x(i) - 40} y={0} width={80} height={H + 40} fill="transparent" />
              <circle cx={x(i)} cy={y(st.score)} r={i === active ? 11 : 7} fill={i === active ? "#5A298B" : "#fff"} stroke="#5A298B" strokeWidth={2.5} className="transition-all duration-500" />
              {i === active ? <circle cx={x(i)} cy={y(st.score)} r={18} fill="none" stroke="#5A298B" strokeOpacity={0.25} strokeWidth={6} /> : null}
              <text x={x(i)} y={H + 30} textAnchor="middle" className={`text-[12px] ${i === active ? "fill-[#0e0e0e] font-semibold" : "fill-[#6e6e6e]"}`}>
                {st.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div key={active} className="mt-8 grid gap-4 [animation:emo-in_.6s_cubic-bezier(.16,1,.3,1)_both] md:grid-cols-[1.1fr_1fr]">
        <div className="rounded-[1.8rem] bg-[#121110] p-7 text-white">
          <span className="font-mono text-xs text-white/45">{String(active + 1).padStart(2, "0")} / 08 · {s.mood}</span>
          <p className="mt-5 text-2xl font-medium leading-snug tracking-[-0.02em]">{s.thinks}</p>
          <p className="mt-5 text-sm text-white/60">{s.does}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-[1.8rem] bg-[#F3F3F1] p-6">
            <span className="label" style={{ color: "#F0443A" }}>Pain point</span>
            <p className="mt-2 text-[15px]">{s.pain}</p>
          </div>
          <div className="rounded-[1.8rem] bg-[#F3F3F1] p-6">
            <span className="label" style={{ color: "#14A363" }}>What we did</span>
            <p className="mt-2 text-[15px]">{s.fix}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button type="button" onClick={() => setActive((active + STAGES.length - 1) % STAGES.length)} className="rounded-full px-4 py-2 text-sm ring-1 ring-black/10 hover:bg-[#F3F3F1]">← Previous</button>
        <button type="button" onClick={() => setActive((active + 1) % STAGES.length)} className="rounded-full bg-ink px-4 py-2 text-sm text-bg">Next stage →</button>
      </div>
      <style>{`@keyframes emo-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes emo-in{from{opacity:0;transform:translateY(14px)}}`}</style>
    </div>
  );
}
