"use client";

import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#intro" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#e10600] shadow-[0_0_22px_rgba(225,6,0,0.7)]">
            <Zap size={18} className="text-white" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">
            Kirthick&rsquo;s <span className="text-[#ff2a22]">Lyra</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Sections">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="inline-block py-2 font-display text-[12px] font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:text-white hover:text-shadow-[0_0_12px_rgba(225,6,0,0.8)]"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#finale"
            className="rounded-sm bg-[#e10600] px-4 py-2 font-display text-[12px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_0_20px_rgba(225,6,0,0.5)] transition hover:bg-[#ff1a1a]"
          >
            Reveal
          </a>
        </nav>
        <button
          className="glass rounded-sm p-3 text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav className="glass mx-4 mt-3 flex flex-col gap-1 rounded-md p-3 lg:hidden" aria-label="Mobile sections">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-sm px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-zinc-200 transition hover:bg-red-600/15 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
