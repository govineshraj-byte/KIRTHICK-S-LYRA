"use client";

/**
 * LYRA 3D — R15 V2 RED SPECIAL EDITION (real-time procedural model)
 * ─────────────────────────────────────────────────────────────────
 * A sculpted, fully faired sportbike built from shaped Three.js geometry:
 * extruded side-profile fairings, tapered nose cowl, twin projectors with
 * red DRL halos, clip-ons, red anodised levers, red shock spring, GP
 * exhaust, chain drive, canvas-texture LYRA livery decals.
 *
 * Drop-in replacement: put your scanned/marketplace .glb at
 * public/models/r15v2.glb and set USE_PLACEHOLDER=false in
 * lib/model-config.ts — choreography, hotspots and lighting keep working.
 */
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import { MODEL_CONFIG } from "@/lib/model-config";
import { scrollState } from "@/lib/scroll-state";
import { MODS, type Mod } from "@/lib/data";

/* ═══════════ materials ═══════════ */
function useRedEditionMaterials() {
  return useMemo(
    () => ({
      redPaint: new THREE.MeshPhysicalMaterial({
        color: "#c00408",
        metalness: 0.5,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        emissive: "#3d0000",
        emissiveIntensity: 0.5,
      }),
      blackGloss: new THREE.MeshPhysicalMaterial({
        color: "#0a0a0d",
        metalness: 0.65,
        roughness: 0.26,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
      matteBlack: new THREE.MeshStandardMaterial({ color: "#101014", metalness: 0.3, roughness: 0.75 }),
      carbon: new THREE.MeshStandardMaterial({ color: "#15151a", metalness: 0.6, roughness: 0.4 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#d4d7de", metalness: 1, roughness: 0.18 }),
      steel: new THREE.MeshStandardMaterial({ color: "#8a8e98", metalness: 1, roughness: 0.35 }),
      engine: new THREE.MeshStandardMaterial({ color: "#33333c", metalness: 0.85, roughness: 0.45 }),
      caseCover: new THREE.MeshStandardMaterial({ color: "#17171c", metalness: 0.7, roughness: 0.4 }),
      tire: new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.94, metalness: 0.02 }),
      rimDark: new THREE.MeshStandardMaterial({ color: "#1c1c22", metalness: 0.9, roughness: 0.3 }),
      seat: new THREE.MeshStandardMaterial({ color: "#08080a", roughness: 0.9 }),
      screen: new THREE.MeshPhysicalMaterial({
        color: "#2a0808",
        metalness: 0.1,
        roughness: 0.04,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
      projector: new THREE.MeshStandardMaterial({ color: "#fff2d8", emissive: "#ffd9a0", emissiveIntensity: 5 }),
      drlRed: new THREE.MeshStandardMaterial({ color: "#ff2020", emissive: "#e10600", emissiveIntensity: 4 }),
      tailLED: new THREE.MeshStandardMaterial({ color: "#ff2020", emissive: "#ff0a0a", emissiveIntensity: 4.5 }),
      redGlow: new THREE.MeshStandardMaterial({ color: "#ff1a1a", emissive: "#e10600", emissiveIntensity: 3 }),
      redAnodised: new THREE.MeshStandardMaterial({ color: "#d40a12", metalness: 0.9, roughness: 0.25 }),
      goldFork: new THREE.MeshStandardMaterial({ color: "#c9a24a", metalness: 1, roughness: 0.25 }),
      radiator: new THREE.MeshStandardMaterial({ color: "#0e0e12", metalness: 0.6, roughness: 0.6 }),
      chainGold: new THREE.MeshStandardMaterial({ color: "#a8873c", metalness: 1, roughness: 0.35 }),
    }),
    []
  );
}

type Mats = ReturnType<typeof useRedEditionMaterials>;

/* ═══════════ livery decals (canvas textures) ═══════════ */
function makeDecal(text: string, sub: string, color = "#ffffff", accent = "#ff2a22") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const x = c.getContext("2d")!;
  x.clearRect(0, 0, 512, 256);
  x.save();
  x.translate(256, 150);
  x.transform(1, 0, -0.18, 1, 0, 0); // speed slant
  x.textAlign = "center";
  x.fillStyle = color;
  x.font = "italic 900 104px Arial, sans-serif";
  x.fillText(text, 0, 0);
  x.fillStyle = accent;
  x.font = "italic 900 44px Arial, sans-serif";
  x.fillText(sub, 0, 58);
  x.restore();
  // red speed slash
  x.fillStyle = accent;
  x.save();
  x.translate(70, 60);
  x.rotate(-0.5);
  x.fillRect(-14, 0, 28, 150);
  x.restore();
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

/* ═══════════ sculpted shapes ═══════════ */
function fairingShape() {
  // side profile of a supersport mid-fairing (x = length axis → mapped, y = height)
  const s = new THREE.Shape();
  s.moveTo(1.14, 0.62); // nose tip
  s.quadraticCurveTo(1.1, 0.78, 0.92, 0.82); // nose top
  s.lineTo(0.35, 0.8); // top edge
  s.quadraticCurveTo(0.1, 0.78, -0.02, 0.68); // tank junction dip
  s.lineTo(-0.12, 0.42); // rear edge down
  s.quadraticCurveTo(-0.05, 0.3, 0.2, 0.28); // belly
  s.lineTo(0.8, 0.3); // belly front
  s.quadraticCurveTo(1.05, 0.34, 1.14, 0.62); // lower nose sweep
  return s;
}

function tailShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.2, 0.8);
  s.quadraticCurveTo(-0.5, 0.82, -0.78, 0.9); // rising tail top
  s.quadraticCurveTo(-0.95, 0.95, -1.02, 0.92); // tail tip
  s.lineTo(-0.98, 0.82); // tip underside
  s.quadraticCurveTo(-0.7, 0.72, -0.4, 0.68); // undertray
  s.lineTo(-0.2, 0.68);
  s.closePath();
  return s;
}

function noseTopShape() {
  // top-view outline of the front cowl (x = width, y = length)
  const s = new THREE.Shape();
  s.moveTo(0, 1.32); // tip
  s.quadraticCurveTo(0.14, 1.2, 0.17, 1.0);
  s.lineTo(0.19, 0.78); // widest at screen base
  s.lineTo(-0.19, 0.78);
  s.lineTo(-0.17, 1.0);
  s.quadraticCurveTo(-0.14, 1.2, 0, 1.32);
  return s;
}

/* ═══════════ wheel ═══════════ */
function Wheel({
  position,
  mats,
  registerSpin,
  front,
}: {
  position: [number, number, number];
  mats: Mats;
  registerSpin: (o: THREE.Object3D) => void;
  front: boolean;
}) {
  return (
    <group position={position}>
      {/* tyre + red rim tape */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.238, 0.072, 20, 44]} />
        <primitive object={mats.tire} attach="material" />
      </mesh>
      {/* dark rim tape — stock Adrenaline Red runs plain black wheels */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.198, 0.011, 8, 44]} />
        <primitive object={mats.rimDark} attach="material" />
      </mesh>
      {/* spinning assembly */}
      <group ref={(g) => { if (g) registerSpin(g); }}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.19, 0.055, 28]} />
          <primitive object={mats.rimDark} attach="material" />
        </mesh>
        {/* 5 split spokes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[(i * Math.PI * 2) / 5, 0, 0]}>
            <mesh position={[0.032, 0.1, 0]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.05, 0.2, 0.028]} />
              <primitive object={mats.rimDark} attach="material" />
            </mesh>
            <mesh position={[-0.032, 0.1, 0]} rotation={[-0.35, 0, 0]}>
              <boxGeometry args={[0.05, 0.2, 0.028]} />
              <primitive object={mats.rimDark} attach="material" />
            </mesh>
          </group>
        ))}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.11, 14]} />
          <primitive object={mats.matteBlack} attach="material" />
        </mesh>
        {/* brake disc */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.045, 0, 0]}>
          <cylinderGeometry args={[front ? 0.135 : 0.11, front ? 0.135 : 0.11, 0.012, 30]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.052, 0, 0]}>
          <cylinderGeometry args={[front ? 0.07 : 0.055, front ? 0.07 : 0.055, 0.014, 24]} />
          <primitive object={mats.caseCover} attach="material" />
        </mesh>
      </group>
      {/* caliper (static) */}
      <mesh position={[0.05, 0.1, front ? -0.1 : 0.08]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.05, 0.09, 0.05]} />
        <primitive object={mats.redAnodised} attach="material" />
      </mesh>
    </group>
  );
}

/* ═══════════ the bike ═══════════ */
function RedSpecialEdition({
  showHotspots,
  activeMod,
  onSelectMod,
}: {
  showHotspots: boolean;
  activeMod: Mod | null;
  onSelectMod: (m: Mod | null) => void;
}) {
  const mats = useRedEditionMaterials();
  const spinners = useRef<THREE.Object3D[]>([]);
  const glowMat = useRef<THREE.MeshStandardMaterial>(null);

  const geos = useMemo(
    () => ({
      fairing: new THREE.ExtrudeGeometry(fairingShape(), {
        depth: 0.05, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 3, curveSegments: 12,
      }),
      tail: new THREE.ExtrudeGeometry(tailShape(), {
        depth: 0.07, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 3, curveSegments: 12,
      }),
      nose: new THREE.ExtrudeGeometry(noseTopShape(), {
        depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3, curveSegments: 12,
      }),
    }),
    []
  );

  const decals = useMemo(
    () => ({
      // big white YAMAHA fairing graphics like the Adrenaline Red factory livery
      yamaha: makeDecal("YAMAHA", "LYRA · 154", "#f5f5f7", "#e10600"),
      // small tank-side roundel
      lyra: makeDecal("LYRA", "R15 · RED SPECIAL", "#ffffff", "#e10600"),
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const speed = 1.4 + Math.min(Math.abs(scrollState.velocity) * 0.06, 16);
    spinners.current.forEach((o) => { o.rotation.x -= delta * speed; });
    if (glowMat.current) glowMat.current.emissiveIntensity = 2.6 + Math.sin(t * 2.4) * 0.7;
  });

  const spin = (o: THREE.Object3D) => { spinners.current.push(o); };

  return (
    <group>
      <Wheel position={[0, 0.31, 0.672]} mats={mats} registerSpin={spin} front />
      <Wheel position={[0, 0.31, -0.673]} mats={mats} registerSpin={spin} front={false} />

      {/* ── front forks + triple clamp ── */}
      {[-0.085, 0.085].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.62, 0.62]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.021, 0.021, 0.42, 12]} />
            <primitive object={mats.matteBlack} attach="material" />
          </mesh>
          <mesh position={[x, 0.33, 0.7]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.026, 0.024, 0.3, 12]} />
            <primitive object={mats.chrome} attach="material" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.82, 0.56]}>
        <boxGeometry args={[0.24, 0.05, 0.1]} />
        <primitive object={mats.matteBlack} attach="material" />
      </mesh>

      {/* ── front fender ── */}
      <mesh position={[0, 0.42, 0.672]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1.6]}>
        <cylinderGeometry args={[0.35, 0.35, 0.16, 20, 1, true, Math.PI * 0.62, Math.PI * 0.42]} />
        <primitive object={mats.redPaint} attach="material" />
      </mesh>

      {/* ── nose cowl (top-view extrude, rotated flat) ── */}
      <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={geos.nose} attach="geometry" />
        <primitive object={mats.redPaint} attach="material" />
      </mesh>
      {/* nose black intake + center stripe (Adrenaline Red face) */}
      <mesh position={[0, 0.72, 1.24]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.12, 0.1, 0.08]} />
        <primitive object={mats.matteBlack} attach="material" />
      </mesh>
      <mesh position={[0, 0.845, 1.02]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[0.09, 0.015, 0.42]} />
        <primitive object={mats.matteBlack} attach="material" />
      </mesh>

      {/* ── twin projectors + red DRL halos ── */}
      {[-0.085, 0.085].map((x) => (
        <group key={x} position={[x, 0.76, 1.13]} rotation={[0.45, x * -2.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.052, 0.058, 0.05, 20]} />
            <primitive object={mats.matteBlack} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.028]}>
            <sphereGeometry args={[0.038, 18, 14]} />
            <primitive object={mats.projector} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.047, 0.006, 8, 28]} />
            <primitive object={mats.drlRed} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ── windscreen ── */}
      <mesh position={[0, 0.98, 0.82]} rotation={[-0.55, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.3, 16, 1, true, Math.PI * 1.32, Math.PI * 0.36]} />
        <primitive object={mats.screen} attach="material" />
      </mesh>

      {/* ── main side fairings (sculpted extrude, mirrored) ── */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s > 0 ? 0.1 : -0.15, 0, 0]} scale={[s, 1, 1]}>
            <primitive object={geos.fairing} attach="geometry" />
            <primitive object={mats.redPaint} attach="material" />
          </mesh>
          {/* black lower blade */}
          <mesh position={[s * 0.16, 0.3, 0.45]} rotation={[0, s * -0.1, 0]}>
            <boxGeometry args={[0.03, 0.14, 0.7]} />
            <primitive object={mats.matteBlack} attach="material" />
          </mesh>
          {/* LYRA livery decal */}
          <mesh position={[s * 0.196, 0.58, 0.42]} rotation={[0, (s * Math.PI) / 2, 0]}>
            <planeGeometry args={[0.52, 0.26]} />
            <meshBasicMaterial map={decals.yamaha} transparent depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* ── fuel tank + cap + pad ── */}
      <mesh position={[0, 0.84, 0.22]} scale={[1, 0.58, 1.45]}>
        <sphereGeometry args={[0.185, 28, 20]} />
        <primitive object={mats.redPaint} attach="material" />
      </mesh>
      <mesh position={[0, 0.93, 0.22]} scale={[1, 0.4, 1.3]}>
        <sphereGeometry args={[0.11, 20, 14]} />
        <primitive object={mats.blackGloss} attach="material" />
      </mesh>
      <mesh position={[0, 0.975, 0.3]}>
        <cylinderGeometry args={[0.028, 0.028, 0.015, 16]} />
        <primitive object={mats.chrome} attach="material" />
      </mesh>
      {/* tank roundels */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.178, 0.87, 0.24]} rotation={[0, (s * Math.PI) / 2, -0.08]}>
          <planeGeometry args={[0.26, 0.13]} />
          <meshBasicMaterial map={decals.lyra} transparent depthWrite={false} />
        </mesh>
      ))}

      {/* ── seat + sculpted tail ── */}
      <mesh position={[0, 0.83, -0.28]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[0.22, 0.07, 0.42]} />
        <primitive object={mats.seat} attach="material" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s > 0 ? 0.045 : -0.115, 0, 0]} scale={[s, 1, 1]}>
          <primitive object={geos.tail} attach="geometry" />
          <primitive object={mats.blackGloss} attach="material" />
        </mesh>
      ))}
      {/* thin red tail accent */}
      <mesh position={[0, 0.895, -0.72]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.1, 0.014, 0.3]} />
        <primitive object={mats.redPaint} attach="material" />
      </mesh>
      {/* tail LED strip + plate hanger */}
      <mesh position={[0, 0.86, -1.0]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.14, 0.025, 0.02]} />
        <primitive object={mats.tailLED} attach="material" />
      </mesh>
      <mesh position={[0, 0.72, -1.02]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.1, 0.16, 0.015]} />
        <primitive object={mats.matteBlack} attach="material" />
      </mesh>

      {/* ── engine: cases, cylinder + fins, radiator ── */}
      <mesh position={[0, 0.44, 0.12]} scale={[1, 0.9, 1]}>
        <sphereGeometry args={[0.17, 20, 14]} />
        <primitive object={mats.engine} attach="material" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.16, 0.44, 0.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.03, 18]} />
          <primitive object={mats.caseCover} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, 0.6, 0.3]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.2, 0.28, 0.2]} />
        <primitive object={mats.engine} attach="material" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.52 + i * 0.055, 0.345 - i * 0.028]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.26, 0.014, 0.24]} />
          <primitive object={mats.caseCover} attach="material" />
        </mesh>
      ))}
      {/* radiator + shrouds */}
      <mesh position={[0, 0.52, 0.62]}>
        <boxGeometry args={[0.3, 0.24, 0.05]} />
        <primitive object={mats.radiator} attach="material" />
      </mesh>

      {/* ── Deltabox spars (red) ── */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.13, 0.74, 0.22]} rotation={[0.08, 0, s * 0.12]}>
          <boxGeometry args={[0.032, 0.055, 0.66]} />
          <primitive object={mats.redPaint} attach="material" />
        </mesh>
      ))}

      {/* ── exhaust: header → mid → GP muffler ── */}
      <mesh position={[0.08, 0.42, 0.42]} rotation={[0, 0, 0]} >
        <torusGeometry args={[0.16, 0.028, 10, 20, Math.PI * 0.7]} />
        <primitive object={mats.chrome} attach="material" />
      </mesh>
      <mesh position={[0.2, 0.36, -0.3]} rotation={[Math.PI / 2, 0, 0.15]}>
        <cylinderGeometry args={[0.032, 0.032, 0.7, 12]} />
        <primitive object={mats.chrome} attach="material" />
      </mesh>
      <mesh position={[0.21, 0.4, -0.78]} rotation={[Math.PI / 2 - 0.18, 0, 0.1]}>
        <cylinderGeometry args={[0.048, 0.062, 0.42, 20]} />
        <primitive object={mats.matteBlack} attach="material" />
      </mesh>
      <mesh position={[0.215, 0.435, -0.985]} rotation={[Math.PI / 2 - 0.18, 0, 0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.05, 20]} />
        <primitive object={mats.steel} attach="material" />
      </mesh>

      {/* ── swingarm + chain + sprocket + red shock spring ── */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.11, 0.35, -0.45]} rotation={[0.03, 0, 0]}>
          <boxGeometry args={[0.045, 0.08, 0.55]} />
          <primitive object={mats.matteBlack} attach="material" />
        </mesh>
      ))}
      <mesh position={[-0.09, 0.42, -0.45]}>
        <boxGeometry args={[0.02, 0.015, 0.85]} />
        <primitive object={mats.chainGold} attach="material" />
      </mesh>
      <mesh position={[-0.09, 0.24, -0.45]}>
        <boxGeometry args={[0.02, 0.015, 0.85]} />
        <primitive object={mats.chainGold} attach="material" />
      </mesh>
      <mesh position={[-0.09, 0.31, -0.673]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.015, 24]} />
        <primitive object={mats.chainGold} attach="material" />
      </mesh>
      {/* monoshock with red spring */}
      <group position={[0, 0.5, -0.28]} rotation={[-0.5, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 0.3, 10]} />
          <primitive object={mats.chrome} attach="material" />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[0, -0.11 + i * 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.032, 0.009, 8, 18]} />
            <primitive object={mats.redAnodised} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ── clip-ons + red levers + mirrors ── */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.24, 0.94, 0.55]} rotation={[0, 0, s * 1.25]}>
            <cylinderGeometry args={[0.014, 0.014, 0.22, 10]} />
            <primitive object={mats.matteBlack} attach="material" />
          </mesh>
          <mesh position={[s * 0.3, 0.89, 0.55]} rotation={[0, 0, s * 1.25]}>
            <cylinderGeometry args={[0.018, 0.018, 0.11, 10]} />
            <primitive object={mats.seat} attach="material" />
          </mesh>
          <mesh position={[s * 0.27, 0.9, 0.66]} rotation={[0.3, s * 0.5, 0]}>
            <boxGeometry args={[0.012, 0.02, 0.14]} />
            <primitive object={mats.redAnodised} attach="material" />
          </mesh>
          <mesh position={[s * 0.18, 1.0, 0.6]} rotation={[0, 0, s * -0.5]}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
            <primitive object={mats.matteBlack} attach="material" />
          </mesh>
          <mesh position={[s * 0.24, 1.06, 0.62]}>
            <boxGeometry args={[0.09, 0.045, 0.03]} />
            <primitive object={mats.blackGloss} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ── cockpit: clocks ── */}
      <mesh position={[0, 0.93, 0.62]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.16, 0.05, 0.06]} />
        <primitive object={mats.matteBlack} attach="material" />
      </mesh>

      {/* ── underglow ── */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.55, 2.1]} />
        <meshStandardMaterial
          ref={glowMat}
          color="#e10600"
          emissive="#e10600"
          emissiveIntensity={3}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* ── interactive hotspots (MODS section) ── */}
      {showHotspots &&
        MODS.map((mod) => {
          const active = activeMod?.id === mod.id;
          return (
            <Html
              key={mod.id}
              position={mod.hotspot}
              center
              distanceFactor={6}
              occlude={false}
              style={{ pointerEvents: "auto" }}
            >
              <button
                onClick={() => onSelectMod(active ? null : mod)}
                aria-label={`Mod hotspot: ${mod.hotspotLabel}`}
                className={`group flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 ${
                  active
                    ? "scale-125 border-red-400 bg-[#e10600] shadow-[0_0_28px_rgba(225,6,0,0.9)]"
                    : "border-red-500/60 bg-black/60 hover:scale-110 hover:bg-[#e10600]/80 hover:shadow-[0_0_20px_rgba(225,6,0,0.8)]"
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                </span>
                <span className="pointer-events-none absolute left-11 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded border border-red-500/30 bg-black/80 px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-red-100 group-hover:block">
                  {mod.hotspotLabel}
                </span>
              </button>
            </Html>
          );
        })}
    </group>
  );
}

function RealBikeModel() {
  const { scene } = useGLTF(MODEL_CONFIG.MODEL_PATH);
  const normalized = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = MODEL_CONFIG.TARGET_LENGTH_M / Math.max(size.x, size.y, size.z, 0.001);
    const wrapper = new THREE.Group();
    clone.scale.setScalar(scale);
    clone.position.set(
      -center.x * scale + MODEL_CONFIG.OFFSET.x,
      -box.min.y * scale + MODEL_CONFIG.OFFSET.y,
      -center.z * scale + MODEL_CONFIG.OFFSET.z
    );
    clone.rotation.y = MODEL_CONFIG.ROTATION_Y;
    wrapper.add(clone);
    return wrapper;
  }, [scene]);
  return <primitive object={normalized} />;
}

export function LyraBike({
  showHotspots,
  activeMod,
  onSelectMod,
}: {
  showHotspots: boolean;
  activeMod: Mod | null;
  onSelectMod: (m: Mod | null) => void;
}) {
  if (!MODEL_CONFIG.USE_PLACEHOLDER) {
    return (
      <group>
        <RealBikeModel />
      </group>
    );
  }
  return (
    <RedSpecialEdition showHotspots={showHotspots} activeMod={activeMod} onSelectMod={onSelectMod} />
  );
}
