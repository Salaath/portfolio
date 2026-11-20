import { RatingProto } from "./RatingProto";

// Project 02 on the leadership page: the in-app rating sheet. Copy is Sal's,
// from the brief of 20 Nov 2026 (problem, move, decision, outcome). The
// recordings come from the coded prototype (public/proto/in-app-rating); the
// "before" screens are Sal's screenshots of the old sheet.

const IMG = "/work/ratings";

/** The recordings sit on the prototype recorder's own backdrop, so the tile matches it. */
const GROUND = "linear-gradient(to bottom, #efecf0, #eae8ec)";

/** Every moment the sheet can appear, from the Touchpoints section of the Figma file. */
const NUDGES = [
  "Equity / F&O square off",
  "Funds added to wallet",
  "Equity order placed",
  "IPO allotted",
  "US Stocks: funds added",
  "US Stocks: order placed",
];

/** The six nudges by name, then one playing by itself and another as the prototype you can tap. */
export function RatingStage() {
  return (
    <div>
      <p data-label className="label">[ Six contextual nudges ]</p>
      <ol className="mt-6 grid grid-cols-2 gap-x-6 border-t border-ink sm:grid-cols-3 lg:grid-cols-6">
        {NUDGES.map((n, i) => (
          <li key={n} data-fade data-delay={i * 0.05} className="border-b border-line py-5 lg:border-b-0 lg:pr-4">
            <span className="block font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="mt-2 block text-lg leading-snug tracking-[-0.01em]">{n}</span>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-20">
        <figure data-fade className="m-0">
          <RatingProto ground={GROUND} mode="demo" />
          <figcaption className="mt-5 flex items-baseline gap-4 border-t border-line pt-4">
            <span className="font-mono text-xs text-muted">Autoplay</span>
            <span>
              <span className="block text-lg tracking-[-0.01em]">Equity order placed, five stars</span>
              <span className="mt-1 block text-muted">A high rating goes straight on to the store prompt.</span>
            </span>
          </figcaption>
        </figure>
        <figure data-fade data-delay="0.1" className="m-0">
          <RatingProto ground={GROUND} mode="live" />
          <figcaption className="mt-5 flex items-baseline gap-4 border-t border-line pt-4">
            <span className="font-mono text-xs text-muted">Prototype</span>
            <span>
              <span className="block text-lg tracking-[-0.01em]">Another nudge, your rating</span>
              <span className="mt-1 block text-muted">Tap a star. One to three stars asks what went wrong. Switch the nudge under the phone.</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

const BEFORE = [
  ["The sheet, over my Watchlist", "The old rating sheet covering the Watchlist tab: “Upstox app feedback. Let us know what you think”, five empty stars, Dismiss and Submit"],
  ["Three stars", "The old sheet with three stars selected: a list of radio options and a text box"],
  ["Five stars", "The old sheet with five stars selected and a small thank-you line"],
  ["The store prompt", "The old follow-up sheet: “Rate us on play store too?” with Maybe later and Yes"],
];

function Before() {
  return (
    <figure className="m-0">
      <figcaption className="label">The sheet before the revamp</figcaption>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:w-[85%] md:gap-x-8">
        {BEFORE.map(([cap, alt], i) => (
          <div key={cap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${IMG}/before-${i + 1}.webp`} alt={alt} width={720} height={1616} loading="lazy" className="block w-full rounded-[13%/5.8%] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_18px_40px_-22px_rgba(0,0,0,0.35)]" />
            <p className="mt-3 flex gap-3 text-sm text-muted">
              <span className="font-mono text-xs leading-5">{String(i + 1).padStart(2, "0")}</span>
              {cap}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

const Rows = ({ label, items, across }: { label: string; items: string[]; across?: boolean }) => (
  <div>
    <p className="label">{label}</p>
    <ol className={`mt-4 ${across ? "sm:grid sm:grid-cols-3 sm:gap-x-6" : ""}`}>
      {items.map((q, i) => (
        <li key={q} className={`flex items-baseline gap-4 border-t border-line py-3 ${across ? "max-sm:last:border-b" : "last:border-b"}`}>
          <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
          {q}
        </li>
      ))}
    </ol>
  </div>
);

/** The new sheet being rated one to five stars, on the full screen. */
const Rated = ({ className = "" }: { className?: string }) => (
  <figure className={`m-0 ${className}`}>
    {/* the prototype tapping one to five stars on a loop (public/proto/in-app-rating, "#stars-order") */}
    <iframe
      src="/proto/in-app-rating/index.html#stars-order"
      title="The rating sheet as one to five stars are tapped in turn: each rating shows a face on its star and a word under it, from Terrible to Excellent"
      loading="lazy"
      tabIndex={-1}
      className="pointer-events-none block aspect-[376/816] w-full border-0 bg-transparent"
    />
    <figcaption className="label mt-5">A face and a word with every rating</figcaption>
  </figure>
);

// `aside` sits in the left column under the section label (and after the text on phones).
// `split` keeps the first paragraph large and sets the rest side by side, smaller.
const SECTIONS: { id: string; label: string; body: string[]; extra?: React.ReactNode; wide?: boolean; aside?: (cls: string) => React.ReactNode; split?: boolean }[] = [
  {
    id: "ratings-problem",
    label: "The problem",
    body: ["I was on my Watchlist tab when a “Rate Upstox, how is your experience?” bottom sheet slid up. I had triggered nothing. It felt out of place: intrusive, unnecessary and badly designed. The font was hard to read. The spacing, the button and the CTA were all off."],
    extra: <Before />,
    wide: true,
  },
  {
    id: "ratings-move",
    label: "The move",
    body: ["This wasn’t on anyone’s roadmap. I raised it with the CX team and took ownership."],
    extra: (
      <Rows
        label="What I did, in order"
        items={[
          "Convinced the VP of product and the CX team head to pick up the project",
          "Asked CX for developer bandwidth",
          "Checked with the user research team for any data on the current rating sheet experience",
          "Scoped the task",
          "Found the right product manager and initiated the conversation",
          "Assigned a designer from my pod to take it up",
        ]}
      />
    ),
  },
  {
    id: "ratings-decision",
    label: "The decision",
    body: [
      "Together we defined the moments when the sheet should appear: after a successful order placement and after an IPO allotment. The copy turns contextual too. The work went on the PDT roadmap and task board across engineering, product and design.",
      "With the research team’s help, we pulled existing research that showed tier-2 city users could read 1 as the highest rating, rather than 5. To them, “number one is great”, which does the opposite of what the scale intends.",
      "So we didn’t rely only on tapping stars. We added emojis, because people understand emotion. We also added supporting text when someone taps any rating. That also makes the rating easier to understand for colourblind users.",
    ],
    extra: <Rows across label="Designed for" items={["Tier-1 and tier-2 city users", "Colourblind users", "The right moment to ask"]} />,
    aside: (cls) => <Rated className={cls} />,
    split: true,
  },
  {
    id: "ratings-outcome",
    label: "The outcome",
    body: ["Shipped with the new trigger points. The sheet now appears when there is something real to rate, so it no longer hampers the experience."],
  },
];

/** Four short sections: problem, move, decision, outcome. */
export function RatingStory() {
  return (
    <div>
      {SECTIONS.map((s, i) => (
        <article key={s.id} id={s.id} className="grid gap-x-16 border-t border-ink pb-16 pt-8 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:pb-28 lg:gap-x-24">
          <div>
            <p className="label flex gap-4 !text-ink">
              <span className="text-muted">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </p>
            {s.aside ? <div data-fade>{s.aside("mt-10 hidden w-[min(100%,15rem)] md:block")}</div> : null}
          </div>
          <div>
            {(s.split ? s.body.slice(0, 1) : s.body).map((p, k) => (
              <p key={k} data-fade className={`max-w-2xl text-[1.35rem] leading-[1.42] tracking-[-0.012em] md:text-[1.7rem] md:leading-[1.38] ${k ? "mt-6" : "mt-8 md:mt-0"}`}>{p}</p>
            ))}
            {s.split ? (
              <div className="mt-8 grid max-w-3xl gap-x-10 gap-y-6 sm:grid-cols-2 md:mt-10">
                {s.body.slice(1).map((p, k) => (
                  <p key={k} data-fade data-delay={k * 0.08} className="text-lg leading-[1.5] text-muted">{p}</p>
                ))}
              </div>
            ) : null}
            {s.extra && !s.wide ? <div data-fade className={`mt-12 ${s.split ? "max-w-3xl" : "max-w-2xl"}`}>{s.extra}</div> : null}
            {s.aside ? <div data-fade>{s.aside("mx-auto mt-12 w-[min(70%,15rem)] md:hidden")}</div> : null}
          </div>
          {/* a wide extra runs the full width of the story, under both columns */}
          {s.extra && s.wide ? <div data-fade className="mt-12 md:col-span-2 md:mt-16">{s.extra}</div> : null}
        </article>
      ))}
    </div>
  );
}
