// The detail page shared by Muse and Chapters. It is a motion showcase: every
// mock-up plays a short clip of the real app, shown four ways: a lead phone on
// a stage, three phones side by side, close crops and a phone turned in space.
import Link from "next/link";
import { Choreo } from "@/components/Choreo";
import { Crop, Phone, SceneMock, type Clip } from "./Phone";

type Motion = { name: string; body: string; clip: Clip };
type Close = { caption: string; clip: Clip; from: number; to: number };

export type Project = {
  title: string;
  kind: string;
  intro: string;
  meta: string[];
  demo: string;
  /** Colours taken from the app: the hero ground and the big word on it. */
  theme: { ground: string; word: string };
  hero: Clip;
  why: string;
  motions: { heading: string; body: string; items: Motion[] };
  close?: { heading: string; body: string; items: [Close, Close] };
  /** With `dark`, the closing phone is turned in space on that colour; without it, the clip plays in the meadow photo. */
  stage: { label: string; heading: string; body: string; note?: string; clip: Clip; dark?: { bg: string; ink: string; muted: string } };
  next: { title: string; href: string };
};

function Demo({ href, title, invert = false }: { href: string; title: string; invert?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="Open"
      className={`group inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-5 text-sm transition-transform duration-500 hover:scale-[1.04] ${invert ? "bg-white text-black" : "bg-ink text-bg"}`}
    >
      Open the {title} web demo <span aria-hidden className="transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
    </a>
  );
}

export function ProjectPage({ p }: { p: Project }) {
  const t = p.theme;
  return (
    <Choreo className="paper white">
      <main className="pb-24">
        {/* 1. the lead phone on a stage in the app's own colour */}
        <section className="px-3 pt-3">
          <div className="relative overflow-hidden rounded-[2rem] px-5 pb-10 pt-28 md:min-h-[calc(100svh-1.5rem)] md:rounded-[2.75rem] md:px-12 md:pb-12 md:pt-32" style={{ background: t.ground }}>
            <p aria-hidden className="pointer-events-none absolute inset-x-0 top-[16%] hidden select-none text-center text-[27vw] leading-none tracking-[-0.06em] md:block" style={{ color: t.word }}>
              {p.title}
            </p>
            <div className="relative grid items-end gap-12 md:min-h-[calc(100svh-13rem)] md:grid-cols-[1fr_auto_1fr]">
              <div className="md:pb-4">
                <p data-fade className="label">Built with AI · {p.kind}</p>
                <h1 data-split="lines" className="mt-5 text-6xl leading-[0.9] tracking-[-0.05em] md:text-[5.2vw]">{p.title}</h1>
                <p data-fade data-delay="0.1" className="mt-6 max-w-sm text-lg leading-snug">{p.intro}</p>
                <div data-fade data-delay="0.18" className="mt-8">
                  <Demo href={p.demo} title={p.title} />
                </div>
              </div>
              <div data-fade data-delay="0.1" className="mx-auto w-[min(290px,78vw)] md:w-[min(330px,24vw)]">
                <Phone clip={p.hero} />
              </div>
              <ul data-fade data-delay="0.2" className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.14em] md:items-end md:pb-4 md:text-right">
                {p.meta.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2. why it exists, in one line */}
        <section className="mx-auto max-w-5xl px-5 py-32 text-center md:py-48">
          <p data-label className="label mb-8">Why I made it</p>
          <p data-scrub-words className="text-3xl leading-[1.1] tracking-[-0.03em] md:text-[3.4vw]">{p.why}</p>
        </section>

        {/* 3. three motions, side by side */}
        <section className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
            <h2 data-split="lines" className="text-5xl leading-[0.95] tracking-[-0.04em] md:text-[5vw]">{p.motions.heading}</h2>
            <p data-fade className="max-w-md self-end text-lg leading-snug text-muted md:justify-self-end">{p.motions.body}</p>
          </div>
          <div className={`mt-20 grid gap-20 md:mt-32 md:gap-8 ${p.motions.items.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3 md:gap-10"}`}>
            {p.motions.items.map((m, i) => (
              // staggered heights: every second phone sits higher than its neighbours
              <article key={m.name} className={i % 2 ? "md:-mt-16" : "md:mt-4"}>
                <div data-fade data-delay={(i * 0.1).toFixed(2)}>
                  <Phone clip={m.clip} className="mx-auto w-[min(290px,78vw)] md:w-[min(320px,90%)]" />
                </div>
                <div data-fade className="mx-auto mt-10 max-w-[320px]">
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  <h3 className="mt-2 text-3xl tracking-[-0.03em]">{m.name}</h3>
                  <p className="mt-3 text-[15px] leading-snug text-muted">{m.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. the same clips, cropped in on the part that moves */}
        {p.close && (
        <section className="mx-auto mt-32 max-w-[1400px] px-5 md:mt-56 md:px-10">
          <div className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
            <h2 data-split="lines" className="text-5xl leading-[0.95] tracking-[-0.04em] md:text-[5vw]">{p.close.heading}</h2>
            <p data-fade className="max-w-md self-end text-lg leading-snug text-muted md:justify-self-end">{p.close.body}</p>
          </div>
          <div className="mt-14 grid items-start gap-5 md:grid-cols-2">
            {p.close.items.map((c, i) => (
              <figure key={c.caption} data-fade data-delay={(i * 0.1).toFixed(2)} className={i ? "md:mt-24" : ""}>
                <Crop clip={c.clip} from={c.from} to={c.to} className="rounded-[1.75rem] md:rounded-[2.25rem]" />
                <figcaption className="mt-4 flex gap-3 text-[15px] text-muted">
                  <span className="font-mono text-xs leading-[1.6]">0{i + 1}</span>
                  {c.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        )}

        {/* 5. the closing mock-up: the clip playing on the phone in a photo, or a
            phone turned in space on the app's dark colour */}
        {p.stage.dark ? (
        <section className="mt-32 px-3 md:mt-56">
          <div className="grid items-center gap-16 overflow-hidden rounded-[2rem] px-6 py-20 md:grid-cols-2 md:rounded-[2.75rem] md:px-20 md:py-28" style={{ background: p.stage.dark.bg, color: p.stage.dark.ink }}>
            <div>
              <p data-fade className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: p.stage.dark.muted }}>{p.stage.label}</p>
              <h2 data-split="lines" className="mt-6 text-5xl leading-[0.95] tracking-[-0.04em] md:text-[4.6vw]">{p.stage.heading}</h2>
              <p data-fade data-delay="0.1" className="mt-6 max-w-md text-lg leading-snug" style={{ color: p.stage.dark.muted }}>{p.stage.body}</p>
              {p.stage.note && <p data-fade data-delay="0.16" className="mt-6 max-w-md border-t border-white/20 pt-6 text-sm" style={{ color: p.stage.dark.muted }}>{p.stage.note}</p>}
              <div data-fade data-delay="0.2" className="mt-10">
                <Demo href={p.demo} title={p.title} invert />
              </div>
            </div>
            <div data-parallax="0.06" className="mx-auto w-[min(250px,62vw)] py-6 md:w-[min(330px,70%)]">
              <Phone clip={p.stage.clip} tilt="rotateY(-24deg) rotateX(12deg) rotateZ(7deg)" edge="#2a2a2c" />
            </div>
          </div>
        </section>
        ) : (
        <section className="mx-auto mt-32 max-w-[1400px] px-5 md:mt-56 md:px-10">
          <div className="grid gap-6 border-t border-line pt-10 md:grid-cols-2">
            <div>
              <p data-fade className="label mb-6">{p.stage.label}</p>
              <h2 data-split="lines" className="text-5xl leading-[0.95] tracking-[-0.04em] md:text-[4.6vw]">{p.stage.heading}</h2>
            </div>
            <div className="max-w-md self-end md:justify-self-end">
              <p data-fade className="text-lg leading-snug text-muted">{p.stage.body}</p>
              {p.stage.note && <p data-fade data-delay="0.08" className="mt-5 border-t border-line pt-5 text-sm text-muted">{p.stage.note}</p>}
              <div data-fade data-delay="0.14" className="mt-8">
                <Demo href={p.demo} title={p.title} />
              </div>
            </div>
          </div>
          <div data-fade className="mt-14">
            <SceneMock clip={p.stage.clip} className="aspect-[4/5] rounded-[1.75rem] md:aspect-[16/9] md:rounded-[2.75rem]" />
          </div>
        </section>
        )}

        {/* next */}
        <Link href={p.next.href} data-cursor="Open" className="group mx-auto mt-24 flex max-w-[1400px] items-end justify-between gap-6 px-5 md:mt-32 md:px-10">
          <span className="label pb-3">Next project</span>
          <span className="flex items-center gap-4 text-6xl tracking-[-0.05em] md:text-[9vw]">
            {p.next.title} <span aria-hidden className="text-[0.5em] transition-transform duration-500 group-hover:translate-x-3">→</span>
          </span>
        </Link>
      </main>
    </Choreo>
  );
}
