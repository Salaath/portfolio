import type { Metadata } from "next";
import cv from "@/content/cv.json";
import { EMAIL, LINKEDIN_URL, MAILTO, RESUME_PDF } from "@/content/links";
import { Choreo } from "@/components/Choreo";
import { Magnetic } from "@/components/Magnetic";
import { RollButton } from "@/components/RollButton";
import { CityCube } from "@/components/about/CityCube";
import { SpinBook } from "@/components/about/SpinBook";

// The copy comes from src/content/cv.json, which is generated from the CV
// (~/Case study/cv/sync-to-portfolio.py). Edit the CV, not the JSON.

export const metadata: Metadata = {
  title: "About — Salaath Shaikh",
  description: "Product Design Lead at Upstox, crafting investing experiences for millions of Indians.",
};

// Sal's own words for the top of the page (the rest comes from the CV).
const ABOUT = [
  "I\u2019m a Product Design Lead at Upstox, crafting investing experiences for millions of Indians \u2014 from their first trade to more complex trading tools. I lead and mentor a team of six product designers, staying closely involved in the work and building alongside them.",
  "I care about software that feels cared for i.e the motion, the details and the decisions nobody explicitly asked for but everybody feels. Trained as an architect, I tend to think in systems rather than screens, bringing a broader perspective to the products I build.",
  "I\u2019m particularly interested in how AI can raise the ceiling of what we create, not just the floor. As execution becomes increasingly accessible, I believe the real design work lies in having conviction: knowing what is worth building, making deliberate choices and editing relentlessly until done actually means good.",
];

// Sal's own words. Do not rewrite.
const OUTSIDE = [
  "I\u2019ll read anything printed that\u2019s put in front of me. It started with newspapers as a kid and never stopped, so there\u2019s always a fiction novel on the go too.",
  "Weekends are for F1.",
  "I love exploring cities on foot: Barcelona, Madrid, Paris, Prague, Berlin, Amsterdam, Vienna, Salzburg, Zurich, Colombo. I come back with design inspiration and a love for the people, cultures and food.",
];

type Run = { t: string; b: boolean };
type Row = { k: string; v: string; when: string };

/** Section shell: the heading pins on the left while its content scrolls on the right. */
function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-12 border-t border-line px-4 py-24 sm:px-10 md:grid-cols-6 md:gap-0 md:py-28">
      <div className="md:col-span-2">
        <div data-pin className="md:pr-10">
          <p data-label className="label mb-6">[ {index} — {title} ]</p>
          <h2 data-split="lines" className="text-5xl font-semibold leading-[0.95] tracking-[-0.045em] md:text-[4.6vw]">
            {title}
          </h2>
        </div>
      </div>
      <div className="md:col-span-4 md:pl-3">{children}</div>
    </section>
  );
}

function Rows({ rows }: { rows: Row[] }) {
  return (
    <dl>
      {rows.map((r) => (
        <div key={r.k} data-fade className="grid gap-x-8 gap-y-1 border-t border-line py-6 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
          <dt className="text-lg font-semibold tracking-[-0.02em]">{r.k}</dt>
          <dd className="text-muted">{r.v}</dd>
          {r.when && <dd className="label whitespace-nowrap md:pt-1.5 md:text-right">{r.when}</dd>}
        </div>
      ))}
    </dl>
  );
}

export default function About() {
  return (
    <Choreo>
      <header className="px-4 pb-24 pt-36 sm:px-10 md:pb-32 md:pt-44">
        <p data-label className="label mb-8">[ About — {cv.role} ]</p>
        <h1
          data-split="lines"
          data-load
          data-delay="0.1"
          className="max-w-6xl text-3xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-4xl md:text-[3.1vw]"
        >
          {ABOUT[0]}
        </h1>
        <div data-fade data-load data-delay="0.45" className="mt-12 grid gap-8 md:mt-16 md:grid-cols-6 md:gap-0">
          {ABOUT.slice(1).map((para, i) => (
            <p key={i} className={`text-lg leading-relaxed text-muted md:text-xl md:leading-[1.5] ${i ? "md:col-span-2 md:pl-3" : "md:col-span-2 md:col-start-3 md:pl-3 md:pr-8"}`}>
              {para}
            </p>
          ))}
        </div>
        <div data-fade data-load data-delay="0.6" className="mt-14 grid gap-8 md:mt-20 md:grid-cols-6 md:items-center">
          <div className="md:col-span-2">
            <Magnetic strength={0.2}>
              <RollButton href={RESUME_PDF} newTab label="Download résumé" icon="↓" />
            </Magnetic>
          </div>
          <div className="label flex flex-col gap-1 md:col-span-2 md:pl-3">
            <span>{cv.location}</span>
            <span>{cv.jobs[0].title} — {cv.jobs[0].company}</span>
          </div>
          <div className="label flex flex-col gap-1 md:col-span-2 md:items-end md:pl-3">
            <a href={MAILTO} className="normal-case tracking-normal hover:text-ink">{EMAIL}</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:text-ink">
              LinkedIn <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </header>

      <Block index="01" title="Experience">
        {cv.jobs.map((job) => (
          <article key={`${job.title}-${job.when}`} className="border-t border-line py-10 first:border-t-0 first:pt-0">
            <div data-fade className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">
                {job.title} <span className="font-medium text-muted">· {job.company}</span>
              </h3>
              <span className="label whitespace-nowrap">{job.when}</span>
            </div>
            <ul className="mt-6 flex flex-col gap-3">
              {(job.bullets as Run[][]).map((runs, i) => (
                <li key={i} data-fade data-delay={Math.min(i, 4) * 0.05} className="grid grid-cols-[1.125rem_minmax(0,1fr)] text-muted md:text-lg md:leading-snug">
                  <span aria-hidden className="mt-[0.62em] size-[5px] rounded-full bg-ink/25" />
                  <span>
                    {runs.map((r, k) =>
                      r.b ? <strong key={k} className="font-semibold text-ink">{r.t}</strong> : <span key={k}>{r.t}</span>,
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
        {cv.earlier.map((job) => (
          <div key={job.title} data-fade className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-line py-6">
            <p className="text-lg font-semibold tracking-[-0.02em]">
              {job.title} <span className="font-medium text-muted">· {job.company}</span>
            </p>
            <span className="label whitespace-nowrap">{job.when}</span>
          </div>
        ))}
      </Block>

      <Block index="02" title="Skills">
        <Rows rows={cv.skills} />
      </Block>

      <Block index="03" title="Recognition">
        <Rows rows={cv.recognition.map((r) => ({ ...r, when: "" }))} />
      </Block>

      <Block index="04" title="Education">
        <Rows rows={cv.education} />
      </Block>

      {/* 05 — Outside work: one dark breakout, in the order Sal wrote it.
          Reading beside a book that turns and fans open, F1 as the loud line
          in the middle, then the cities beside the cube of their pictures. */}
      <section className="relative overflow-hidden bg-ink px-4 pb-24 pt-24 text-bg sm:px-10 md:pb-36 md:pt-28">
        <p data-label className="label !text-bg/60">[ 05 — Outside work ]</p>
        <h2 data-split="chars" className="mt-8 text-[15.2vw] font-semibold leading-[0.85] tracking-[-0.06em] md:mt-6 md:whitespace-nowrap">
          Outside work
        </h2>

        {/* reading: the words light up as you read them, the book turns beside them */}
        <div className="mt-14 grid items-center gap-y-6 md:mt-10 md:grid-cols-6">
          <div className="md:col-span-3 md:pr-[4vw]">
            <p data-label className="label mb-6 !text-bg/50">Reading</p>
            <p data-scrub-words className="text-[7.4vw] font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl md:text-[3.3vw] md:leading-[1.06]">
              {OUTSIDE[0]}
            </p>
          </div>
          <div data-fade data-delay="0.1" className="mx-auto w-[min(92vw,460px)] md:col-span-3 md:w-[min(44vw,82svh)]">
            <SpinBook />
          </div>
        </div>

        {/* F1: one line, as wide as the section */}
        <div className="mt-20 md:mt-[9vw]">
          <p data-label className="label mb-5 !text-bg/50 md:text-center">Weekends</p>
          <p data-split="lines" className="text-[15vw] font-medium leading-[0.88] tracking-[-0.055em] md:whitespace-nowrap md:text-center md:text-[9.6vw]">
            {OUTSIDE[1]}
          </p>
        </div>

        {/* cities: the cube of their pictures, then the words */}
        <div className="mt-20 grid items-center gap-y-10 md:mt-[9vw] md:grid-cols-6">
          <div data-fade className="mx-auto w-[min(84vw,420px)] md:col-span-3 md:w-[min(38vw,74svh)]">
            <CityCube />
            <p className="label mt-6 text-center !text-bg/60">Drag the cube to look around</p>
          </div>
          <div className="md:col-span-3 md:pl-[4vw]">
            <p data-label className="label mb-6 !text-bg/50">On foot</p>
            <p data-scrub-words className="text-[7.4vw] font-medium leading-[1.08] tracking-[-0.035em] sm:text-4xl md:text-[3.3vw] md:leading-[1.06]">
              {OUTSIDE[2]}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-32 text-center sm:px-10 md:py-40">
        <p data-label className="label mb-8">[ Résumé — one page, PDF ]</p>
        <h2 data-split="lines" className="mx-auto max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] md:text-[6vw]">
          Take it with you
        </h2>
        <div data-fade data-delay="0.2" className="mt-12 flex flex-wrap justify-center gap-4">
          <RollButton href={RESUME_PDF} newTab label="Download résumé" icon="↓" />
          <RollButton href="/#work" label="See selected work" />
        </div>
      </section>
    </Choreo>
  );
}
