/**
 * ─────────────────────────────────────────────────────────────
 *  3D MODEL CONFIG — READ THIS TO INSTALL YOUR REAL R15 V2 MODEL
 * ─────────────────────────────────────────────────────────────
 *
 *  OPTION A (recommended): drop your .glb here:
 *    public/models/r15v2.glb
 *  then set USE_PLACEHOLDER = false below. That's it.
 *
 *  OPTION B: use a remote / differently-named file:
 *    MODEL_PATH = "/models/my-bike.glb"  (must live in /public)
 *
 *  Requirements for the .glb:
 *   - Y-up, roughly 2m long (R15 V2 ≈ 1.975 m). The rig auto-centers
 *     and normalizes scale, so minor size differences are fine.
 *   - Keep it under ~15 MB for fast mobile loads (use gltfpack /
 *     Blender decimate + KTX2 if needed).
 *
 *  Until then, USE_PLACEHOLDER = true renders a clearly-marked
 *  sculpted R15 V2 Red Special Edition stand-in built with pure Three.js
 *  geometry (no external assets), so the whole cinematic scroll
 *  experience works out of the box.
 */

export const MODEL_CONFIG = {
  /** Flip to false the moment /public/models/r15v2.glb exists. */
  USE_PLACEHOLDER: true as boolean,
  /** Public URL of the real bike model. */
  MODEL_PATH: "/models/r15v2.glb",
  /** Target length (m) the real model is normalized to. */
  TARGET_LENGTH_M: 2.0,
  /** Fine-tune placement of the real model on the podium disc. */
  OFFSET: { x: 0, y: 0, z: 0 } as { x: number; y: number; z: number },
  ROTATION_Y: 0,
} as const;
