"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import { LyraBike } from "./LyraBike";
import { scrollState } from "@/lib/scroll-state";
import type { Mod } from "@/lib/data";

/* Cinematic camera/bike choreography — one waypoint per page section */
const CAM_POS: [number, number, number][] = [
  [4.8, 1.7, 6.2], // 0 intro — heroic 3/4
  [2.3, 1.0, 2.9], // 1 machine — push into engine
  [-3.6, 1.5, 4.4], // 2 performance — opposite flank
  [3.4, 1.4, 2.4], // 3 mods — close orbit for hotspots
  [-2.6, 0.75, 5.4], // 4 racing — low aggressive
  [0.2, 3.1, 7.0], // 5 specs — high survey
  [-5.2, 1.9, 2.2], // 6 gallery — wide profile
  [4.4, 1.6, 5.6], // 7 finale — hero return
];
const CAM_TGT: [number, number, number][] = [
  [0, 0.85, 0],
  [0.1, 0.55, 0.3],
  [0, 0.7, 0],
  [0, 0.7, -0.2],
  [0, 0.6, 0],
  [0, 0.4, 0],
  [0, 0.8, 0],
  [0, 0.85, 0],
];
const BIKE_ROT = [0.55, 1.5, 2.6, 3.5, 4.8, 5.6, 6.1, 6.9];
const RED_LEVEL = [1.0, 0.85, 0.7, 0.8, 1.7, 0.5, 0.75, 1.25];

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function Rig({
  showHotspots,
  activeMod,
  onSelectMod,
  reducedMotion,
}: {
  showHotspots: boolean;
  activeMod: Mod | null;
  onSelectMod: (m: Mod | null) => void;
  reducedMotion: boolean;
}) {
  const bike = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.SpotLight>(null);
  const rimLight = useRef<THREE.SpotLight>(null);
  const underGlow = useRef<THREE.PointLight>(null);
  const ring = useRef<THREE.Mesh>(null);
  const smoke = useRef<THREE.Group>(null);

  const cur = useRef({
    pos: new THREE.Vector3(...CAM_POS[0]),
    tgt: new THREE.Vector3(...CAM_TGT[0]),
    rot: BIKE_ROT[0],
    red: RED_LEVEL[0],
    vel: 0,
  }).current;
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpTgt = useMemo(() => new THREE.Vector3(), []);

  const smokeTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, "rgba(255,60,50,0.35)");
    g.addColorStop(0.5, "rgba(150,10,10,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const f = THREE.MathUtils.clamp(scrollState.sectionFloat, 0, CAM_POS.length - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(i0 + 1, CAM_POS.length - 1);
    const t = smooth(f - i0);

    tmpPos.set(...lerp3(CAM_POS[i0], CAM_POS[i1], t));
    tmpTgt.set(...lerp3(CAM_TGT[i0], CAM_TGT[i1], t));
    const rotT = BIKE_ROT[i0] + (BIKE_ROT[i1] - BIKE_ROT[i0]) * t;
    const redT = RED_LEVEL[i0] + (RED_LEVEL[i1] - RED_LEVEL[i0]) * t;

    // scroll-velocity reaction (damped)
    cur.vel += (Math.abs(scrollState.velocity) - cur.vel) * (1 - Math.exp(-4 * d));
    const k = 1 - Math.exp(-2.6 * d);
    cur.pos.lerp(tmpPos, k);
    cur.tgt.lerp(tmpTgt, k);
    cur.rot += (rotT - cur.rot) * k;
    cur.red += (redT - cur.red) * k;

    state.camera.position.copy(cur.pos);
    state.camera.lookAt(cur.tgt);

    if (bike.current) {
      bike.current.rotation.y = cur.rot;
      // ui-ux-pro-max: no idle float under reduced motion
      bike.current.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 1.1) * 0.02;
    }
    if (keyLight.current) keyLight.current.intensity = 90 * cur.red + cur.vel * 2;
    if (rimLight.current) rimLight.current.intensity = 50 + cur.vel * 1.5;
    if (underGlow.current)
      underGlow.current.intensity = 14 * cur.red + Math.sin(state.clock.elapsedTime * 2.4) * 2;
    if (ring.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.012;
      ring.current.scale.set(s, s, 1);
      const m = ring.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 2.2 * cur.red + cur.vel * 0.08;
    }
    if (smoke.current) {
      if (!reducedMotion) smoke.current.rotation.y += d * (0.05 + cur.vel * 0.004);
      smoke.current.children.forEach((child, i) => {
        child.position.y = reducedMotion ? 0.5 : 0.5 + Math.sin(state.clock.elapsedTime * 0.5 + i * 2) * 0.25;
      });
    }
    // decay DOM-reported velocity inside the loop
    scrollState.velocity *= Math.exp(-3 * d);
  });

  return (
    <>
      {/* ── lights ── */}
      <ambientLight intensity={0.35} />
      <spotLight
        ref={keyLight}
        position={[5, 6, 4]}
        angle={0.5}
        penumbra={0.7}
        color="#ff1a1a"
        intensity={90}
        distance={30}
      />
      <spotLight
        ref={rimLight}
        position={[-6, 4, -5]}
        angle={0.6}
        penumbra={0.9}
        color="#9db4ff"
        intensity={50}
        distance={30}
      />
      <pointLight position={[0, 2.2, 0]} color="#ffffff" intensity={6} distance={12} />
      <pointLight ref={underGlow} position={[0, 0.25, 0]} color="#e10600" intensity={14} distance={7} />

      {/* ── bike ── */}
      <group ref={bike} position={[0, 0.02, 0]}>
        <LyraBike showHotspots={showHotspots} activeMod={activeMod} onSelectMod={onSelectMod} />
      </group>

      {/* ── podium disc + glow ring ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[2.3, 64]} />
        <meshStandardMaterial color="#0c0c10" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[2.28, 2.42, 72]} />
        <meshStandardMaterial color="#e10600" emissive="#e10600" emissiveIntensity={2.4} transparent opacity={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[1.1, 1.13, 64]} />
        <meshStandardMaterial color="#ff4a42" emissive="#ff2a22" emissiveIntensity={1.4} transparent opacity={0.5} />
      </mesh>

      {/* ── drifting smoke sprites ── */}
      <group ref={smoke}>
        {[
          [2.6, 0.6, -1.4, 3.4],
          [-2.8, 0.5, 1.2, 4.2],
          [0.4, 0.7, -2.8, 3.0],
        ].map(([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]}>
            <planeGeometry args={[s, s]} />
            <meshBasicMaterial map={smokeTex} transparent depthWrite={false} opacity={0.5} />
          </mesh>
        ))}
      </group>

      <ContactShadows position={[0, 0.02, 0]} opacity={0.75} scale={9} blur={2.6} far={4} color="#000000" />
    </>
  );
}

export function Scene3D({
  showHotspots,
  activeMod,
  onSelectMod,
  lowPower,
  reducedMotion,
  onReady,
}: {
  showHotspots: boolean;
  activeMod: Mod | null;
  onSelectMod: (m: Mod | null) => void;
  lowPower: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={lowPower ? [1, 1.25] : [1, 2]}
      camera={{ fov: 38, near: 0.1, far: 60, position: [4.8, 1.7, 6.2] }}
      gl={{ antialias: true, alpha: false, powerPreference: lowPower ? "low-power" : "high-performance" }}
      onCreated={() => onReady()}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#050507"]} />
      <fog attach="fog" args={["#050507", 9, 22]} />
      <Suspense fallback={null}>
        <Rig showHotspots={showHotspots} activeMod={activeMod} onSelectMod={onSelectMod} reducedMotion={reducedMotion} />
        {/* red ember particles */}
        <Sparkles count={lowPower ? 50 : 130} scale={[13, 5.5, 13]} size={3.2} speed={reducedMotion ? 0 : 0.35} color="#ff2a1e" opacity={0.75} position={[0, 2, 0]} />
        {/* cool ash particles for depth */}
        {!lowPower && !reducedMotion && (
          <Sparkles count={60} scale={[13, 6, 13]} size={2} speed={0.2} color="#8e9bb8" opacity={0.4} position={[0, 2.4, 0]} />
        )}
      </Suspense>
    </Canvas>
  );
}
