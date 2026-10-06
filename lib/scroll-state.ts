/**
 * Single mutable scroll state shared between the DOM (GSAP ScrollTrigger
 * writes to it) and the WebGL loop (useFrame reads from it every frame).
 * Mutable-ref pattern keeps us at 60fps with zero React re-renders.
 */
export const scrollState = {
  /** 0 → 1 across the whole page */
  progress: 0,
  /** float section index, e.g. 2.4 = 40% between section 2 and 3 */
  sectionFloat: 0,
  /** integer of the currently dominant section */
  section: 0,
  /** scroll velocity (for particle/light-trail reaction), damped in 3D loop */
  velocity: 0,
  /** set by ScrollTrigger onUpdate */
  lastY: 0,
};

export const SECTION_IDS = [
  "intro",
  "machine",
  "performance",
  "mods",
  "racing",
  "specs",
  "gallery",
  "finale",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
