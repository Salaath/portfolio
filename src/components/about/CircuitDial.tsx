import { TRACK } from "./circuit";

// The circuit as it is drawn on a race poster: inside a circle, over a square grid, with
// cross-hairs, a start line and the three sectors marked. One car, a dot, goes round it
// (a dash on the track's own path, moved by .circuit-car in globals.css).

const S = 600;
/** Fine grid lines, every 40 units. */
const GRID = Array.from({ length: 14 }, (_, i) => 40 + i * 40);

export function CircuitDial({ className = "" }: { className?: string }) {
  const label = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11, letterSpacing: "0.14em", fill: "#f4f2ec" } as const;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label="A race circuit drawn inside a circle over a grid, with a car lapping it" className={`circuit block h-auto ${className}`}>
      <g stroke="#f4f2ec" fill="none">
        <g strokeOpacity="0.13" strokeWidth="0.6">
          {GRID.map((v) => (
            <path key={v} d={`M${v} 0V${S}M0 ${v}H${S}`} />
          ))}
        </g>
        <circle cx={S / 2} cy={S / 2} r="278" strokeOpacity="0.55" strokeWidth="1" />
        <path d={`M${S / 2} 0V${S}M0 ${S / 2}H${S}`} strokeOpacity="0.32" strokeWidth="0.8" strokeDasharray="2 5" />
        {/* registration ticks at the four corners */}
        <path d={`M0 14V0H14M${S - 14} 0H${S}V14M${S} ${S - 14}V${S}H${S - 14}M14 ${S}H0V${S - 14}`} strokeOpacity="0.7" strokeWidth="1.2" />
      </g>
      {/* the circuit, scaled to sit inside the circle */}
      <g transform={`translate(${S / 2} ${S / 2}) scale(0.78) translate(-490 -280)`}>
        <path d={TRACK} fill="none" stroke="#111111" strokeWidth="16" strokeLinejoin="round" />
        <path d={TRACK} fill="none" stroke="#f4f2ec" strokeWidth="5" strokeLinejoin="round" />
        <path d={TRACK} pathLength={1000} fill="none" stroke="#111111" strokeWidth="19" strokeLinecap="round" strokeDasharray="0.01 999.99" className="circuit-car" />
        <path d={TRACK} pathLength={1000} fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeDasharray="0.01 999.99" className="circuit-car" />
      </g>
      <g style={label} fillOpacity="0.62">
        <text x="92" y="158">SECTOR 1</text>
        <text x="418" y="196">SECTOR 2</text>
        <text x="300" y="474" textAnchor="middle">SECTOR 3</text>
      </g>
    </svg>
  );
}
