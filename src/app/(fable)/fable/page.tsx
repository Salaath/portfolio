import Link from "next/link";
import { getCase, type CaseStudy } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { Magnetic } from "@/components/Magnetic";
import { RollButton } from "@/components/RollButton";
import { HomeHero } from "@/components/fable/HomeHero";
import { ShaderField } from "@/components/fable/ShaderField";
import { Spot } from "@/components/fable/Bits";
import { AskButton, Disciplines, Terminal, WorkCard, WorkFeature } from "@/components/fable/Sections";

// The Fable home page. Copy is carried over from the classic home page; the
// "Working with AI" section is new and marked as a draft.

const [AO, WATCHLIST, NPS, BEFORE] = ["account-opening", "watchlist-revised", "nps", "previous-work"].map(getCase) as CaseStudy[];

const PROOF = [
  ["2 min", "to open a demat account, down from 12"],
  ["5.2×", "more orders from the Watchlist"],
  ["~65%", "account opening conversion"],
  ["124", "NPS accounts in month one, with no marketing"],
];

// Draft copy for the disciplines: review before launch.
const DISCIPLINES = [
  { title: "Product design", body: "End-to-end flows for investing: onboarding, first trades, portfolios and the moments in between.", tags: ["Flows", "Interaction", "Prototyping", "Motion"] },
  { title: "Design systems", body: "Tokens, components and the rules that keep web, app and pro surfaces speaking one language.", tags: ["Tokens", "Components", "Documentation"] },
  { title: "Research & strategy", body: "Turning what people do, and what they fear, into the one bet the team should make next.", tags: ["Research", "Framing", "Metrics"] },
  { title: "Leading designers", body: "Hands-on lead: setting the bar for craft, reviewing closely, mentoring on ADPList.", tags: ["Critique", "Hiring", "Mentoring"] },
];

// Draft copy: review before launch.
const AI = [
  ["Prototypes that run", "The Account Opening and NPS prototypes on this site are code, not linked frames. Every path can be tapped through, including the ones where a fetch fails."],
  ["Tools made for the job", "One script renders a Figma file into screens. Another records a prototype and cuts the walkthrough into clips. I build them when the work needs them."],
  ["This site", "Designed by me and written with Claude Code: the pages, the motion, the charts, and the Ask box at the top."],
];

const TICKER = ["Investing UX", "Design systems", "Research", "Prototyping in code", "Motion", "Leadership"];

export default function FableHome() {
  return (
    <Choreo>
      <HomeHero />

      {/* proof: four numbers from the case studies */}
      <section className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {PROOF.map(([n, l], i) => (
          <div key={l} data-fade data-delay={i * 0.08} className={`flex flex-col gap-3 px-4 py-10 sm:px-10 ${i ? "md:border-l" : ""} ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} border-line`}>
            <b data-count className="text-5xl tabular-nums tracking-[-0.04em] md:text-[4.6vw]">{n}</b>
            <span className="max-w-[16rem] text-sm text-muted">{l}</span>
          </div>
        ))}
      </section>

      {/* 01 — selected work */}
      <section id="work" className="px-4 pb-32 pt-28 sm:px-10 md:pt-40">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p data-label className="label mb-6">[ 01 — Selected work ]</p>
            <h2 data-split="chars" className="text-[15vw] leading-[0.85] tracking-[-0.05em] md:text-[9vw]">Case studies</h2>
          </div>
          <p data-fade className="hidden max-w-xs pb-3 text-muted md:block">Four projects, each told from the problem to the numbers.</p>
        </div>

        <WorkFeature c={AO} href="/work/account-opening" index="01" />

        <div className="mt-16 grid gap-x-6 gap-y-16 md:mt-24 md:grid-cols-12">
          <div className="md:col-span-7">
            <WorkCard c={WATCHLIST} href="/work/watchlist-revised" index="02" focus="74%" />
          </div>
          <div className="md:col-span-5 md:mt-40">
            <WorkCard c={NPS} href="/work/nps" index="03" aspect="aspect-[4/5]" focus="54%" />
          </div>
          <div className="md:col-span-10 md:col-start-2">
            <WorkCard c={BEFORE} href="/work/previous-work" index="04" aspect="aspect-[4/3] md:aspect-[21/9]" focus="69%" />
          </div>
        </div>
      </section>

      {/* ticker */}
      <div aria-hidden className="overflow-hidden border-y border-line py-6">
        <div className="f-marquee flex w-max gap-12 whitespace-nowrap text-5xl tracking-[-0.03em] md:text-7xl">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-12">
              {t} <i className="size-3 rounded-full bg-[#a78bfa]" />
            </span>
          ))}
        </div>
      </div>

      {/* 02 — about */}
      <section id="about" className="relative px-4 py-40 sm:px-10 md:py-56">
        <p data-label className="label mb-10 text-center">[ 02 — Approach ]</p>
        <p data-scrub-words className="mx-auto max-w-5xl text-center text-4xl leading-[1.05] tracking-[-0.03em] sm:text-6xl md:text-[4.4vw]">
          I trained as an architect before I moved to screens. Now I lead design for investing at Upstox, making first trades, risk and diversification feel calm.
        </p>
        <div data-fade className="label mt-16 flex justify-center gap-10">
          <span>8 years in design</span>
          <span>Previously — Tata CLiQ</span>
        </div>
      </section>

      {/* 03 — working with AI */}
      <section id="ai" className="relative overflow-hidden border-t border-line px-4 py-28 sm:px-10 md:py-40">
        <div className="absolute inset-0 opacity-70">
          <ShaderField focus={[0.2, 0.75]} strength={0.7} />
        </div>
        <div className="relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <p data-label className="label mb-6">[ 03 — Working with AI ]</p>
            <h2 data-split="lines" className="text-5xl leading-[0.98] tracking-[-0.035em] md:text-[5vw]">I design in Figma and in code, with AI doing the typing.</h2>
            <p data-fade className="mt-8 max-w-lg text-lg text-muted">
              A prototype people can actually use tells me more than a frame they can look at. So I build them, and the tools around them, with Claude.
            </p>
            <div data-fade data-delay="0.1" className="mt-10 flex flex-col gap-3 text-lg">
              <AskButton q="How do you work with AI?">Ask the site how I work</AskButton>
              <Link href="/work/account-opening#prototype" className="group flex items-center gap-2 underline-offset-4 hover:underline">
                Try a coded prototype <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
          <div data-fade data-delay="0.15">
            <Terminal />
          </div>
        </div>
        <div className="relative mt-16 grid gap-4 md:grid-cols-3">
          {AI.map(([h, p], i) => (
            <div key={h} data-fade data-delay={i * 0.08}>
              <Spot className="h-full rounded-3xl bg-card/80 p-7 backdrop-blur-md md:p-9">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-10 text-2xl tracking-[-0.02em] md:text-3xl">{h}</h3>
                <p className="mt-4 text-muted">{p}</p>
              </Spot>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — what I do */}
      <section className="px-4 py-28 sm:px-10 md:py-40">
        <div className="mb-12 flex items-end justify-between gap-6">
          <p data-label className="label">[ 04 — What I do ]</p>
          <p data-fade className="max-w-xs text-right text-muted">Four disciplines, one goal: money decisions that feel clear.</p>
        </div>
        <Disciplines items={DISCIPLINES} />
      </section>

      {/* 05 — contact */}
      <section id="contact" className="relative overflow-hidden border-t border-line px-4 pb-8 pt-40 text-center sm:px-10">
        <div className="absolute inset-0">
          <ShaderField focus={[0.5, 0.2]} strength={0.9} />
        </div>
        <div className="relative">
          <p data-label className="label mb-8 !text-white/60">[ 05 — Open to lead &amp; senior IC roles ]</p>
          <Magnetic strength={0.2}>
            <a href="mailto:hello@example.com" data-cursor="Say hi" data-split="chars" className="block text-[19vw] leading-[0.85] tracking-[-0.05em] sm:text-[13vw]">
              Let&rsquo;s talk
            </a>
          </Magnetic>
          <div data-fade data-delay="0.3" className="mt-14 flex flex-wrap justify-center gap-4">
            <RollButton href="https://www.linkedin.com/" label="LinkedIn" />
            <RollButton href="/resume.pdf" label="Résumé" />
          </div>
          <div className="label mt-40 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 !text-white/50">
            <span>© 2026 Salaath Shaikh</span>
            <span>Designed by Sal · Built with Claude Code</span>
            <span>Mumbai, India</span>
          </div>
        </div>
      </section>
    </Choreo>
  );
}
