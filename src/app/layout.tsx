import type { Metadata, Viewport } from "next";
import { Cinzel, Manrope, Shippori_Mincho, Yuji_Syuku } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Preloader } from "@/components/Preloader";
import { Cursor } from "@/components/Cursor";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const shippori = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-shippori",
  display: "swap",
});

const yuji = Yuji_Syuku({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yuji",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jujutsu Kaisen — The Strongest",
  description:
    "A cinematic journey through the world of Jujutsu Kaisen: arcs, characters, episodes and the world of curses.",
};

export const viewport: Viewport = {
  themeColor: "#07060c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${manrope.variable} ${shippori.variable} ${yuji.variable}`}
    >
      <body>
        <SmoothScroll>
          <Preloader />
          <Navbar />
          {children}
        </SmoothScroll>
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
