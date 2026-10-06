"use client";

import { useEffect, useRef, useState } from "react";
import { Gauge, Cog, Flame, Disc3, Timer, Fuel, Weight, GitBranch } from "lucide-react";
import { PERFORMANCE_STATS, MODS, SPEC_GROUPS, GALLERY, type Mod } from "@/lib/data";

/* ── animated racing-dash counter ── */
function Counter({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0" + (decimals > 0 ? "." + "0".repeat(decimals) : ""));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        // ui-ux-pro-max: reduced-motion → final value immediately, no count-up
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(value.toFixed(decimals));
          return;
        }
        const t0 = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setDisplay((value * e).toFixed(decimals));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals]);

  return (
    <span ref={ref}>
      {display}
      <span className="text-[#ff4a42]">{suffix}</span>
    </span>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="reveal flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-red-500">
      <span className="inline-block h-px w-10 bg-red-600 shadow-[0_0_12px_rgba(225,6,0,0.9)]" />
      {children}
    </p>
  );
}

function SectionTitle({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <h2 className="reveal font-display text-3xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
      {children}{" "}
      {accent && <span className="text-glow-red text-[#e10600]">{accent}</span>}
    </h2>
  );
}

/* ═══════════ 1 · INTRO / HERO ═══════════ */
export function IntroSection() {
  return (
    <section id="intro" data-section="0" className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-24 sm:justify-center sm:pb-0">
      {/* LYRA photo backdrop — duotone-treated, melts into the 3D void */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/lyra-1.jpg"
          alt=""
          className="parallax-img h-[115%] w-full scale-105 object-cover opacity-30 grayscale-[45%] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#050507]/40 to-[#050507]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-[#050507]/80" />
        <div className="absolute inset-0 bg-[#e10600]/15 mix-blend-overlay" />
      </div>
      <div className="pointer-events-auto relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <Kicker>2017 Yamaha YZF-R15 V2 · Modified</Kicker>
          <h1
            className="reveal mt-4 font-display text-[9.5vw] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.9)" }}
          >
            Kirthick&rsquo;s
            <br />
            <span className="text-glow-red text-[#e10600]">Lyra</span>
            <span className="text-stroke-red"> R15</span>
          </h1>
          <p className="reveal mt-5 max-w-xl border-l-2 border-red-600 pl-4 text-base text-zinc-300 sm:text-lg">
            &ldquo;Not Just a Bike. <span className="text-white">A Personality.</span>&rdquo;
            <span className="mt-1 block text-sm text-zinc-500">
              Romano Red on deep black — a cinematic scroll-driven 3D showcase. Scroll to take the camera.
            </span>
          </p>
          <div className="reveal mt-7 flex flex-wrap gap-3">
            <a
              href="#machine"
              className="rounded-sm bg-[#e10600] px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(225,6,0,0.55)] transition hover:bg-[#ff1a1a] hover:shadow-[0_0_44px_rgba(225,6,0,0.8)]"
            >
              Enter the machine
            </a>
            <a
              href="#specs"
              className="glass rounded-sm px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-zinc-200 transition hover:border-red-500/50 hover:text-white"
            >
              Full specs
            </a>
          </div>
          <div className="reveal mt-8 flex flex-wrap gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            {["154 cc", "16.8 PS", "6-speed", "Deltabox"].map((s) => (
              <span key={s} className="glass rounded-full px-4 py-1.5">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(225,6,0,1)]" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-zinc-500">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-red-600 to-transparent" />
      </div>
    </section>
  );
}

/* ═══════════ VALUE STRIP · hero-centric pattern: single prop marquee ═══════════ */
const TICKER = [
  "154cc",
  "16.8 PS",
  "15 Nm",
  "6-speed",
  "Deltabox",
  "267 / 220 discs",
  "130 radial",
  "12L tank",
  "136 kg",
  "Adrenaline Red",
];

export function SpecTicker() {
  return (
    <div
      className="relative z-10 overflow-hidden border-y border-red-600/25 bg-black/70 py-3 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-300">
        {[0, 1].map((dup) => (
          <span key={dup} className="flex">
            {TICKER.map((t) => (
              <span key={`${t}-${dup}`} className="px-6">
                <span className="text-[#ff2a22]">{"//"} </span>
                {t}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════ 2 · THE MACHINE ═══════════ */
const MACHINE_POINTS = [
  {
    icon: Cog,
    title: "154cc liquid-cooled single",
    body: "SOHC 4-valve fuel-injected heart — 57.0 × 58.7 mm, 10.4:1 compression. The camera pushes into the engine cases and cooling fins.",
  },
  {
    icon: GitBranch,
    title: "Deltabox frame",
    body: "Yamaha's R-DNA chassis. Twin red spars carry the mass centralised — razor turn-in, 136 kg kerb agility.",
  },
  {
    icon: Disc3,
    title: "267 / 220 mm discs",
    body: "Hydraulic single discs both ends, 90-section front and 130 radial rear. Braking markers, 17-inch wheels.",
  },
];

export function MachineSection() {
  return (
    <section id="machine" data-section="1" className="relative flex min-h-screen items-center py-28">
      <div className="pointer-events-auto mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="ml-auto max-w-xl">
          <Kicker>The machine · 01</Kicker>
          <SectionTitle accent="MECHANICAL.">Raw,</SectionTitle>
          <p className="reveal mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            The 3D camera dives to the crankcases as lighting cools. Every fin, spar and disc on LYRA
            is stock R15 V2 engineering — sharpened by mods in the next section.
          </p>
          <div className="mt-6 space-y-3">
            {MACHINE_POINTS.map((p) => (
              <div key={p.title} className="reveal glass hud-corner flex gap-4 rounded-md p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-red-600/15 text-red-500">
                  <p.icon size={19} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span>
                  <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white">{p.title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-zinc-400">{p.body}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 3 · PERFORMANCE ═══════════ */
export function PerformanceSection() {
  return (
    <section id="performance" data-section="2" className="relative flex min-h-screen items-center py-28">
      <div className="pointer-events-auto mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Kicker>Racing dashboard · 02</Kicker>
        <SectionTitle accent="NUMBERS.">Bloodline in</SectionTitle>
        <p className="reveal mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
          Real V2 figures, presented like a pit-wall dash. Counters fire as you enter the rev zone.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {PERFORMANCE_STATS.map((s, i) => (
            <div
              key={s.label}
              className="reveal glass hud-corner relative overflow-hidden rounded-md p-5"
            >
              <span className="absolute right-3 top-2 font-display text-[10px] tracking-[0.3em] text-zinc-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Gauge size={16} className="text-red-500" aria-hidden="true" />
              <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-white sm:text-4xl">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-1 font-display text-xs font-bold uppercase tracking-[0.2em] text-zinc-200">{s.label}</p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">{s.sub}</p>
              {/* rev bar */}
              <span className="mt-3 block h-1 overflow-hidden rounded bg-white/10">
                <span
                  className="revbar block h-full w-0 bg-gradient-to-r from-red-900 via-[#e10600] to-orange-400"
                  style={{ width: `${62 + i * 6}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 4 · THE MODS ═══════════ */
export function ModsSection({
  activeMod,
  onSelectMod,
}: {
  activeMod: Mod | null;
  onSelectMod: (m: Mod | null) => void;
}) {
  return (
    <section id="mods" data-section="3" className="relative flex min-h-screen items-center py-28">
      <div className="pointer-events-auto mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Kicker>The mods · 03 — click the glowing markers on the bike</Kicker>
        <SectionTitle accent="LYRA.">Built, not bought —</SectionTitle>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {MODS.map((m) => {
              const active = activeMod?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectMod(active ? null : m)}
                  className={`reveal glass hud-corner rounded-md p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-red-500/70 shadow-[0_0_36px_rgba(225,6,0,0.35)]"
                      : "hover:border-red-500/40"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">
                      {m.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.2em] ${
                        m.status === "Installed" ? "bg-red-600/20 text-red-400" : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {m.status}
                    </span>
                  </span>
                  <span className="mt-2 block font-display text-base font-bold uppercase tracking-wide text-white">
                    {m.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[13px] text-zinc-400">{m.description}</span>
                </button>
              );
            })}
          </div>
          {/* detail panel */}
          <div className="glass hud-corner h-fit rounded-md p-6 lg:sticky lg:top-24">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              {activeMod ? "Selected modification" : "Inspector"}
            </p>
            {activeMod ? (
              <div key={activeMod.id}>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase text-white">{activeMod.title}</h3>
                <p className="mt-1 font-display text-xs uppercase tracking-[0.25em] text-red-500">
                  {activeMod.category} · {activeMod.status} · {activeMod.hotspotLabel} marker
                </p>
                <div className="red-glow-line my-4 h-px" />
                <p className="text-sm leading-relaxed text-zinc-300">{activeMod.description}</p>
                <button
                  onClick={() => onSelectMod(null)}
                  className="mt-5 w-full rounded-sm border border-red-500/40 px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.25em] text-red-400 transition hover:bg-red-600/15"
                >
                  Deselect
                </button>
              </div>
            ) : (
              <>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase text-zinc-200">
                  Tap a marker
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Pulsing red hotspots are pinned to the 3D bike — exhaust, levers, tail, headlamp,
                  tyres, livery. Select any card or any 3D marker to inspect it here.
                </p>
                <div className="mt-4 rounded-sm border border-dashed border-white/15 bg-white/[0.03] p-3 text-[12px] leading-relaxed text-zinc-500">
                  To add your real parts: edit <code className="text-red-400">MODS</code> in{" "}
                  <code className="text-zinc-300">lib/data.ts</code> — title, status, description +
                  hotspot XYZ. No 3D knowledge needed.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 5 · RACING DNA ═══════════ */
export function RacingSection() {
  return (
    <section id="racing" data-section="4" className="relative flex min-h-screen items-center overflow-hidden py-28">
      {/* marquee */}
      <div className="pointer-events-none absolute top-16 left-0 w-full overflow-hidden opacity-30" aria-hidden="true">
        <div className="animate-marquee flex w-max whitespace-nowrap font-display text-6xl font-bold uppercase text-transparent sm:text-8xl" style={{ WebkitTextStroke: "1px rgba(225,6,0,0.6)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="pr-8">Racing DNA · Lyra · R15 V2 ·&nbsp;</span>
          ))}
        </div>
      </div>
      <div className="pointer-events-auto relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Kicker>Full attack · 04</Kicker>
          <h2 className="reveal font-display text-4xl font-bold uppercase leading-[1.0] sm:text-6xl">
            Redline <span className="text-glow-red text-[#e10600]">mentality.</span>
          </h2>
          <p className="reveal mt-5 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Peak power at <strong className="text-white">8,500 rpm</strong>, peak torque at{" "}
            <strong className="text-white">7,500 rpm</strong> — the V2 begs to be held wide open.
            Close-ratio 6-speed, Deltabox rigidity, 160 mm of ground clearance to throw around.
            Lighting goes full Romano Red. The camera drops low and the embers fly.
          </p>
          <div className="reveal mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Timer, k: "8,500", v: "rpm power peak" },
              { icon: Flame, k: "7,500", v: "rpm torque peak" },
              { icon: Fuel, k: "12 L", v: "night-run range" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-md p-4 text-center">
                <s.icon size={18} className="mx-auto text-red-500" aria-hidden="true" />
                <p className="mt-2 font-mono text-2xl font-bold text-white sm:text-3xl">{s.k}</p>
                <p className="font-display text-[10px] uppercase tracking-[0.25em] text-zinc-500">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-10 left-0 h-24 w-full bg-gradient-to-t from-[#e10600]/15 to-transparent" />
    </section>
  );
}

/* ═══════════ PHOTO INTERLUDE · full-bleed LYRA shot ═══════════ */
export function PhotoBreakSection() {
  return (
    <section data-section="photo" className="relative flex min-h-[85vh] items-end overflow-hidden py-20" aria-label="Lyra photograph">
      <div className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gallery/lyra-1.jpg"
          alt="Kirthick's LYRA — Yamaha R15 V2 in Adrenaline Red"
          className="parallax-img h-[120%] w-full scale-105 object-cover"
        />
        {/* cinematic treatment: red duotone + vignette + grain-friendly darkening */}
        <div className="absolute inset-0 bg-[#e10600]/25 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-transparent to-[#050507]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/90 via-transparent to-[#050507]/60" />
        <div className="noise-bg absolute inset-0 opacity-20" />
      </div>
      <div className="pointer-events-auto relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="reveal glass hud-corner inline-block max-w-lg rounded-md p-6">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.35em] text-red-500">
            The real LYRA · no render
          </p>
          <p className="mt-2 font-display text-3xl font-bold uppercase leading-none text-white sm:text-4xl">
            Adrenaline <span className="text-glow-red text-[#e10600]">Red.</span>
          </p>
          <p className="mt-2 text-sm text-zinc-300">
            2017 R15 V2 · 154cc · shot in studio light. The 3D bike orbiting this
            page wears this exact livery.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 6 · SPECIFICATIONS ═══════════ */
export function SpecsSection() {
  return (
    <section id="specs" data-section="5" className="relative flex min-h-screen items-center py-28">
      <div className="pointer-events-auto mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Kicker>Factory sheet · 05</Kicker>
        <SectionTitle accent="V2.">2017 R15</SectionTitle>
        <p className="reveal mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          <Weight size={14} className="text-red-500" aria-hidden="true" /> Verified stock figures — mods listed separately above
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {SPEC_GROUPS.map((g) => (
            <div key={g.title} className="reveal glass hud-corner overflow-hidden rounded-md">
              <p className="border-b border-white/10 bg-gradient-to-r from-red-700/25 to-transparent px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-white">
                {g.title}
              </p>
              <dl>
                {g.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-4 border-b border-white/5 px-5 py-2.5 last:border-0">
                    <dt className="text-[12px] uppercase tracking-wider text-zinc-500">{r.label}</dt>
                    <dd className="text-right text-[13px] font-medium leading-snug text-zinc-100">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 7 · GALLERY ═══════════ */
export function GallerySection() {
  return (
    <section id="gallery" data-section="6" className="relative flex min-h-screen items-center overflow-hidden py-28 lg:h-screen lg:py-0">
      <div className="pointer-events-auto w-full">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Kicker>Lyra gallery · 06 — keep scrolling, it drives sideways on desktop</Kicker>
          <SectionTitle accent="DARK.">Shot in the</SectionTitle>
        </div>
        <div className="gallery-track mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:px-[8vw] lg:pb-0">
          {GALLERY.map((g, i) => (
            <figure
              key={g.tag + i}
              className="reveal glass group relative h-72 w-72 shrink-0 snap-center overflow-hidden rounded-md sm:h-80 sm:w-96 lg:h-[58vh] lg:w-[36rem]"
            >
              {g.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.src} alt={g.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              ) : (
                <div className="noise-bg relative flex h-full w-full flex-col justify-end bg-gradient-to-br from-[#1a0505] via-[#0b0b0e] to-black p-5">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `radial-gradient(ellipse 80% 60% at ${20 + i * 12}% 30%, rgba(225,6,0,${0.22 - (i % 3) * 0.05}), transparent 70%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-5xl font-bold uppercase text-white/10">{g.tag}</span>
                  </div>
                  <span className="relative rounded-sm border border-dashed border-red-500/40 bg-black/50 p-3 text-[11px] leading-relaxed text-zinc-400">
                    Slot {String(i + 1).padStart(2, "0")} — drop your photo at{" "}
                    <code className="text-red-400">/public/gallery/lyra-{i + 1}.jpg</code> then set its{" "}
                    <code className="text-zinc-200">src</code> in <code className="text-red-400">GALLERY</code>{" "}
                    (<code className="text-zinc-200">lib/data.ts</code>)
                  </span>
                </div>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-10">
                <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white">{g.src ? g.title : `Coming — ${g.title}`}</span>
                <span className="rounded-sm bg-[#e10600] px-2 py-1 font-display text-[10px] font-bold tracking-[0.2em]">{g.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ 8 · FINAL REVEAL ═══════════ */
export function FinaleSection() {
  return (
    <section id="finale" data-section="7" className="relative flex min-h-screen flex-col items-center justify-center py-28 text-center">
      <div className="pointer-events-auto mx-auto w-full max-w-5xl px-5">
        <Kicker>
          <span className="mx-auto">Final reveal · slow rotation</span>
        </Kicker>
        <h2 className="reveal mt-6 font-display text-[10.5vw] font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          Kirthick&rsquo;s
          <br />
          <span className="text-glow-red text-[#e10600]">Lyra</span>
        </h2>
        <div className="red-glow-line reveal mx-auto mt-6 h-px w-56" />
        <p className="reveal mt-5 font-display text-lg font-semibold uppercase tracking-[0.3em] text-zinc-200 sm:text-xl">
          &ldquo;Not Just a Bike. A Personality.&rdquo;
        </p>
        <p className="reveal mx-auto mt-3 max-w-md text-sm text-zinc-500">
          2017 Yamaha YZF-R15 V2 · Romano Red on black · Built by Kirthick, shot in the dark.
        </p>
        <div className="reveal mt-8 flex flex-wrap justify-center gap-3">
          <a href="#intro" className="rounded-sm bg-[#e10600] px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(225,6,0,0.55)] transition hover:bg-[#ff1a1a]">
            Replay the reveal
          </a>
          <a href="#mods" className="glass rounded-sm px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] transition hover:border-red-500/50">
            Revisit the mods
          </a>
        </div>
        <footer className="reveal mt-16 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Kirthick&rsquo;s Lyra · R15 V2 cinematic showcase · 3D placeholder bike — swap in your .glb via{" "}
          <code className="text-zinc-400">lib/model-config.ts</code>
        </footer>
      </div>
    </section>
  );
}
