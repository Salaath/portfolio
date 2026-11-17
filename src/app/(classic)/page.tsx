import { getCase, type CaseStudy } from "@/content/cases";

// Selected work on the home page, in this order. Loans and the F&O risk
// placeholder keep their pages but are left off the list for now.
const HOME_WORK = ["account-opening", "watchlist-revised", "nps", "previous-work"]
  .map(getCase)
  .filter((c): c is CaseStudy => Boolean(c));
import { Choreo } from "@/components/Choreo";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { CaseStack } from "@/components/CaseStack";
import { AiProjects } from "@/components/AiProjects";
import { Magnetic } from "@/components/Magnetic";
import { RollButton } from "@/components/RollButton";

// Draft copy for the disciplines: review before launch.
const DISCIPLINES = [
  {
    title: "Product design",
    body: "End-to-end flows for investing: onboarding, first trades, portfolios and the moments in between.",
    tags: ["Flows", "Interaction", "Prototyping", "Motion"],
    tones: ["#e9e7e1", "#d6d2c8"],
  },
  {
    title: "Design systems",
    body: "Tokens, components and the rules that keep web, app and pro surfaces speaking one language.",
    tags: ["Tokens", "Components", "Documentation"],
    tones: ["#1c1c1b", "#3a3a37"],
  },
  {
    title: "Research & strategy",
    body: "Turning what people do and what they fear, into the one bet the team should make next.",
    tags: ["Research", "Framing", "Metrics"],
    tones: ["#dfe2e4", "#c3c8cc"],
  },
  {
    title: "Leading designers",
    body: "Hands-on lead: setting the bar for craft, reviewing closely, mentoring on ADPList.",
    tags: ["Critique", "Hiring", "Mentoring"],
    tones: ["#e7e1d6", "#cfc4b2"],
  },
];

export default function Home() {
  return (
    <Choreo>
      <Hero />

      {/* 01 — Approach: words fill in as you read, tiles float past */}
      <section id="about" className="relative px-4 py-40 sm:px-10 md:py-56">
        <div
          data-parallax="0.35"
          aria-hidden
          className="absolute left-4 top-56 hidden aspect-[3/4] w-[13vw] rounded-xl bg-gradient-to-br from-[#e9e7e1] to-[#cfc9bc] md:block sm:left-10"
        />
        <div
          data-parallax="-0.25"
          aria-hidden
          className="absolute bottom-16 right-4 hidden aspect-[4/5] w-[14vw] rounded-xl bg-gradient-to-br from-[#2a2a28] to-[#0e0e0e] md:block sm:right-10"
        />
        <p data-label className="label relative mb-10 text-center">[ 01 — Approach ]</p>
        <p
          data-scrub-words
          className="relative mx-auto max-w-5xl text-center text-4xl font-medium leading-[1.05] tracking-[-0.035em] sm:text-6xl md:text-[4.4vw]"
        >
          I trained as an architect before I moved to screens. Now I lead design
          for investing at Upstox, making first trades, risk and diversification
          feel calm.
        </p>
        <div data-fade className="relative mt-16 flex justify-center gap-10 label">
          <span>8 years in design</span>
          <span>Previously — Tata CLiQ</span>
        </div>
      </section>

      {/* 02 — What I do: heading pins on the left, disciplines scroll on the right */}
      <section className="grid gap-16 border-t border-line px-4 py-28 sm:px-10 md:grid-cols-6 md:gap-0">
        <div className="md:col-span-2">
          <div data-pin className="md:pr-10">
            <p data-label className="label mb-6">[ 02 — What I do ]</p>
            <h2 data-split="lines" className="text-6xl font-semibold leading-[0.9] tracking-[-0.05em] md:text-[6vw]">
              What I do
            </h2>
            <p data-fade className="mt-6 max-w-xs text-muted">
              Four disciplines, one goal: money decisions that feel clear.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-24 md:col-span-4 md:pl-3">
          {DISCIPLINES.map((d, i) => (
            <div key={d.title}>
              <p className="label mb-3">{String(i + 1).padStart(3, "0")} /</p>
              <h3 data-split="lines" className="text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
                {d.title}
              </h3>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[0, 1].map((k) => (
                  <div
                    key={k}
                    data-clip
                    className="aspect-[4/3] overflow-hidden rounded-xl"
                    style={{ background: `linear-gradient(${k ? 200 : 140}deg, ${d.tones[k]}, ${d.tones[1 - k]})` }}
                  />
                ))}
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <p data-fade className="max-w-md text-muted">{d.body}</p>
                <div data-fade data-delay="0.1" className="flex flex-wrap content-start gap-2">
                  {d.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — Selected work: giant title slides past, then the deck of covers */}
      <section id="work" className="bg-ink text-bg">
        <div className="overflow-hidden pb-10 pt-28">
          <p data-label className="label mb-8 px-4 !text-bg/60 sm:px-10">[ 03 — Selected work ]</p>
          <h2
            data-slide="-35"
            className="whitespace-nowrap pl-4 text-[18vw] font-semibold leading-[0.85] tracking-[-0.06em] sm:pl-10"
          >
            Selected work — Case studies —
          </h2>
        </div>
        <CaseStack cases={HOME_WORK} />
      </section>

      <Marquee items={["Investing UX", "Design systems", "Research", "Prototyping", "Motion", "Leadership"]} />

      <AiProjects />

      {/* 05 — Contact */}
      <section id="contact" className="border-t border-line px-4 py-40 text-center sm:px-10">
        <p data-label className="label mb-8">[ 05 — Open to lead &amp; senior IC roles ]</p>
        <Magnetic strength={0.25}>
          <a
            href="mailto:hello@example.com"
            data-cursor="Say hi"
            data-split="chars"
            className="block text-[16vw] font-semibold leading-[0.85] tracking-[-0.06em] sm:text-[11vw]"
          >
            Let&rsquo;s talk
          </a>
        </Magnetic>
        <div data-fade data-delay="0.3" className="mt-16 flex flex-wrap justify-center gap-4">
          <RollButton href="https://www.linkedin.com/" label="LinkedIn" />
          <RollButton href="/resume.pdf" label="Résumé" />
        </div>
      </section>
    </Choreo>
  );
}
