# 3D Background Animation Polish — Design Spec

**Date:** 2026-03-28
**Status:** Approved
**Scope:** Polish the WebGL 3D animated background so blobs look genuinely three-dimensional instead of flat colored circles.

## Problem

The current floating blobs use plain `sphereGeometry` with `meshStandardMaterial` at high roughness (0.9) and low opacity (0.15–0.25). Combined with minimal lighting (one ambient + one point light) and no vertex displacement, they render as flat, transparent circles with no visible surface curvature. The user sees "circle-rounded-flying things" rather than 3D shapes.

## Approach

Use drei's `MeshDistortMaterial` (already in project dependencies via `@react-three/drei`) for GPU-accelerated simplex noise vertex displacement, combined with a proper 3-light rig and material tuning. This gives 90% of the visual impact of a custom GLSL shader with minimal code complexity.

**Alternatives considered:**
- Custom GLSL vertex/fragment shader — full control but ~150+ lines of shader code, harder to maintain
- CPU-side vertex morphing — poor performance, jittery at higher poly counts

## Design

### 1. FloatingBlob Component

**File:** `src/features/background-effects/FloatingBlob.tsx`

Replace `meshStandardMaterial` with drei's `MeshDistortMaterial`:

| Property | Current | New |
|----------|---------|-----|
| Material | `meshStandardMaterial` | `MeshDistortMaterial` (from `@react-three/drei`) |
| Distort | N/A | `0.3` (moderate organic deformation) |
| Speed | N/A | `1.5` (slow continuous morphing) |
| Roughness | `0.9` | `0.3` (shows specular highlights) |
| Metalness | N/A | `0.15` (subtle reflectivity) |
| Opacity | `0.15–0.25` (transparent) | `1.0` (fully opaque) |
| Geometry segments | `32, 32` | `64, 64` (smoother distortion) |

Add slow 3D rotation in `useFrame`: rotate around all three axes at different speeds per blob, reusing the existing `speed` prop values.

Remove the `opacity` prop from the component interface (no longer variable).

### 2. Lighting Setup

**File:** `src/features/background-effects/BlobScene.tsx`

Replace the current 2-light setup with a classic 3-light rig:

| Light | Position | Intensity (dark / light) | Purpose |
|-------|----------|--------------------------|---------|
| Ambient | N/A | `0.3` / `0.5` | Base fill |
| Directional (key) | `[5, 5, 5]` | `1.2` / `0.9` | Primary highlights |
| Directional (rim) | `[-3, -2, -5]` | `0.7` / `0.5` | Edge highlights revealing 3D silhouette |

Remove the current `pointLight`.

### 3. Blob Configuration

**File:** `src/features/background-effects/BlobScene.tsx`

- Push all blob Z positions deeper by `-2` units (range: `-3` to `-6`) to keep fully opaque blobs behind content
- Reduce blob radii by ~20% to prevent dominating the background now that they're opaque
- Keep existing 6 accent colors from the design system palette
- Remove `sphereOpacity` from the theme config (no longer needed)

### 4. Bloom Post-Processing

Keep current Bloom settings unchanged:
- `luminanceThreshold: 0.2`
- `luminanceSmoothing: 0.9`
- Theme-adaptive intensity (`1.5` dark / `0.8` light)

Bloom on opaque colored surfaces produces halo glow around blob edges.

### 5. Unchanged

- Camera: `position: [0, 0, 10]`, `fov: 50`
- Mouse parallax: `CameraParallax` component and `useMouseParallax` hook
- Canvas: `dpr={[1, 1.5]}`, `gl={{ alpha: true }}`
- `ReducedMotionFallback`: static blurred circles for `prefers-reduced-motion`
- `AnimatedBackground` wrapper: Suspense, reduced-motion detection

## Files Changed

1. **`src/features/background-effects/FloatingBlob.tsx`** — Major: new material (MeshDistortMaterial), rotation logic, updated props interface
2. **`src/features/background-effects/BlobScene.tsx`** — Moderate: new lighting rig, updated blob config (positions, radii), simplified theme config

## Performance

- `MeshDistortMaterial` runs vertex displacement on the GPU — no CPU overhead
- 64×64 segments = ~8K vertices per blob, 48K total for 6 blobs — well within budget
- No changes to DPR capping or lazy loading

## Testing

- Existing `useMouseParallax.test.ts` unaffected (hook logic unchanged)
- Run existing 39 tests to verify no regressions
- Visual verification in browser for 3D effect quality
