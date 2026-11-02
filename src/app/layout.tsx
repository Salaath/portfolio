import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Smoother } from "@/components/Smoother";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GridLines } from "@/components/GridLines";
import { StickyCta } from "@/components/StickyCta";
import { Preloader } from "@/components/Preloader";

const sans = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salaath Shaikh — Product Designer",
  description:
    "Hands-on product design lead crafting trusted investing experiences at Upstox.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <noscript>
          <style>{`[data-split],[data-fade],[data-clip],[data-hidden]{visibility:visible}`}</style>
        </noscript>
        <GridLines />
        <Nav />
        <Cursor />
        <Smoother>{children}</Smoother>
        <StickyCta />
        <ScrollProgress />
        <Preloader />
      </body>
    </html>
  );
}
