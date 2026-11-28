import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "../globals.css";
import { Smoother } from "@/components/Smoother";
import { Cursor } from "@/components/Cursor";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GridLines } from "@/components/GridLines";
import { StickyCta } from "@/components/StickyCta";
import { Preloader } from "@/components/Preloader";

const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://salaathshaikh.com"),
  title: "Salaath Shaikh — Product Designer",
  description:
    "Hands-on product design lead crafting trusted investing experiences at Upstox.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mono.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500&display=swap" />
      </head>
      <body className="antialiased">
        <noscript>
          <style>{`[data-split],[data-fade],[data-clip],[data-hidden]{visibility:visible}`}</style>
        </noscript>
        <GridLines />
        <Nav />
        <Cursor />
        <Smoother>{children}</Smoother>
        <StickyCta />
        <ScrollProgress />
        <Analytics />
        <Preloader />
      </body>
    </html>
  );
}
