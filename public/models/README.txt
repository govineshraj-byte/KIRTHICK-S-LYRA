HOW TO INSTALL YOUR REAL R15 V2 MODEL
=========================================

1. Export your bike as .glb (Blender: File → Export → glTF, Y-up).
   Keep it under ~15 MB (Decimate / gltfpack / KTX2 help a lot).

2. Copy it here and name it exactly:
     public/models/r15v2.glb

3. Open lib/model-config.ts and set:
     USE_PLACEHOLDER: false

4. (Optional) nudge placement:
     OFFSET / ROTATION_Y in the same file.

The rig auto-centers + normalizes scale, and the whole scroll
choreography, hotspots and lighting keep working unchanged.
