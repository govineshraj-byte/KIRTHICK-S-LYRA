"use client";

import { Zap } from "lucide-react";

export function Loader({ done }: { done: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050507] transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={done}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-md bg-[#e10600] shadow-[0_0_60px_rgba(225,6,0,0.8)]">
        <Zap size={30} className="animate-pulse text-white" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <p className="mt-6 font-display text-2xl font-bold uppercase tracking-[0.3em] text-white">
        Kirthick&rsquo;s <span className="text-[#ff2a22]">Lyra</span>
      </p>
      <p className="mt-2 font-display text-[11px] uppercase tracking-[0.4em] text-zinc-500">
        Warming up the engine
      </p>
      <div className="mt-6 h-[3px] w-56 overflow-hidden rounded bg-white/10">
        <div
          className={`h-full bg-gradient-to-r from-red-900 via-[#e10600] to-orange-400 ${
            done ? "w-full" : "w-2/3 animate-pulse"
          } transition-all duration-500`}
          style={!done ? { animation: "loadslide 1.2s ease-in-out infinite" } : undefined}
        />
      </div>
      <style>{`@keyframes loadslide { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }`}</style>
    </div>
  );
}
