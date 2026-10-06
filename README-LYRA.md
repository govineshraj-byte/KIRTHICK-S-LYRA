# KIRTHICK'S LYRA — Cinematic 3D R15 V2 Showcase

Scroll-driven cinematic 3D one-pager for a modified **2017 Yamaha YZF-R15 V2**.
Deep black + Romano Red, fixed WebGL stage, GSAP ScrollTrigger storytelling.

## Run it

```bash
cd kirthick-lyra
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build (verified clean)
```

## How the 3D scroll experience works

- `components/Scene3D.tsx` — one fixed `<Canvas>` behind all content. A `Rig`
  lerps camera position / look-target / bike rotation / red-light intensity
  between 8 waypoints using the shared `scrollState.sectionFloat` (0→7).
- `lib/scroll-state.ts` — mutable ref shared by GSAP (writer) and `useFrame` (reader). Zero React re-renders per scroll frame.
- `components/CinematicPage.tsx` — GSAP ScrollTrigger writes global progress,
  per-section blur/slide entrances, rev-bar fills, scroll-velocity (drives wheel
  spin, light intensity, particle energy in the 3D loop).
- `components/LyraBike.tsx` — **placeholder** procedural R15-V2 (clearly marked,
  zero external assets) + `RealBikeModel` loader for your `.glb`.

## Swap in your real bike model (.glb)

1. Export `.glb` (Blender → glTF, Y-up, < ~15 MB) to `public/models/r15v2.glb`
   (see `public/models/README.txt`).
2. `lib/model-config.ts` → `USE_PLACEHOLDER: false`. Done — scale/centering is automatic.

## Add your real mods

Edit `MODS` in `lib/data.ts` — title, category, status, description, and the
`hotspot: [x, y, z]` 3D anchor + label. Cards and 3D pulsing markers stay in sync.

## Add your real photos

Drop files in `public/gallery/` (e.g. `lyra-1.jpg`), then set each `src` in the
`GALLERY` array in `lib/data.ts`. Empty `src` renders a styled placeholder slot.

## Specs

`SPEC_GROUPS` / `PERFORMANCE_STATS` in `lib/data.ts` hold verified stock
2017 R15 V2 figures (154 cc, 16.8 PS @ 8,500 rpm, 15 Nm @ 7,500 rpm,
6-speed, 267/220 mm discs, 90/80-17 & 130/70-R17, Deltabox, 12 L, 136 kg kerb,
1975×670×1070 mm, 1345 mm wheelbase).

## Performance / fallbacks

- DPR capped `[1, 2]` (lite `[1, 1.25]` on mobile / ≤4 cores / ≤4 GB / reduced-motion).
- Sparkles + smoke + ContactShadows only — no runtime HDR downloads.
- No-WebGL → cinematic CSS gradient fallback; loader always resolves.
- `prefers-reduced-motion` respected; `npm run lint` + `tsc --noEmit` clean.
