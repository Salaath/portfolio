"use client";

import { useState } from "react";

// One list, read four ways. Columns per trading style follow the Watchlist V2
// multi-column brief; Price and % change always lead and never move. Values are
// sample data, the same stocks the prototype uses.

type Style = "Old" | "Intraday" | "Options" | "Swing" | "Investor";

const STOCKS = [
  { s: "RELIANCE", p: "1,487.60", c: 0.64 },
  { s: "TATASTEEL", p: "171.62", c: 1.04 },
  { s: "HDFCBANK", p: "991.45", c: 0.54 },
  { s: "SUZLON", p: "58.36", c: -1.29 },
  { s: "IRFC", p: "128.45", c: 1.06 },
];

const COLS: Record<Exclude<Style, "Old">, { cols: string[]; rows: string[][]; tags: (string | null)[]; who: string }> = {
  Intraday: {
    who: "Watches the day: where price sits against VWAP, the day’s range and how much is trading.",
    cols: ["VWAP", "Day range", "Volume", "Bid / Ask"],
    rows: [
      ["1,482.10", "1,471–1,493", "8.2M", "1,487.5 / 1,487.7"],
      ["170.90", "168.4–172.3", "41.6M", "171.60 / 171.65"],
      ["989.30", "984–995", "12.1M", "991.40 / 991.50"],
      ["58.92", "57.9–59.8", "96.3M", "58.35 / 58.37"],
      ["127.80", "126.1–129.2", "38.4M", "128.40 / 128.50"],
    ],
    tags: ["Vol spike", null, null, "O=H", null],
  },
  Options: {
    who: "Trades derivatives: open interest, how it moved, the put-call ratio and implied volatility.",
    cols: ["OI", "OI chg", "PCR", "IV"],
    rows: [
      ["1.82 Cr", "+9.1%", "0.94", "18.2"],
      ["6.40 Cr", "+6.3%", "1.12", "27.6"],
      ["2.11 Cr", "−2.4%", "0.81", "16.9"],
      ["4.95 Cr", "+11.8%", "0.66", "41.3"],
      ["3.02 Cr", "+4.0%", "1.05", "33.0"],
    ],
    tags: ["Long buildup", "Long buildup", "Long unwinding", "OI spike", null],
  },
  Swing: {
    who: "Holds for days or weeks: recent returns, momentum and whether volume backs the move.",
    cols: ["1W", "1M", "RSI", "Volume"],
    rows: [
      ["+2.1%", "+5.8%", "61", "8.2M"],
      ["+4.6%", "+11.2%", "72", "41.6M"],
      ["−0.8%", "+1.9%", "48", "12.1M"],
      ["−3.9%", "−7.4%", "34", "96.3M"],
      ["+3.3%", "+6.1%", "66", "38.4M"],
    ],
    tags: [null, "Breakout", null, "RSI oversold", null],
  },
  Investor: {
    who: "Thinks in years: valuation, size, dividends and where price sits in its yearly range.",
    cols: ["PE", "Mkt cap", "Div yield", "52W range"],
    rows: [
      ["24.8", "₹20.1L Cr", "0.4%", "1,115–1,609"],
      ["38.2", "₹2.1L Cr", "2.1%", "122–185"],
      ["19.6", "₹15.2L Cr", "1.2%", "806–1,020"],
      ["71.4", "₹79K Cr", "—", "46–86"],
      ["25.9", "₹1.7L Cr", "1.2%", "108–166"],
    ],
    tags: [null, null, null, null, "Ex-div 14 Nov"],
  },
};

const STYLES: Style[] = ["Old", "Intraday", "Options", "Swing", "Investor"];

const tagTone = (t: string) =>
  /buildup|Breakout|Vol spike|OI spike/.test(t) ? "bg-[#E7F6EE] text-[#0E7A48]" : /unwinding|oversold|O=H/.test(t) ? "bg-[#FDECEA] text-[#B4321F]" : "bg-[#EFE9FA] text-[#5B2EBD]";

export function PersonaTable() {
  const [style, setStyle] = useState<Style>("Intraday");
  const conf = style === "Old" ? null : COLS[style];
  return (
    <div className="rounded-[1.5rem] bg-white shadow-[0_0_0_1px_rgba(42,27,61,0.04),0_24px_60px_-34px_rgba(42,27,61,0.32)] p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label">Read the same list as</p>
        <div role="tablist" className="flex flex-wrap gap-1 rounded-full bg-[#F3F3F1] p-1 text-sm">
          {STYLES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={style === s}
              onClick={() => setStyle(s)}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${style === s ? (s === "Old" ? "bg-[#d4d0c8] text-ink" : "bg-ink text-bg") : "text-muted hover:text-ink"}`}
            >
              {s === "Old" ? "The old list" : s}
            </button>
          ))}
        </div>
      </div>
      <p key={style + "who"} className="mt-4 min-h-[3rem] max-w-2xl text-[15px] text-muted [animation:wlIn_.5s_ease_both]">
        {conf ? conf.who : "Everyone saw the same two columns: symbol and price. Anything else meant opening the stock."}
      </p>

      <div className="mt-4 overflow-x-auto">
        <table key={style} className="w-full min-w-[640px] border-collapse text-left text-[14px] [animation:wlIn_.5s_ease_both]">
          <thead>
            <tr className="label border-b border-line">
              <th className="py-3 pr-4 font-medium">Scrip</th>
              <th className="py-3 pr-4 text-right font-medium">Price</th>
              {conf && <th className="py-3 pr-4 text-right font-medium">% chg</th>}
              {conf?.cols.map((c) => (
                <th key={c} className="py-3 pr-4 text-right font-medium text-[#5B2EBD]">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STOCKS.map((r, i) => {
              const tag = conf?.tags[i];
              return (
                <tr key={r.s} className="border-b border-line last:border-0">
                  <td className="py-3.5 pr-4">
                    <span className="flex items-center gap-2">
                      <b className="font-semibold">{r.s}</b>
                      {tag && <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${tagTone(tag)}`}>{tag}</span>}
                    </span>
                  </td>
                  <td className={`py-3.5 pr-4 text-right tabular-nums ${r.c >= 0 ? "text-[#14A363]" : "text-[#D93A2B]"}`}>
                    {r.p}
                    {!conf && <span className="block text-xs text-muted">{r.c >= 0 ? "+" : ""}{r.c.toFixed(2)}%</span>}
                  </td>
                  {conf && <td className={`py-3.5 pr-4 text-right tabular-nums ${r.c >= 0 ? "text-[#14A363]" : "text-[#D93A2B]"}`}>{r.c >= 0 ? "+" : ""}{r.c.toFixed(2)}%</td>}
                  {conf?.rows[i].map((v, k) => (
                    <td key={k} className="py-3.5 pr-4 text-right tabular-nums">{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">
        Sample values. Signals appear only on rows where they apply, and each signal category can be switched off.
      </p>
      <style>{`@keyframes wlIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){[class*="wlIn"]{animation:none!important}}`}</style>
    </div>
  );
}
