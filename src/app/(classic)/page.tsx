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
          Building with AI made me more protective of craft, not less. When anyone
          can ship, execution isn&rsquo;t the moat, the idea is. I lead design for
          investing at Upstox, where the goal is simple: make first trades, risk
          and diversification feel calm and cared for.
        </p>
        <div data-fade className="relative mt-16 flex justify-center gap-10 label">
          <span>8 years in design</span>
          <span>Previously — Tata CLiQ</span>
        </div>
      </section>

      {/* 02 — Selected work: giant title slides past, then the deck of covers */}
      <section id="work" className="bg-ink text-bg">
        <div className="overflow-hidden pb-10 pt-28">
          <p data-label className="label mb-8 px-4 !text-bg/60 sm:px-10">[ 02 — Selected work ]</p>
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

      {/* 04 — Contact */}
      <section id="contact" className="border-t border-line px-4 py-40 text-center sm:px-10">
        <p data-label className="label mb-8">[ 04 — Open to lead &amp; senior IC roles ]</p>
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
          <RollButton href="/about" label="Résumé" />
        </div>
      </section>
    </Choreo>
  );
}
