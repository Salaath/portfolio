import Link from "next/link";
import { notFound } from "next/navigation";
import { cases, getCase } from "@/content/cases";
import { Choreo } from "@/components/Choreo";
import { CaseHero } from "@/components/CaseHero";

export function generateStaticParams() {
  // these have their own static routes
  return cases.filter((c) => !["account-opening", "nps", "personal-loans", "watchlist", "watchlist-revised", "previous-work"].includes(c.slug)).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const study = getCase((await params).slug);
  return { title: study ? `${study.title} — Salaath Shaikh` : "Not found" };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCase(slug);
  if (!study) notFound();

  const i = cases.indexOf(study);
  const next = cases[(i + 1) % cases.length];

  return (
    <Choreo>
      <header className="px-4 pb-14 pt-36 sm:px-10">
        <div data-fade data-load className="mb-6 flex flex-wrap gap-2">
          {study.tags.map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
        <h1
          data-split="words"
          data-load
          data-delay="0.1"
          className="max-w-5xl font-serif text-[12vw] leading-[0.95] sm:text-[6vw]"
        >
          {study.title}
        </h1>
        <p data-split="lines" data-load data-delay="0.5" className="mt-6 max-w-2xl text-xl text-muted">
          {study.tagline}
        </p>
      </header>

      <CaseHero cover={study.cover} />

      {/* TL;DR */}
      <section className="grid gap-8 border-b border-line px-4 py-16 sm:grid-cols-4 sm:px-10">
        {[
          ["Role", study.role],
          ["Team", study.team],
          ["Year", study.year],
        ].map(([k, v], idx) => (
          <div key={k} data-fade data-delay={idx * 0.08}>
            <p className="text-sm text-muted">{k}</p>
            <p className="mt-1">{v}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-px bg-line sm:grid-cols-3">
        {study.metrics.map((m, idx) => (
          <div key={m.label} className="bg-bg px-4 py-14 sm:px-10">
            <p data-split="chars" data-delay={idx * 0.1} className="font-serif text-7xl text-accent">
              {m.value}
            </p>
            <p data-fade data-delay={0.2 + idx * 0.1} className="mt-2 text-muted">
              {m.label}
            </p>
          </div>
        ))}
      </section>

      {/* Story */}
      <article className="px-4 py-24 sm:px-10">
        {study.sections.map((s) => (
          <section key={s.heading} className="grid gap-6 border-t border-line py-16 sm:grid-cols-[1fr_2fr]">
            <h2 data-pin className="self-start font-serif text-4xl">
              <span data-split="words" className="block">
                {s.heading}
              </span>
            </h2>
            <div>
              <p data-split="lines" className="text-xl leading-relaxed">
                {s.body}
              </p>
              <div
                data-clip
                className="mt-10 flex aspect-video items-center justify-center rounded-2xl bg-card text-sm text-muted"
              >
                Visual / prototype / video goes here
              </div>
            </div>
          </section>
        ))}
      </article>

      {/* Next case */}
      <Link
        href={`/work/${next.slug}`}
        data-cursor="Next"
        className="group block border-t border-line px-4 py-28 sm:px-10"
      >
        <p data-fade className="text-sm text-muted">
          Next case study
        </p>
        <p className="mt-4 font-serif text-[10vw] leading-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-6 sm:text-[6vw]">
          <span data-split="words" className="block">
            {next.title} →
          </span>
        </p>
      </Link>
    </Choreo>
  );
}
