/**
 * ── ALL SITE DATA ──────────────────────────────────────────────
 * Specs below are the real 2017 Yamaha YZF-R15 V2 figures.
 * Mods + gallery are placeholder structures — replace freely.
 */

export type SpecGroup = { title: string; rows: { label: string; value: string }[] };

/* Accurate 2017 Yamaha YZF-R15 Version 2.0 technical data */
export const SPEC_GROUPS: SpecGroup[] = [
  {
    title: "Engine",
    rows: [
      { label: "Engine type", value: "Liquid-cooled, 4-stroke, SOHC, 4-valve, single cylinder" },
      { label: "Displacement", value: "154 cc" },
      { label: "Bore × Stroke", value: "57.0 mm × 58.7 mm" },
      { label: "Compression ratio", value: "10.4 : 1" },
      { label: "Fuel system", value: "Fuel injection" },
      { label: "Ignition", value: "TCI (Transistor Controlled Ignition)" },
      { label: "Starting", value: "Electric start" },
    ],
  },
  {
    title: "Power & Transmission",
    rows: [
      { label: "Max power", value: "16.8 PS (12.4 kW) @ 8,500 rpm" },
      { label: "Max torque", value: "15.0 N·m @ 7,500 rpm" },
      { label: "Transmission", value: "6-speed constant mesh" },
      { label: "Clutch", value: "Wet, multi-plate" },
      { label: "Final drive", value: "Chain" },
    ],
  },
  {
    title: "Chassis & Dimensions",
    rows: [
      { label: "Frame", value: "Deltabox frame" },
      { label: "Front suspension", value: "Telescopic forks" },
      { label: "Rear suspension", value: "Linked-type monocross swingarm" },
      { label: "Front brake", value: "267 mm hydraulic single disc" },
      { label: "Rear brake", value: "220 mm hydraulic single disc" },
      { label: "Front tyre", value: "90/80-17 M/C 46P (tubeless)" },
      { label: "Rear tyre", value: "130/70-R17 M/C 62P radial (tubeless)" },
      { label: "L × W × H", value: "1,975 × 670 × 1,070 mm" },
      { label: "Wheelbase", value: "1,345 mm" },
      { label: "Ground clearance", value: "160 mm" },
      { label: "Seat height", value: "800 mm" },
      { label: "Fuel capacity", value: "12 litres" },
      { label: "Kerb weight", value: "136 kg (with oil & full tank)" },
    ],
  },
];

/* Racing-dashboard performance figures (animated counters) */
export const PERFORMANCE_STATS = [
  { value: 154, decimals: 0, suffix: " cc", label: "Liquid-cooled single", sub: "Fuel-injected · SOHC 4V" },
  { value: 16.8, decimals: 1, suffix: " PS", label: "Max power", sub: "@ 8,500 rpm" },
  { value: 15, decimals: 0, suffix: " Nm", label: "Peak torque", sub: "@ 7,500 rpm" },
  { value: 6, decimals: 0, suffix: "-SPD", label: "Gearbox", sub: "Constant mesh" },
  { value: 12, decimals: 0, suffix: " L", label: "Fuel tank", sub: "Range for night runs" },
  { value: 136, decimals: 0, suffix: " kg", label: "Kerb weight", sub: "Deltabox agility" },
] as const;

/* ── MODS: replace these placeholders with your real parts ── */
export type Mod = {
  id: string;
  title: string;
  category: string;
  status: "Installed" | "Planned" | "Stock+";
  description: string;
  /** 3D hotspot anchor (bike-local coords). Tune freely. */
  hotspot: [number, number, number];
  hotspotLabel: string;
};

export const MODS: Mod[] = [
  {
    id: "exhaust",
    title: "Slip-on Performance Exhaust",
    category: "Exhaust",
    status: "Installed",
    description:
      "Placeholder — replace with your actual end-can (e.g. brand, DB-killer in/out, wrap or carbon tip). Frees up the top-end howl past 7k rpm.",
    hotspot: [0.05, 0.52, -1.35],
    hotspotLabel: "Exhaust",
  },
  {
    id: "levers",
    title: "Adjustable CNC Levers",
    category: "Controls",
    status: "Installed",
    description:
      "Placeholder — replace with your lever brand + colour (Romano Red anodised to match LYRA). Short-throw feel, 6-click reach adjust.",
    hotspot: [0.42, 1.02, 0.72],
    hotspotLabel: "Levers",
  },
  {
    id: "tail",
    title: "Tail-Tidy + LED Indicators",
    category: "Bodywork",
    status: "Installed",
    description:
      "Placeholder — replace with your tail-tidy kit + indicator model. Deletes the stock mudguard slab for the sharp race tail.",
    hotspot: [0, 0.86, -1.15],
    hotspotLabel: "Tail",
  },
  {
    id: "lighting",
    title: "Projector Headlamp + DRLs",
    category: "Lighting",
    status: "Installed",
    description:
      "Placeholder — replace with your projector/Angel-eye setup. Twin-eye face with red DRL halo is LYRA's signature stare.",
    hotspot: [0, 0.95, 1.15],
    hotspotLabel: "Headlamp",
  },
  {
    id: "tyres",
    title: "Radial Rear + Grippier Front",
    category: "Tyres",
    status: "Stock+",
    description:
      "Placeholder — list your exact tyre models + sizes (stock: 90/80-17 F · 130/70-R17 radial R). Note pressures you run.",
    hotspot: [-0.35, 0.34, -0.9],
    hotspotLabel: "Tyres",
  },
  {
    id: "livery",
    title: "Adrenaline Red Livery",
    category: "Livery",
    status: "Installed",
    description:
      "Factory Adrenaline Red scheme — red nose, fender and mid-fairing with white YAMAHA speed graphics over a black tank, tail and lowers. See the reference photo in the gallery. LYRA roundels mark the tank.",
    hotspot: [0, 0.78, 0.1],
    hotspotLabel: "Livery",
  },
];

/* ── GALLERY: drop real photos in /public/gallery/ then list them here ── */
export type GalleryItem = { src: string; title: string; tag: string };

export const GALLERY: GalleryItem[] = [
  { src: "/gallery/lyra-1.jpg", title: "Adrenaline Red — studio profile", tag: "HERO" },
  { src: "", title: "Romano Red flank", tag: "SIDE" },
  { src: "", title: "Cockpit / clip-ons", tag: "COCKPIT" },
  { src: "", title: "Tail + exhaust", tag: "REAR" },
  { src: "", title: "Track crouch", tag: "ACTION" },
  { src: "", title: "Detail — tank & livery", tag: "DETAIL" },
];

export const NAV_LINKS = [
  { href: "#machine", label: "Machine" },
  { href: "#performance", label: "Performance" },
  { href: "#mods", label: "Mods" },
  { href: "#racing", label: "Racing DNA" },
  { href: "#specs", label: "Specs" },
  { href: "#gallery", label: "Gallery" },
] as const;
