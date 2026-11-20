import type { Metadata } from "next";
import Link from "next/link";
import { Choreo } from "@/components/Choreo";
import { GuideStage } from "@/components/onboarding/GuideStage";

// The design onboarding guide, as a short page: why Sal wrote it, then the guide
// itself playing on a laptop. The copy is Sal's note of 20 Nov 2026, kept close to his
// own words. No process section. The site header title stays "Design Lead".

const DESCRIPTION = "The onboarding guide I wrote for designers joining Upstox, so nobody has to onboard themselves.";
const GUIDE = "/ai/upstox-design-onboarding.html";

export const metadata: Metadata = {
  title: "Onboarding guide for new joiners — Salaath Shaikh",
  description: DESCRIPTION,
  openGraph: { title: "Onboarding guide for new joiners", description: DESCRIPTION, type: "article" },
};

const INSIDE: { n: string; title: string; items: string[]; ground: string; tilt: string }[] = [
  { n: "01", title: "The processes we follow", items: ["How to create a file", "How to raise tickets", "How to ask for software"], ground: "#f6f3c0", tilt: "md:-rotate-2" },
  { n: "02", title: "Who to talk to", items: ["Who to talk to when you are stuck on different things", "Which designers have which expertise", "Who to reach out to"], ground: "#ffd9e6", tilt: "md:rotate-1 md:translate-y-10" },
  { n: "03", title: "Reviews", items: ["The levels of reviews that are required"], ground: "#cfe9ff", tilt: "md:-rotate-1" },
];

function OpenGuide() {
  return (
    <a href={GUIDE} target="_blank" rel="noreferrer" data-cursor="Open" className={`group inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-5 text-sm transition-transform duration-500 hover:scale-[1.04] bg-ink text-bg`}>
      Open design guide <span aria-hidden className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
    </a>
  );
}

export default function OnboardingGuidePage() {
  return (
    <Choreo className="paper white">
      <main className="pb-24">
        {/* the title on a grainy purple sky */}
        <section className="px-3 pt-3">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#9d8bf0] px-5 pb-10 pt-32 md:rounded-[2.75rem] md:px-12 md:pb-14 md:pt-44">
            {/* a grainy sky in the guide's purple: drawn clouds, with film grain baked in */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/ai/onboarding-sky.webp" alt="" aria-hidden width={2400} height={1500} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
            <div className="relative">
            <p data-fade data-load className="label !text-ink">Built with AI · Microsite · Upstox</p>
            <h1 data-split="lines" data-load className="mt-6 max-w-[12ch] text-[15vw] leading-[0.9] tracking-[-0.05em] md:text-[9.4vw]">Onboarding guide for new joiners</h1>
            <div data-fade data-load data-delay="0.15" className="mt-10 flex flex-wrap items-end justify-between gap-8 md:mt-16">
              <OpenGuide />
              <ul className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.14em] md:items-end md:text-right">
                <li>Upstox design team</li>
                <li>Designed and shipped in Claude Design</li>
                <li>HTML</li>
              </ul>
            </div>
            </div>
          </div>
        </section>

        {/* 1. why I made it */}
        <section className="mx-auto max-w-[1400px] px-5 pt-28 md:px-10 md:pt-44">
          <p data-label className="label mb-8">Why I made it</p>
          <p data-scrub-words className="max-w-[22ch] text-[9vw] leading-[1.02] tracking-[-0.04em] md:text-[5.2vw]">
            Upstox was adding a lot of designers and things move fast. There was no set process and no real onboarding.
          </p>
        </section>

        {/* the running joke, as the loud part of the page */}
        <section className="mt-24 px-3 md:mt-40">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#f8620b] px-5 py-20 text-[#111] md:rounded-[2.75rem] md:px-12 md:py-32">
            <p data-fade className="inline-block -rotate-3 rounded-full bg-[#111] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white">The running joke in the team</p>
            <p data-split="lines" className="mt-10 max-w-[18ch] text-[10vw] leading-[0.95] tracking-[-0.045em] text-white md:text-[6.4vw]">
              “At Upstox, whoever joins has to onboard themselves.”
            </p>
            <p data-fade data-delay="0.1" className="mt-10 max-w-md text-xl leading-snug text-white md:ml-auto md:mt-14 md:text-2xl">
              At other companies people usually spend a week in onboarding.
            </p>
          </div>
        </section>

        {/* what I did about it, and what is inside */}
        <section className="mx-auto max-w-[1400px] px-5 pt-28 md:px-10 md:pt-44">
          <p data-scrub-words className="mx-auto max-w-[20ch] text-center text-[9vw] leading-[1.02] tracking-[-0.04em] md:text-[5.2vw]">
            So I took it upon myself and wrote the onboarding guide for anyone new to the team.
          </p>

          <p data-label className="label mt-24 md:mt-40">What it covers</p>
          <ul className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6 md:pb-10">
            {INSIDE.map((c, i) => (
              <li key={c.n} data-fade data-delay={i * 0.08} className={`flex min-h-[19rem] flex-col rounded-[1.75rem] p-7 text-[#111] transition-transform duration-500 hover:!rotate-0 md:min-h-[24rem] md:rounded-[2.25rem] md:p-9 ${c.tilt}`} style={{ background: c.ground }}>
                <span className="font-mono text-xs">{c.n}</span>
                <h2 className="mt-4 text-4xl leading-[0.95] tracking-[-0.04em] md:text-[3.1vw]">{c.title}</h2>
                <ul className="mt-auto flex flex-col pt-10">
                  {c.items.map((it) => (
                    <li key={it} className="border-t border-black/15 py-3 text-lg leading-snug">{it}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <p data-fade className="mt-20 max-w-3xl text-2xl leading-[1.25] tracking-[-0.02em] md:ml-auto md:mt-32 md:text-[2.2vw]">
            Anyone new, who does not know how to operate or where to start, can keep coming back to it to find the resources the team uses.
          </p>
        </section>

        {/* 2. the guide itself, playing on a laptop */}
        <section className="mt-24 px-3 md:mt-40">
          <GuideStage href={GUIDE} />
        </section>

        {/* next */}
        <Link href="/work/chapters" data-cursor="Open" className="group mx-auto mt-24 flex max-w-[1400px] items-end justify-between gap-6 px-5 md:mt-32 md:px-10">
          <span className="label pb-3">Next project</span>
          <span className="flex items-center gap-4 text-6xl tracking-[-0.05em] md:text-[9vw]">
            Chapters <span aria-hidden className="text-[0.5em] transition-transform duration-500 group-hover:translate-x-3">→</span>
          </span>
        </Link>
      </main>
    </Choreo>
  );
}
