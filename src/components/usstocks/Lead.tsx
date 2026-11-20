// Shared pieces of the "Projects I led this year" page: the facts row under
// each project title and the empty slots that hold a place for content that
// hasn't been written yet. Nothing here invents a name or a number.

export type Fact = [label: string, value: string | null];

/** Dashed marker for a detail Sal still has to supply. */
export function ToAdd({ children = "To add" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-dashed border-ink/30 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
      {children}
    </span>
  );
}

/** Role, team, product manager and so on, on one rule. A null value keeps its place. */
export function ProjectFacts({ facts, className = "" }: { facts: Fact[]; className?: string }) {
  return (
    <dl data-fade className={`grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink pt-6 md:grid-cols-4 ${className}`}>
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt className="label">{label}</dt>
          <dd className="mt-3 text-lg leading-snug tracking-[-0.01em]">{value ?? <ToAdd />}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The number, name and one-line summary that open a project. */
export function ProjectHead({ n, status, title, children }: { n: string; status?: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <div>
      <p data-fade className="label flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="!text-ink">Project {n}</span>
        {status}
      </p>
      <h2 data-split="lines" className="mt-8 max-w-[13ch] text-[13vw] leading-[0.94] tracking-[-0.04em] md:text-[min(7.4vw,7.6rem)]">{title}</h2>
      {children ? <div data-fade className="mt-10 max-w-2xl text-xl leading-snug tracking-[-0.01em] text-ink/75 md:text-2xl">{children}</div> : null}
    </div>
  );
}

/** An empty frame that holds the place of a video, prototype or picture. */
export function MediaSlot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`grid place-items-center rounded-[1.5rem] border border-dashed border-ink/25 ${className}`}>
      <ToAdd>{label}</ToAdd>
    </div>
  );
}
