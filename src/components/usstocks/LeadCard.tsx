import Link from "next/link";
import { HandScene } from "./HandScene";
import { HeldScene } from "@/components/ratings/HeldScene";
import { LoopVideo } from "@/components/ratings/LoopVideo";

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
    ground: "linear-gradient(to bottom, #dfe8f1, #edf1f4)",
    wide: true,
    media: { kind: "screen", image: "/work/jarvis/console-home.webp", label: "The console’s home for a product manager: their requests, who each one is waiting on and recent activity" },
  },
];

export function LeadProjects({ label = "[ Leading the team ]", className = "" }: { label?: string; className?: string }) {
  return (
    <section id="leading" className={className}>
      <div className="mb-14 md:mb-20">
        <p data-label className="label mb-6">{label}</p>
        <h2 data-split="lines" className="text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-[6vw]">Initiatives I drove end to end</h2>
        <p data-fade className="mt-6 max-w-xl text-lg text-muted md:mt-8 md:text-xl">Three initiatives where I made the case and got product and engineering aligned behind a better experience.</p>
      </div>

      <div className="grid gap-x-6 gap-y-20 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <Link key={p.id} href={`/leadership#${p.id}`} data-cursor="Open" className={`group block ${p.wide ? "md:col-span-2" : ""}`}>
            <div data-wipe className={`relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] ${p.wide ? "aspect-[4/3] md:aspect-[2/1]" : "aspect-[4/5] sm:aspect-square"}`} style={{ background: p.ground }}>
              <div data-wipe-inner className="absolute inset-0 grid place-items-center">
                {p.media ? (
                  <div className={`absolute inset-0 transition-transform duration-[1.4s] ${EASE} group-hover:scale-[1.04]`}>
                    {p.media.kind === "screen" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.media.image} alt={p.media.label} width={2040} height={1275} loading="lazy" className="absolute left-1/2 top-[54%] block h-auto max-h-[80%] w-auto max-w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[0.5rem] shadow-[0_0_0_1px_rgba(15,30,60,0.08),0_40px_80px_-40px_rgba(15,40,90,0.45)] md:rounded-[1rem]" />
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
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-6 md:mt-10 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <span data-fade className="label block">({String(i + 1).padStart(2, "0")}) — {String(PROJECTS.length).padStart(2, "0")}</span>
                <h3 data-split="lines" className="mt-5 text-4xl leading-[0.98] tracking-[-0.04em] md:text-[3.4vw]">{p.title}</h3>
                {p.line ? <p data-fade data-delay="0.1" className="mt-5 max-w-md text-lg leading-snug text-muted">{p.line}</p> : null}
                {p.metrics ? (
                  <dl data-fade data-delay="0.16" className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
                    {p.metrics.map(([v, l]) => (
                      <div key={l}>
                        <dd className="whitespace-nowrap text-2xl tracking-[-0.03em] md:text-[2vw] md:leading-none">{v}</dd>
                        <dt className="mt-2 text-sm text-muted">{l}</dt>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
              <span data-fade data-delay="0.22" className="inline-flex items-center gap-3 justify-self-start rounded-full border border-ink/25 py-2.5 pl-5 pr-4 text-sm transition-colors duration-500 group-hover:bg-ink group-hover:text-bg md:mt-9">
                View project <span aria-hidden className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
