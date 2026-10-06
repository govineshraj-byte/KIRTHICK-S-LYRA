"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader } from "./Loader";
import { Nav } from "./Nav";
import {
  IntroSection,
  SpecTicker,
  MachineSection,
  PerformanceSection,
  ModsSection,
  RacingSection,
  PhotoBreakSection,
  SpecsSection,
  GallerySection,
  FinaleSection,
} from "./OverlaySections";
import { scrollState, SECTION_IDS } from "@/lib/scroll-state";
import type { Mod } from "@/lib/data";

const Scene3D = dynamic(() => import("./Scene3D").then((m) => m.Scene3D), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(ScrollTrigger);

function detectLowPower() {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return w < 768 || cores <= 4 || mem <= 4 || reduced;
}

export function CinematicPage() {
  const [ready, setReady] = useState(false);
  const [lowPower] = useState(() => detectLowPower());
  // ui-ux-pro-max: reduced-motion → content renders in final state, calm 3D
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [webglDead, setWebglDead] = useState(false);
  const [hotspots, setHotspots] = useState(false);
  const [activeMod, setActiveMod] = useState<Mod | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const lastHotspot = useRef(false);
  const lastSection = useRef(-1);

  useEffect(() => {
    // WebGL availability check → graceful CSS fallback (deferred past hydration)
    const raf = requestAnimationFrame(() => {
      try {
        const c = document.createElement("canvas");
        if (!c.getContext("webgl2") && !c.getContext("webgl")) setWebglDead(true);
      } catch {
        setWebglDead(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const onReady = useCallback(() => {
    // let first frames settle, then lift the curtain
    setTimeout(() => setReady(true), 600);
  }, []);

  /* ── GSAP scroll choreography ── */
  useEffect(() => {
    // ui-ux-pro-max: reduced-motion → render final state immediately, no choreography
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // global progress → drives the 3D camera rig
      ScrollTrigger.create({
        trigger: document.body,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          scrollState.progress = self.progress;
          scrollState.sectionFloat = self.progress * (SECTION_IDS.length - 1);
          const sec = Math.round(scrollState.sectionFloat);
          scrollState.section = sec;
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`;
          }
          const show = scrollState.sectionFloat > 2.35 && scrollState.sectionFloat < 4.6;
          if (show !== lastHotspot.current) {
            lastHotspot.current = show;
            setHotspots(show);
          }
          if (sec !== lastSection.current) {
            lastSection.current = sec;
            setActiveSection(sec);
          }
        },
      });

      // per-section cinematic entrances (skipped entirely under reduced motion)
      if (!reducedMotion) {
        gsap.utils.toArray<HTMLElement>("[data-section]").forEach((sec) => {
        const items = sec.querySelectorAll(".reveal");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { y: 46, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: sec, start: "top 72%", end: "top 20%", toggleActions: "play none none reverse" },
          }
        );
      });

      // parallax photo backdrops drift against the scroll
      gsap.utils.toArray<HTMLElement>(".parallax-img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
      // rev bars fill on enter
      gsap.utils.toArray<HTMLElement>(".revbar").forEach((bar) => {
        const w = bar.style.width || "70%";
        gsap.fromTo(
          bar,
          { width: "4%" },
          {
            width: w,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: bar, start: "top 88%", toggleActions: "play none none reverse" },
          }
        );
      });
      } // end reduced-motion gate — content stays in its final visible state

      // ui-ux-pro-max gsap: pinned horizontal gallery, desktop + full motion only
      // (mobile keeps swipe; ≤2 pins per page; scrub 1 for cinematic lag)
      if (!reducedMotion) {
        mm.add("(min-width: 1024px)", () => {
          const track = document.querySelector<HTMLElement>(".gallery-track");
          if (!track) return;
          const dist = () => Math.max(track.scrollWidth - window.innerWidth, 0);
          gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: "#gallery",
              start: "top top",
              end: () => `+=${dist()}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      }
    });

    // scroll-velocity → particle/light-trail reaction
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(now - lastT, 16);
      const v = ((y - lastY) / dt) * 16;
      scrollState.velocity += (v - scrollState.velocity) * 0.35;
      scrollState.lastY = y;
      lastY = y;
      lastT = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // ui-ux-pro-max gsap guidance: recalc triggers after fonts/images settle
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      mm.revert();
      ctx.revert();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="vignette scanlines relative bg-[#050507]">
      <Loader done={ready} />
      <Nav />

      {/* scroll progress */}
      <div className="fixed inset-x-0 top-0 z-40 h-[3px] bg-white/5">
        <div ref={progressRef} className="h-full origin-left bg-gradient-to-r from-red-900 via-[#e10600] to-orange-400 shadow-[0_0_16px_rgba(225,6,0,0.8)]" style={{ transform: "scaleX(0)" }} />
      </div>

      {/* section HUD rail */}
      <nav className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 md:flex" aria-label="Section navigation">
        {SECTION_IDS.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`Go to ${id} section`}
            className="flex h-8 w-6 items-center justify-center">
            <span
            className={`block rounded-full transition-all duration-300 ${
              i === activeSection
                ? "h-8 w-1.5 bg-[#e10600] shadow-[0_0_12px_rgba(225,6,0,0.9)]"
                : "h-3 w-1.5 bg-white/20 hover:bg-white/50"
            }`}
            />
          </a>
        ))}
      </nav>

      {/* ── fixed 3D stage ── */}
      <div className="fixed inset-0 z-0">
        {!webglDead ? (
          <Scene3D
            showHotspots={hotspots}
            activeMod={activeMod}
            onSelectMod={setActiveMod}
            lowPower={lowPower}
            reducedMotion={reducedMotion}
            onReady={onReady}
          />
        ) : (
          <div className="noise-bg absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(225,6,0,0.22),transparent_70%),linear-gradient(#0a0a0d,#050507)]" />
        )}
        {/* readability gradient over 3D */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        {/* WebGL fallback still lifts the loader */}
        {webglDead && !ready && <FallbackReady onReady={onReady} />}
      </div>

      {/* ── scroll content (clicks pass through except panels) ── */}
      <main className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        <IntroSection />
        <SpecTicker />
        <MachineSection />
        <PerformanceSection />
        <ModsSection activeMod={activeMod} onSelectMod={setActiveMod} />
        <RacingSection />
        <PhotoBreakSection />
        <SpecsSection />
        <GallerySection />
        <FinaleSection />
      </main>

      {ready && lowPower && !webglDead && (
        <p className="fixed bottom-3 left-3 z-30 rounded-sm border border-white/10 bg-black/60 px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.25em] text-zinc-500 backdrop-blur">
          Lite 3D mode · performance prioritised
        </p>
      )}
    </div>
  );
}

function FallbackReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const t = setTimeout(onReady, 800);
    return () => clearTimeout(t);
  }, [onReady]);
  return null;
}
