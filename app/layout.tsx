import type { Metadata } from "next";
import { Inter, Syncopate, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// ui-ux-pro-max typography system: "Kinetic Motion" pairing for automotive —
const syncopate = Syncopate({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KIRTHICK'S LYRA — 2017 Yamaha R15 V2 | Cinematic 3D Showcase",
  description:
    "Not Just a Bike. A Personality. A cinematic scroll-driven 3D showcase of Kirthick's modified 2017 Yamaha R15 V2 — Romano Red on deep black.",
  keywords: ["Yamaha R15 V2", "Kirthick's Lyra", "modified R15", "cinematic 3D bike", "R15 mods"],
  openGraph: {
    title: "KIRTHICK'S LYRA — Not Just a Bike. A Personality.",
    description:
      "Scroll-driven cinematic 3D showcase of a modified 2017 Yamaha R15 V2.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#050507",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syncopate.variable} ${spaceMono.variable} h-full`}>
      <body className="min-h-full bg-[#050507] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
