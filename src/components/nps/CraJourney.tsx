"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// An account opening journey, screen by screen. The card shows a strip of
// screens; clicking opens a full-screen walkthrough. Rendered in a portal because
// the page's smooth scroller transforms its content, which breaks position: fixed.

type Screen = { stage: string; title: string; note: string };
type Journey = {
  dir: string;
  name: string;
  sub: string;
  summary: string;
  summarySub: string;
  credit: string;
  preview: number[];
  tint: string;
  screens: Screen[];
};

const JOURNEYS: Record<"enps" | "kfin", Journey> = {
  enps: {
    dir: "enps",
    name: "Protean eNPS · Account opening",
    sub: "Tier I, individual subscriber, Aadhaar e-KYC",
    summary: "23 screens, 5 OTPs, 2 captchas",
    summarySub: "from the home page to a downloadable form",
    credit: "Screens from a public walkthrough recorded in July 2022, with personal details blurred by the person recording.",
    preview: [1, 5, 9, 10, 16],
    tint: "#f3eee6",
    screens: [
      { stage: "Before you start", title: "The Protean home page", note: "A page of guidelines comes first: what you’ll need, what’s optional, the minimum payment. Registration sits behind a button labelled “National Pension System”." },
      { stage: "Start", title: "Five choices before your Aadhaar number", note: "How to register, applicant type, residency, account type and KYC option. Tier I or Tier I & II is asked here, with no explanation of either." },
      { stage: "Start", title: "Aadhaar consent", note: "Five numbered clauses to agree to before an OTP is sent." },
      { stage: "Start", title: "OTP one", note: "The OTP field appears under the same form. Continue and Regenerate OTP sit side by side as near-identical buttons." },
      { stage: "Start", title: "An acknowledgement number to keep", note: "Leave now and this number is how you get back in, through “Complete Pending Registration”." },
      { stage: "Registration details", title: "A six-step tracker, and seven tabs inside one step", note: "Registration is one step on the tracker but seven tabs underneath. The contact tab opens on FATCA tax residency." },
      { stage: "Registration details", title: "Mobile and email, verified again", note: "Separate OTPs for the mobile number and the email, after the Aadhaar OTP already sent one." },
      { stage: "Registration details", title: "Save often, or lose it", note: "A note under the address form asks you to save at short intervals, because the session can expire and take your data with it." },
      { stage: "Registration details", title: "Bank details, by hand", note: "Account number, IFSC, bank name, branch, branch address, PIN and MICR. The same tab asks for income range and politically exposed person status." },
      { stage: "Registration details", title: "Pick a fund manager from a list of names", note: "Seven pension fund managers in a dropdown, as company names only. Nothing about returns or charges." },
      { stage: "Registration details", title: "Split your money across four schemes", note: "Choose Active and you type the percentages for schemes E, C, G and A yourself. A question-mark icon is the only help." },
      { stage: "Registration details", title: "Eighteen fields for one nominee", note: "Name, age, relationship, share, address, and guardian details in case the nominee is a minor." },
      { stage: "Registration details", title: "Scans of PAN and a cancelled cheque", note: "Each file has to be JPEG, JPG or PDF, and between 4 KB and 2 MB." },
      { stage: "Registration details", title: "Photo and signature", note: "JPG only. A link explains how to scan a signature." },
      { stage: "Registration details", title: "Review", note: "Every answer comes back as a table to check, tab by tab." },
      { stage: "Payment", title: "Contribution amount", note: "₹500 minimum for Tier I. Transaction and service charges sit behind a link under the button." },
      { stage: "Payment", title: "Declarations and add-ons", note: "Two legal declarations, one under the money laundering act, then paid PRAN card options from ₹18 to ₹40, and a reminder to add a remark at your bank." },
      { stage: "Payment", title: "Confirm your details, again", note: "A pop-up to confirm everything before choosing a payment gateway." },
      { stage: "Payment", title: "Out to the payment gateway", note: "The ₹500 is paid on BillDesk." },
      { stage: "Payment", title: "A PRAN, finally", note: "The receipt shows the retirement account number. The account still isn’t complete: the form has to be authenticated." },
      { stage: "Authenticate", title: "Authenticate the form", note: "A captcha asks you to add two numbers before another OTP is sent." },
      { stage: "Authenticate", title: "Two more OTPs and another captcha", note: "Email OTP, mobile OTP, a declaration and a second sum to solve." },
      { stage: "Authenticate", title: "Done", note: "A success line, and a link to download the form you just filled in." },
    ],
  },
  kfin: {
    dir: "kfin",
    name: "KFintech · NPS investor onboarding",
    sub: "Distributor-assisted, in KFintech’s IRIS partner platform",
    summary: "12 steps, 5 file uploads, 1 distributor",
    summarySub: "from a partner dashboard to the amount payable",
    credit: "Screens from KFintech’s own IRIS training video, early 2026.",
    preview: [2, 5, 9, 11, 3],
    tint: "#2a3550",
    screens: [
      { stage: "Start", title: "It starts in a distributor’s dashboard", note: "NPS is one product among mutual funds, fixed deposits, AIF, PMS and SIF. The investor isn’t the one at the keyboard; a distributor clicks “New Investor” for them." },
      { stage: "Start", title: "PAN and date of birth, checked first", note: "If the PAN is KYC-verified, contact details fill in on their own. The note under the fields says the PAN is also checked against an AML database." },
      { stage: "Investor details", title: "Everything about you, on one screen", note: "Residency, PAN, date of birth, name, email, mobile, occupation, place and country of birth, nationality, income, marital status, PEP status, gender, and which parent’s name goes on the ePRAN." },
      { stage: "Investor details", title: "FATCA, as an address form", note: "“Address in the jurisdiction of tax residence” is the only framing. What FATCA is, and why it’s asked, is left to the distributor to explain." },
      { stage: "Investment", title: "Tier choice, with a line of help", note: "Tier I and Tier I & II each get a short explanation, and the tax benefit under 80C and 80CCD is named. More than Protean offers at the same point." },
      { stage: "Investment", title: "Auto choice as three donut charts", note: "Moderate, Conservative and Aggressive lifecycle funds, drawn as rings. In the recording, the legends still read “Label for Equity – 50%”. The fund manager is a dropdown of company names." },
      { stage: "Investment", title: "Active choice, with sliders", note: "Sliders and boxes for E, C and G. Easier than typing percentages, but nothing on the screen says what each asset class holds or how risky it is." },
      { stage: "Nominee and bank", title: "A shorter nominee form", note: "Name, relationship, date of birth, share and gender. Tier II can reuse the Tier I nominee with a checkbox." },
      { stage: "Nominee and bank", title: "Bank details, typed twice", note: "IFSC, bank name, account number and a confirmation of it, plus terms to accept. Tier II can reuse the Tier I bank." },
      { stage: "Documents", title: "Five uploads", note: "Photograph, signature, a cancelled cheque for each tier and the PAN card. JPG or PNG, between 2 KB and 2 MB." },
      { stage: "Documents", title: "PRAN kit format and language", note: "Digital ePRAN or a physical kit, in English or Hindi." },
      { stage: "Review", title: "Review, and the amount payable", note: "Scheme, fund manager and contribution for each tier. In the recording, every charge reads N/A and the total payable reads “₹ NaN”." },
    ],
  },
};

const stagesOf = (screens: Screen[]) =>
  screens.reduce<{ name: string; start: number; count: number }[]>((acc, s, i) => {
    const last = acc[acc.length - 1];
    if (last && last.name === s.stage) last.count++;
    else acc.push({ name: s.stage, start: i, count: 1 });
    return acc;
  }, []);

const pad = (n: number) => String(n).padStart(2, "0");

export function CraJourney({ id }: { id: keyof typeof JOURNEYS }) {
  const J = JOURNEYS[id];
  const SCREENS = J.screens;
  const STAGES = stagesOf(SCREENS);
  const src = (i: number, small = false) => `/work/nps/${J.dir}/${pad(i + 1)}${small ? "-s" : ""}.jpg`;
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  const go = useCallback((n: number) => setI(Math.max(0, Math.min(SCREENS.length - 1, n))), [SCREENS.length]);
  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setI((v) => Math.min(SCREENS.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, SCREENS.length]);

  // keep the active thumbnail in view
  useEffect(() => {
    if (!open) return;
    const el = strip.current?.querySelector<HTMLElement>(`[data-i="${i}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [i, open]);

  const s = SCREENS[i];

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => {
          setI(0);
          setOpen(true);
        }}
        data-cursor="View"
        aria-label={`Open the ${J.name} journey, ${SCREENS.length} screens`}
        style={{ backgroundColor: J.tint }}
        className="group relative mt-6 block w-full overflow-hidden rounded-2xl text-left"
      >
        <div data-wipe className="relative h-[14rem] md:h-[18rem]">
          <div data-wipe-inner className="absolute inset-0 flex gap-3 p-3 md:gap-4 md:p-4">
            {J.preview.map((n, k) => (
              <div
                key={n}
                className={`relative h-full min-w-0 flex-1 overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-transform duration-500 ease-out group-hover:-translate-y-1 ${k > 2 ? "hidden md:block" : ""} ${k > 3 ? "md:hidden lg:block" : ""}`}
                style={{ transitionDelay: `${k * 40}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src(n)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-left-top" />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#121110]/70 via-[#121110]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
            <p className="max-w-sm text-sm text-white/85">
              <span className="font-semibold text-white">{J.summary}</span>
              <br className="hidden sm:block" /> {J.summarySub}
            </p>
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#121110] transition duration-300 group-hover:scale-105">
              See the journey
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h7v7M13 3 4 12" />
              </svg>
            </span>
          </div>
        </div>
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[1000] flex flex-col bg-[#0b0b0d] text-white"
              style={{ cursor: "auto" }}
              role="dialog"
              aria-modal="true"
              aria-label={`${J.name}, screen by screen`}
            >
              {/* top bar */}
              <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{J.name}</p>
                  <p className="truncate text-xs text-white/45">{J.sub}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-xs tabular-nums text-white/60">
                    {pad(i + 1)} / {SCREENS.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Close"
                    autoFocus
                    onClick={close}
                    className="grid size-10 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-black"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M3 3l10 10M13 3 3 13" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* stage progress */}
              <div className="flex gap-1.5 px-4 sm:px-6">
                {STAGES.map((st) => {
                  const done = i >= st.start + st.count;
                  const here = i >= st.start && !done;
                  const fill = done ? 100 : here ? ((i - st.start + 1) / st.count) * 100 : 0;
                  return (
                    <button
                      key={st.name}
                      type="button"
                      onClick={() => go(st.start)}
                      className="group/st min-w-0 text-left md:min-w-[8.5rem]"
                      style={{ flexGrow: st.count, flexBasis: 0 }}
                    >
                      <span className="block h-[3px] overflow-hidden rounded-full bg-white/12">
                        <span className="block h-full rounded-full bg-white transition-[width] duration-500 ease-out" style={{ width: `${fill}%` }} />
                      </span>
                      <span className={`mt-2 hidden truncate text-[11px] uppercase tracking-[0.12em] transition-colors md:block ${here ? "text-white" : "text-white/40 group-hover/st:text-white/70"}`}>
                        {st.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* stage + caption + image */}
              <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-5 px-4 pb-3 pt-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-1 lg:gap-10">
                <div className="relative order-2 min-h-0 lg:order-1">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={i}
                      src={src(i)}
                      alt={`${s.title}. ${s.note}`}
                      className="enps-in max-h-full max-w-full rounded-xl object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Previous screen"
                    onClick={() => go(i - 1)}
                    disabled={i === 0}
                    className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 ring-1 ring-white/15 backdrop-blur transition hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3 5 8l5 5" /></svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Next screen"
                    onClick={() => go(i + 1)}
                    disabled={i === SCREENS.length - 1}
                    className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 ring-1 ring-white/15 backdrop-blur transition hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m6 3 5 5-5 5" /></svg>
                  </button>
                </div>

                <div key={i} className="enps-in order-1 lg:order-2 lg:self-center" aria-live="polite">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/45">
                    {pad(i + 1)} · {s.stage}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl lg:mt-4 lg:text-[1.75rem]">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/65 lg:mt-4">{s.note}</p>
                </div>
              </div>

              {/* thumbnails */}
              <div ref={strip} className="flex gap-2 overflow-x-auto px-4 pb-3 pt-2 [scrollbar-width:none] sm:px-6">
                {SCREENS.map((sc, k) => (
                  <button
                    key={k}
                    data-i={k}
                    type="button"
                    onClick={() => go(k)}
                    aria-label={`Screen ${k + 1}: ${sc.title}`}
                    aria-current={k === i ? "step" : undefined}
                    className={`relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-md ring-1 transition duration-300 md:h-14 md:w-[5.25rem] ${k === i ? "opacity-100 ring-2 ring-white" : "opacity-40 ring-white/10 hover:opacity-80"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src(k, true)} alt="" className="h-full w-full object-cover object-left-top" />
                  </button>
                ))}
              </div>
              <p className="px-4 pb-4 text-center text-[11px] text-white/35 sm:px-6">
                {J.credit}<span className="hidden md:inline"> ← → to move · Esc to close</span>
              </p>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
