import type { Metadata } from "next";
import Link from "next/link";
import { Choreo } from "@/components/Choreo";
import { ReadBar } from "@/components/fable/Bits";
import { FlowStage } from "@/components/usstocks/FlowStage";
import { Storyline } from "@/components/usstocks/Storyline";
import { ProjectFacts, ProjectHead, type Fact } from "@/components/usstocks/Lead";
import { RatingStage, RatingStory } from "@/components/ratings/RatingStory";

// Initiatives I drove end to end. Leadership evidence, set apart from the case
// studies: each project is told as a decision, not a process.
//   01 US Stocks on Pro: the full one-pager (flow recording, four sections,
//      result). Copy and figures are Sal's, from the brief of 19 Nov 2026.
//   02 In-app ratings ("right-time ratings"): one recording and the live prototype of the new sheet,
//      four sections and the result. Copy and figures are Sal's, from the
//      brief of 20 Nov 2026. It replaced the Upstox Cloud placeholder.
// A null fact renders as a "To add" marker and keeps its place in the row.

const DESCRIPTION = "Two projects at Upstox in 2026 where I took the initiative, aligned product and engineering and shipped a better experience.";

export const metadata: Metadata = {
  title: "Initiatives I drove end to end — Salaath Shaikh",
  description: DESCRIPTION,
  openGraph: { title: "Initiatives I drove end to end", description: DESCRIPTION, type: "article" },
  twitter: { card: "summary_large_image", title: "Initiatives I drove end to end", description: DESCRIPTION },
};

const PROTO = "/proto/us-stocks/index.html";

const US_FACTS: Fact[] = [
  ["Role", "Product design manager"],
  ["Team", "Nandini Singh"],
  ["Product manager", "Siddhant Tripathi"],
  ["Timeline", "30 days (first week of June to July 2026)"],
];

const RATING_PROTO = "/proto/in-app-rating/index.html";

const RATING_FACTS: Fact[] = [
  ["Role", "Product design manager"],
  ["Team", "Shrimi Verma"],
  ["Product manager", "Tanuj Kukreti"],
  ["Timeline", "1 week (second week of September)"],
];

const RESULTS = [
  { value: "$1,763,732", label: "Total value of orders placed", note: "Sept 19 – Oct 19, 2026" },
  { value: "~$122", label: "Average buy order", note: "Sept 19 – Oct 19, 2026" },
];

const RATING_RESULTS = [
  { value: "28%", label: "Higher engagement from people who interact with the sheet", note: "Compared with the old sheet" },
  { value: "6", label: "Contextual nudges", note: "Orders · Funds · IPO · US Stocks" },
];

const INDEX = [
  { n: "01", id: "us-stocks", title: "US Stocks on Pro", meta: "Live · Sept 19, 2026" },
  { n: "02", id: "in-app-ratings", title: "Right-time ratings", meta: "Shipped on Upstox" },
];

// What "leading" covers on this page. The four steps are Sal's own account of
// both projects (20 Nov 2026).
const LEADING = [
  ["Pushed back", "Made the case to senior leadership for a different approach."],
  ["Aligned product", "Got the product managers behind one direction."],
  ["Brought engineering in", "Worked the approach through with the engineering team leads."],
  ["Planned the delivery", "Laid out the deliverables so the team had a proper plan to ship against."],
];

export default function Leadership() {
  return (
    <Choreo>
      <ReadBar />

      {/* the page: what this is and the two projects on it */}
      <header className="night relative overflow-hidden">
        {/* the sky: title in the violet, statement where it has fallen to night */}
        <div className="lead-sky relative flex min-h-svh flex-col items-center px-4 pb-16 pt-36 text-center sm:px-10 md:pb-20 md:pt-44">
          <span aria-hidden className="lead-clouds" />
          <p data-label className="label !text-white/70">[ Leading the team — 2026 ]</p>
          <h1 data-split="lines" className="mt-8 max-w-[11ch] [text-wrap:balance] text-[15vw] leading-[0.92] tracking-[-0.045em] text-[#f6f1ff] md:text-[min(9.6vw,10rem)]">Initiatives I drove end to end</h1>
          <p data-fade className="mt-auto max-w-3xl pt-24 text-xl leading-[1.3] tracking-[-0.015em] text-ink/85 md:text-[1.7rem]">
            To me, leading is taking the initiative when the experience is at stake, whether that means pushing back on the plan or picking up a problem nobody owns. On both projects I thought as a systems designer, made the case and saw it through.
          </p>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-10 md:pb-20">
          {/* what leading meant, in the order it happened */}
          <div className="pt-10 md:pt-16">
            <p data-label className="label">[ What leading meant ]</p>
            <ol className="mt-6 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {LEADING.map(([h, p], i) => (
                <li key={h} data-fade data-delay={i * 0.08} className="border-t border-ink/40 pb-8 pt-5">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-6 text-2xl tracking-[-0.02em]">{h}</h2>
                  <p className="mt-3 max-w-[18rem] text-muted">{p}</p>
                </li>
              ))}
            </ol>
            <p data-fade className="mt-6 max-w-3xl border-t border-line pt-6 text-xl leading-snug tracking-[-0.01em] md:text-2xl">
              <span className="text-[var(--accent)]">The result.</span> Both shipped. US stocks is one seamless journey where it would have been built half and half. The rating sheet now appears only when there is something real to rate.
            </p>
          </div>

          <nav aria-label="Projects on this page" className="mt-16 md:mt-24">
            {INDEX.map((p) => (
              <a key={p.id} href={`#${p.id}`} data-fade className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-t border-line py-5 last:border-b md:grid-cols-[4rem_1fr_auto_2rem]">
                <span className="font-mono text-xs text-muted">{p.n}</span>
                <span className="text-2xl tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-4xl">{p.title}</span>
                <span className="label hidden md:block">{p.meta}</span>
                <span aria-hidden className="text-right transition-transform duration-500 group-hover:translate-y-1">↓</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ───────── 01 US Stocks on Pro ───────── */}
      <div id="us-stocks" className="scroll-mt-0">
        {/* the end-to-end flow, before any words */}
        <FlowStage video="/work/us-stocks/flow.mp4" poster="/work/us-stocks/flow-poster.jpg" proto={`${PROTO}?embed`} />

        <div className="paper white">
          <section className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-10 md:pb-28 md:pt-36">
            <ProjectHead
              n="01"
              title="US Stocks on Pro"
              status={
                <span className="flex items-center gap-3">
                  <i className="size-[7px] rounded-full bg-[#1f9d55]" /> Live on Upstox Pro
                </span>
              }
            >
              US stocks was about to launch half in Pro and half in Invest. I made the case for one journey and we shipped it end to end in Pro.
            </ProjectHead>
            <ProjectFacts facts={US_FACTS} className="mt-16 md:mt-24" />
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-10 md:pb-40">
            <Storyline />
          </section>
        </div>

        {/* the result */}
        <section className="night relative overflow-hidden px-4 py-24 sm:px-10 md:py-36">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(124,92,255,0.24),transparent_70%)]" />
          <div className="relative mx-auto max-w-7xl">
            <p data-label className="label">[ Launched Sept 19, 2026 ]</p>
            <dl className="mt-12 grid gap-y-14 md:grid-cols-[1.65fr_1fr] md:gap-x-14">
              {RESULTS.map((r, i) => (
                <div key={r.label} className={i ? "md:border-l md:border-line md:pl-14" : ""}>
                  <dd data-count className="whitespace-nowrap text-[16vw] leading-[0.9] tabular-nums tracking-[-0.05em] md:text-[min(8.2vw,8.75rem)]">{r.value}</dd>
                  <dt data-fade className="mt-6 text-lg">{r.label}</dt>
                  <dd data-fade className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">{r.note}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-20 border-t border-line pt-6 md:mt-28">
              <a href={PROTO} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 underline-offset-4 hover:underline">
                Open the prototype full screen <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ───────── 02 In-app ratings ───────── */}
      <div id="in-app-ratings" className="scroll-mt-0">
        <div className="paper">
          <section className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-10 md:pb-28 md:pt-36">
            <ProjectHead
              n="02"
              title="Right-time ratings"
              status={
                <span className="flex items-center gap-3">
                  <i className="size-[7px] rounded-full bg-[#1f9d55]" /> Shipped on Upstox
                </span>
              }
            >
              A “Rate Upstox” sheet was popping up uninvited, badly timed and badly designed. It wasn’t on the roadmap, so I raised it, scoped it and got it shipped properly.
            </ProjectHead>
            <ProjectFacts facts={RATING_FACTS} className="mt-16 md:mt-24" />
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-10 md:pb-12">
            <RatingStory />
          </section>

          {/* the six nudges, one recording and the live prototype, right after the outcome and before the figures */}
          <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-10 md:pb-28 md:pt-16">
            <RatingStage />
          </section>
        </div>

        {/* the result */}
        <section className="night relative overflow-hidden px-4 py-24 sm:px-10 md:py-36">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(124,92,255,0.24),transparent_70%)]" />
          <div className="relative mx-auto max-w-7xl">
            <p data-label className="label">[ Shipped with six contextual nudges ]</p>
            <dl className="mt-12 grid gap-y-14 md:grid-cols-2 md:gap-x-14">
              {RATING_RESULTS.map((r, i) => (
                <div key={r.label} className={i ? "md:border-l md:border-line md:pl-14" : ""}>
                  <dd data-count className="whitespace-nowrap text-[22vw] leading-[0.9] tabular-nums tracking-[-0.05em] md:text-[min(11vw,11rem)]">{r.value}</dd>
                  <dt data-fade className="mt-6 max-w-sm text-lg">{r.label}</dt>
                  <dd data-fade className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">{r.note}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-20 border-t border-line pt-6 md:mt-28">
              <a href={RATING_PROTO} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 underline-offset-4 hover:underline">
                Open the prototype full screen <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer className="night px-4 py-10 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-5">
          <Link href="/#work" className="group flex items-center gap-2 underline-offset-4 hover:underline">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All work
          </Link>
          <span className="label">Sal · Lead product designer, Upstox</span>
        </div>
      </footer>
    </Choreo>
  );
}
