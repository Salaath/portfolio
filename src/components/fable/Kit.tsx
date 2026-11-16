// Shared, static pieces for case studies in the Fable template.

/**
 * A chapter opener: a large faint numeral with its label on the left, the title
 * and an optional lede on the right. Colours follow the surrounding text, so it
 * works on paper and on dark panels alike.
 */
export function ChapterHead({ n, label, title, children, className = "" }: { n: string; label: string; title: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-6 md:grid-cols-12 md:gap-8 ${className}`}>
      <div className="md:col-span-3">
        <span data-fade aria-hidden className="block text-[20vw] leading-[0.8] tracking-[-0.06em] opacity-[0.13] md:text-[7.5rem]">{n}</span>
        <p data-label className="mt-5 font-mono text-xs uppercase tracking-[0.12em] opacity-60">[ {label} ]</p>
      </div>
      <div className="min-w-0 md:col-span-9">
        <h2 data-split="lines" className="max-w-4xl text-4xl leading-[1.02] tracking-[-0.04em] md:text-[3.4rem]">{title}</h2>
        {children ? <div data-fade className="mt-6 max-w-2xl text-lg leading-relaxed opacity-65">{children}</div> : null}
      </div>
    </div>
  );
}

/** A statement that lights up word by word as it is read. */
export function Statement({ label, children, className = "" }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      {label ? <p data-label className="label mb-8">[ {label} ]</p> : null}
      <p data-scrub-words className="max-w-5xl text-3xl leading-[1.12] tracking-[-0.03em] md:text-[3.1vw]">{children}</p>
    </div>
  );
}
