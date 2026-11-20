import { EMAIL, LINKEDIN_URL, MAILTO, PHONE, RESUME_PDF, TEL } from "@/content/links";
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
import { LeadProjects } from "@/components/usstocks/LeadCard";
import { AiProjects } from "@/components/AiProjects";
import { Magnetic } from "@/components/Magnetic";
import { RollButton } from "@/components/RollButton";

export default function Home() {
  return (
    <Choreo>
      <Hero />

      {/* 01 — Approach: words fill in as you read, tiles float past */}
      <section id="about" className="relative px-4 py-40 sm:px-10 md:py-56">
        {/* Sal at work on a painted piece, in black and white like the rest of the page */}
        <div
          data-parallax="0.35"
          className="absolute left-4 top-56 hidden aspect-[3/4] w-[12.5vw] overflow-hidden rounded-xl bg-[#e9e7e1] md:block sm:left-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/about/sal-making.webp" alt="Salaath painting a green zigzag pattern on a black surface" width={720} height={960} className="block h-full w-full object-cover" />
        </div>
        {/* the opening of Chapters: Sal's own screen recording, cropped to the turning fan of book covers */}
        <div
          data-parallax="-0.25"
          className="absolute bottom-16 right-4 hidden aspect-[4/5] w-[12.5vw] overflow-hidden rounded-xl bg-[#efeee9] md:block sm:right-10"
        >
          <video
            src="/work/ai/chapters-open-home.mp4"
            poster="/work/ai/chapters-open-home.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="The Chapters app opening: a fan of book covers turning"
            className="block h-full w-full object-cover object-[50%_46%]"
          />
        </div>
        <p data-label className="label relative mb-10 text-center">[ 01 — Approach ]</p>
        <p
          data-scrub-words
          className="relative mx-auto max-w-5xl text-center md:max-w-[calc(75vw-128px)] text-[1.8rem] font-medium leading-[1.16] tracking-[-0.035em] sm:text-[3rem] md:text-[3.4vw]"
        >
          Building with AI has made me care about craft even more. It&rsquo;s easier
          than ever to build something, but making something genuinely useful
          still takes thought, judgement and care. I lead design for investing at
          Upstox, making everything from first trades to risk and diversification
          feel a little less intimidating.
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

      {/* 03 — Leading the team: two projects as mock-up tiles, opening /leadership */}
      <LeadProjects label="[ 03 — Leading the team ]" className="px-4 pb-32 pt-28 sm:px-10 md:pb-40 md:pt-40" />

      <Marquee items={["Investing UX", "Design systems", "Research", "Prototyping", "Motion", "Leadership"]} />

      <AiProjects />

      {/* 05 — Contact */}
      <section id="contact" className="border-t border-line px-4 py-40 text-center sm:px-10">
        <p data-label className="label mb-8">[ 05 — Open to lead &amp; senior IC roles ]</p>
        <Magnetic strength={0.25}>
          <a
            href={MAILTO}
            data-cursor="Say hi"
            data-split="chars"
            className="block text-[16vw] font-semibold leading-[0.85] tracking-[-0.06em] sm:text-[11vw]"
          >
            Let&rsquo;s talk
          </a>
        </Magnetic>
        <div data-fade data-delay="0.3" className="mt-16 flex flex-wrap justify-center gap-4">
          <RollButton href={LINKEDIN_URL} newTab label="LinkedIn" />
          <RollButton href={RESUME_PDF} newTab label="Résumé" />
        </div>
        {/* phone and email, always in view rather than behind a click */}
        <dl data-fade data-delay="0.4" className="mx-auto mt-16 grid max-w-3xl gap-8 border-t border-line pt-10 sm:grid-cols-3">
          <div>
            <dt className="label mb-2">Contact</dt>
            <dd><a href={TEL} className="text-lg font-medium tracking-[-0.01em] hover:opacity-60">{PHONE}</a></dd>
          </div>
          <div>
            <dt className="label mb-2">Email</dt>
            <dd><a href={MAILTO} className="break-all text-lg font-medium tracking-[-0.01em] hover:opacity-60">{EMAIL}</a></dd>
          </div>
          <div>
            <dt className="label mb-2">Based in</dt>
            <dd className="text-lg font-medium tracking-[-0.01em]">Mumbai, India</dd>
          </div>
        </dl>
      </section>
    </Choreo>
  );
}
