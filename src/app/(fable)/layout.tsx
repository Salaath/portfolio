import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "../globals.css";
import "../fable.css";
import { Cursor } from "@/components/Cursor";
import { Shell } from "@/components/fable/Shell";
import { FNav } from "@/components/fable/FNav";
import { Ask } from "@/components/fable/Ask";
import { Curtain } from "@/components/fable/Curtain";

// The Fable template: a second root layout, so the classic site in (classic)
// keeps its own shell untouched. Everything here lives under /fable.

const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salaath Shaikh — Product Designer",
  description: "Hands-on product design lead crafting trusted investing experiences at Upstox.",
};

export default function FableLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mono.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500&display=swap" />
      </head>
      <body className="fable antialiased">
        <noscript>
          <style>{`[data-split],[data-fade],[data-clip],[data-hidden]{visibility:visible}`}</style>
        </noscript>
        <Shell />
        <FNav />
        <Cursor />
        {children}
        <Ask />
        <Curtain />
        <div aria-hidden className="f-grain" />
      </body>
    </html>
  );
}
