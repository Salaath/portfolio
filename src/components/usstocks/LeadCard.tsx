import Link from "next/link";
import { HandScene } from "./HandScene";
import { HeldScene } from "@/components/ratings/HeldScene";
import { LoopVideo } from "@/components/ratings/LoopVideo";
import { LeadRail } from "./LeadRail";
import { DisplayScene } from "./DisplayScene";

// The home page entry for /leadership. It follows the "Built with AI" section:
// a headline, then the projects as mock-up tiles (US Stocks plays on the
// phone in a hand mock-up photo) with their
// words underneath. Two tiles side by side, one per project, each opening its
// part of the page. A project without `media` keeps an empty ground until its
// mock-up arrives.

const EASE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

type Project = {
  id: string;
  tag: string;
  title: string;
  line?: string;
  metrics?: [value: string, label: string][];
  ground: string;
  /** The dot beside the status. Green unless the work has not shipped. */
  dot?: string;
  /** A desktop screen: the tile runs the full width of the section. */
  wide?: boolean;
  /** "hand" maps the recording onto the phone in the hand photo; "film" is a recording that carries its own phone. */
  media?: { kind: "hand" | "film"; video: string; poster: string; label: string } | { kind: "held"; label: string } | { kind: "screen"; image: string; label: string };
};

const PROJECTS: Project[] = [
  {
    id: "us-stocks",
    tag: "Live on Upstox Pro",
    title: "US Stocks on Pro",
    line: "It was about to launch half in Pro and half in Invest. I made the case for one journey and we shipped it end to end in Pro.",
    metrics: [
      ["14.45K", "Orders placed in a month"],
    ],
    ground: "#ededed",
    media: { kind: "hand", video: "/work/us-stocks/flow.mp4", poster: "/work/us-stocks/flow-poster.jpg", label: "The opening of the US Stocks journey in Upstox Pro, playing on a phone held in a hand" },
  },
  {
    id: "in-app-ratings",
    tag: "Shipped on Upstox",
    title: "Right-time ratings",
    line: "A “Rate Upstox” sheet was popping up uninvited, badly timed and badly designed. It wasn’t on the roadmap, so I raised it, scoped it and got it shipped properly.",
    metrics: [
      ["28%", "Higher engagement with the sheet"],
      ["6", "Contextual nudges"],
    ],
    ground: "#c4c4c4",
    media: { kind: "held", label: "The new rating sheet appearing after an order is placed, on a phone held up in one hand" },
  },
  {
    id: "in-app-messages",
    tag: "In internal testing",
    dot: "#c98a00",
    title: "Fewer, better campaigns",
    line: "Every team sends its own banners, sheets and pop-ups, so customers are interrupted before they can act. I proposed one console to plan, approve and measure every in-app message.",
    metrics: [
      ["3", "Reviewers in one round"],
      ["5", "Roles, each with its own view"],
    ],
    ground: "#e4e4e4",
    wide: true,
    media: { kind: "screen", image: "/work/jarvis/console-home.webp", label: "The console’s home for a product manager, on a desktop display: their requests, who each one is waiting on and recent activity" },
  },
];

export function LeadProjects({ label = "[ Leading the team ]", className = "" }: { label?: string; className?: string }) {
  return (
    <section id="leading" className={className}>
      <LeadRail
        count={PROJECTS.length}
        header={
          <>
            <p data-label className="label mb-6">{label}</p>
            <h2 data-split="lines" className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-[6vw]">Initiatives I drove end to end</h2>
            <p data-fade className="mt-6 max-w-xl text-lg text-muted md:mt-8 md:text-xl">Three initiatives where I made the case and got product and engineering aligned behind a better experience.</p>
          </>
        }
      >
        {PROJECTS.map((p) => (
          <Link key={p.id} href={`/leadership#${p.id}`} data-cursor="Open" className="group block md:row-span-4 md:grid md:w-auto md:grid-rows-subgrid md:[transform-style:preserve-3d]">
            {/* the rail tilts this wrapper as the card moves across the window, so the row reads as a curved wall of screens */}
            <div data-curve className="md:[transform-origin:50%_50%] md:will-change-transform">
            <div data-wipe className={`relative overflow-hidden rounded-2xl md:rounded-[1.1rem] aspect-[4/5] sm:aspect-square md:aspect-auto md:h-[max(18rem,min(34vw,calc(100svh-23rem)))]`} style={{ background: p.ground }}>
              <div data-wipe-inner className="absolute inset-0 grid place-items-center">
                {p.media ? (
                  <div className={`absolute inset-0 transition-transform duration-[1.4s] ${EASE} group-hover:scale-[1.04]`}>
                    {p.media.kind === "screen" ? (
                      <DisplayScene image={p.media.image} label={p.media.label} />
                    ) : p.media.kind === "held" ? (
                      <HeldScene label={p.media.label} />
                    ) : p.media.kind === "hand" ? (
                      <HandScene video={p.media.video} poster={p.media.poster} label={p.media.label} />
                    ) : (
                      <LoopVideo src={p.media.video} poster={p.media.poster} label={p.media.label} className="absolute left-1/2 top-1/2 block aspect-[840/1720] h-[90%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                ) : (
                  <span className="rounded-md border border-dashed border-black/30 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-black/50">Mock-up to add</span>
                )}
              </div>
              {/* status, set as plain type on the ground */}
              <span className="absolute left-5 top-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-black/60 md:left-7 md:top-7">
                <i className="size-[6px] rounded-full" style={{ background: p.dot ?? "#1f9d55" }} />
                {p.tag}
              </span>
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-2.5 rounded-full bg-bg py-2 pl-4 pr-3 text-sm text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-bg md:bottom-5 md:right-5">
                View project <span aria-hidden className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
              </span>
            </div>
            </div>

            {/* title, line and numbers each sit in a row shared by all three cards, so they line up across the row */}
            <h3 data-split="lines" className="mt-6 text-4xl leading-[0.98] tracking-[-0.04em] md:text-[min(2.6vw,2.5rem)]">{p.title}</h3>
            <p data-fade data-delay="0.1" className="mt-4 text-lg leading-snug text-muted">{p.line}</p>
            <dl data-fade data-delay="0.16" className="mt-5 flex flex-wrap gap-x-10 gap-y-4 self-start border-t border-line pt-4 md:w-full">
              {(p.metrics ?? []).map(([v, l]) => (
                <div key={l}>
                  <dd className="whitespace-nowrap text-2xl tracking-[-0.03em] md:text-[min(2vw,2rem)] md:leading-none">{v}</dd>
                  <dt className="mt-2 text-sm text-muted">{l}</dt>
                </div>
              ))}
            </dl>
          </Link>
        ))}
      </LeadRail>
    </section>
  );
}
