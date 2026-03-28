# 3D Background Animation Polish — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat transparent sphere blobs with organic, distorted, fully opaque 3D shapes using drei's `MeshDistortMaterial` and a 3-light rig.

**Architecture:** Two files change: `FloatingBlob.tsx` gets a new material (MeshDistortMaterial) with rotation, `BlobScene.tsx` gets a new lighting rig and updated blob config. Everything else (camera, parallax, canvas, AnimatedBackground, ReducedMotionFallback, Bloom) stays untouched.

**Tech Stack:** React Three Fiber, @react-three/drei (MeshDistortMaterial), Three.js, Vitest

**Spec:** `docs/superpowers/specs/2026-03-28-3d-background-polish-design.md`

---

## Chunk 1: FloatingBlob Component

### Task 1: Update FloatingBlob — Replace material and add rotation

**Files:**
- Modify: `src/features/background-effects/FloatingBlob.tsx`
- Modify: `src/features/background-effects/BlobScene.tsx` (remove `opacity` prop from FloatingBlob usage only — keeps TypeScript compilable between chunks)

- [ ] **Step 1: Write the updated FloatingBlob component**

Replace the entire `FloatingBlob.tsx` with:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

interface FloatingBlobProps {
  position: [number, number, number];
  color: string;
  radius: number;
  speed: [number, number, number];
  amplitude: [number, number, number];
  phase: [number, number, number];
}

export function FloatingBlob({
  position,
  color,
  radius,
  speed,
  amplitude,
  phase,
}: FloatingBlobProps) {
  const meshRef = useRef<Mesh | null>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = position[0] + Math.sin(t * speed[0] + phase[0]) * amplitude[0];
      meshRef.current.position.y = position[1] + Math.sin(t * speed[1] + phase[1]) * amplitude[1];
      meshRef.current.position.z = position[2] + Math.sin(t * speed[2] + phase[2]) * amplitude[2];

      meshRef.current.rotation.x += speed[0] * 0.12 * delta;
      meshRef.current.rotation.y += speed[1] * 0.12 * delta;
      meshRef.current.rotation.z += speed[2] * 0.12 * delta;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        roughness={0.3}
        metalness={0.15}
        distort={0.3}
        speed={1.5}
      />
    </mesh>
  );
}
```

Key changes from current code:
- Import `MeshDistortMaterial` from `@react-three/drei`
- Remove `opacity` prop from interface (no longer variable — blobs are fully opaque)
- Remove `transparent` and `opacity` from material
- Replace `meshStandardMaterial` with `MeshDistortMaterial` (distort=0.3, speed=1.5, roughness=0.3, metalness=0.15)
- Increase sphere segments from `32,32` to `64,64`
- Add slow 3D rotation in `useFrame` using `speed` prop values scaled by `0.12 * delta` (frame-rate independent)

- [ ] **Step 2: Remove opacity prop from BlobScene FloatingBlob usage**

In `src/features/background-effects/BlobScene.tsx`, remove the `opacity={sphereOpacity}` prop from the `<FloatingBlob>` JSX (line 77 in the current file). This keeps TypeScript compilable after the FloatingBlobProps change.

Find and remove this prop from the FloatingBlob usage:
```diff
         <FloatingBlob
           key={i}
           position={blob.position}
           color={blob.color}
           radius={blob.radius}
           speed={blob.speed}
           amplitude={blob.amplitude}
           phase={blob.phase}
-          opacity={sphereOpacity}
         />
```

- [ ] **Step 3: Run existing tests to verify no regressions**

Run: `npx vitest run`
Expected: 5 files, 39 tests, all passing. The `useMouseParallax.test.ts` should be unaffected.

- [ ] **Step 4: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors. Confirms `MeshDistortMaterial` import resolves and the removed `opacity` prop doesn't break BlobScene.

- [ ] **Step 5: Commit**

```bash
git add src/features/background-effects/FloatingBlob.tsx src/features/background-effects/BlobScene.tsx
git commit -m "feat: replace meshStandardMaterial with MeshDistortMaterial for 3D organic blobs

- Use drei's MeshDistortMaterial with distort=0.3, speed=1.5
- Set roughness=0.3, metalness=0.15 for specular highlights
- Increase geometry segments to 64x64 for smooth distortion
- Add slow 3D rotation using speed prop values (frame-rate independent)
- Remove opacity prop (blobs are now fully opaque)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Chunk 2: BlobScene Lighting and Configuration

### Task 2: Update BlobScene — New lighting rig, deeper positions, smaller radii

**Files:**
- Modify: `src/features/background-effects/BlobScene.tsx`

- [ ] **Step 1: Write the updated BlobScene component**

Replace the entire `BlobScene.tsx` with:

```tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { FloatingBlob } from './FloatingBlob';

const BLOB_CONFIG = [
  { position: [-3, 1, -4] as [number, number, number], color: '#a8ff78', radius: 1.6, speed: [0.2, 0.3, 0.15] as [number, number, number], amplitude: [1.5, 1.0, 0.8] as [number, number, number], phase: [0, 0.5, 1.0] as [number, number, number] },
  { position: [3, -1, -5] as [number, number, number], color: '#78d6ff', radius: 1.44, speed: [0.15, 0.2, 0.25] as [number, number, number], amplitude: [1.2, 1.5, 0.6] as [number, number, number], phase: [1.0, 0, 0.7] as [number, number, number] },
  { position: [0, 2, -3] as [number, number, number], color: '#ff78a8', radius: 1.2, speed: [0.25, 0.15, 0.3] as [number, number, number], amplitude: [0.8, 1.2, 1.0] as [number, number, number], phase: [0.3, 1.2, 0] as [number, number, number] },
  { position: [-2, -2, -4] as [number, number, number], color: '#ffd078', radius: 0.96, speed: [0.3, 0.25, 0.2] as [number, number, number], amplitude: [1.0, 0.8, 1.2] as [number, number, number], phase: [0.7, 0.3, 1.5] as [number, number, number] },
  { position: [2, 0, -6] as [number, number, number], color: '#d078ff', radius: 1.76, speed: [0.1, 0.2, 0.15] as [number, number, number], amplitude: [1.8, 1.0, 0.5] as [number, number, number], phase: [1.5, 0.8, 0.2] as [number, number, number] },
  { position: [0, -1, -5] as [number, number, number], color: '#78ffd0', radius: 0.72, speed: [0.35, 0.15, 0.25] as [number, number, number], amplitude: [0.6, 1.5, 1.0] as [number, number, number], phase: [0.2, 1.0, 0.5] as [number, number, number] },
];

interface BlobSceneProps {
  mouseX: number;
  mouseY: number;
}

function CameraParallax({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0 });

  useFrame(() => {
    targetRef.current.x = mouseX * 0.3;
    targetRef.current.y = -mouseY * 0.3;
    // eslint-disable-next-line react-hooks/immutability -- R3F requires direct camera mutation in useFrame
    camera.position.x += (targetRef.current.x - camera.position.x) * 0.05;
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function useThemeConfig() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') !== 'light'
  );

  useEffect(() => {
    const html = document.documentElement;

    const observer = new MutationObserver(() => {
      setIsDark(html.getAttribute('data-theme') !== 'light');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return {
    bloomIntensity: isDark ? 1.5 : 0.8,
    ambientIntensity: isDark ? 0.3 : 0.5,
    keyLightIntensity: isDark ? 1.2 : 0.9,
    rimLightIntensity: isDark ? 0.7 : 0.5,
  };
}

export function BlobScene({ mouseX, mouseY }: BlobSceneProps) {
  const { bloomIntensity, ambientIntensity, keyLightIntensity, rimLightIntensity } = useThemeConfig();

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[5, 5, 5]} intensity={keyLightIntensity} />
      <directionalLight position={[-3, -2, -5]} intensity={rimLightIntensity} />

      {BLOB_CONFIG.map((blob, i) => (
        <FloatingBlob
          key={i}
          position={blob.position}
          color={blob.color}
          radius={blob.radius}
          speed={blob.speed}
          amplitude={blob.amplitude}
          phase={blob.phase}
        />
      ))}

      <CameraParallax mouseX={mouseX} mouseY={mouseY} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={bloomIntensity}
        />
      </EffectComposer>
    </>
  );
}
```

Key changes from current code:
- **BLOB_CONFIG**: Each blob's Z position shifted by -2 (e.g., -2→-4, -3→-5, -1→-3, -4→-6). Radii reduced by 20% (e.g., 2.0→1.6, 1.8→1.44, 1.5→1.2, etc.)
- **Lighting**: Replaced `pointLight` with two `directionalLight` (key at `[5,5,5]` and rim at `[-3,-2,-5]`). Ambient intensity changed from 0.4/0.6 to 0.3/0.5.
- **useThemeConfig**: Removed `sphereOpacity` (blobs are fully opaque). Added `keyLightIntensity` (1.2/0.9) and `rimLightIntensity` (0.7/0.5).
- **FloatingBlob usage**: Removed the `opacity` prop from the JSX.
- **CameraParallax**: Unchanged.
- **Bloom**: Unchanged.

- [ ] **Step 2: Run existing tests to verify no regressions**

Run: `npx vitest run`
Expected: 5 files, 39 tests, all passing.

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Run ESLint**

Run: `npx eslint src/features/background-effects/`
Expected: No errors (existing eslint-disable comment for camera mutation is preserved).

- [ ] **Step 5: Commit**

```bash
git add src/features/background-effects/BlobScene.tsx
git commit -m "feat: add 3-light rig and push blobs deeper for strong 3D effect

- Replace pointLight with key + rim directionalLights
- Theme-adaptive intensities for all lights
- Push blob Z positions deeper by -2 units
- Reduce blob radii by 20% (opaque blobs need less screen space)
- Remove sphereOpacity from theme config (blobs now fully opaque)
- Remove opacity prop from FloatingBlob usage

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Chunk 3: Final Verification

### Task 3: Full verification pass

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: 5 files, 39 tests, all passing.

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Run ESLint on changed files**

Run: `npx eslint src/features/background-effects/FloatingBlob.tsx src/features/background-effects/BlobScene.tsx`
Expected: No errors.

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Visual verification**

Run: `npm run dev`
Open http://localhost:3000 in browser.

Verify:
- Blobs are fully opaque (no see-through transparency)
- Blobs appear as organic, wobbly 3D shapes (not flat circles)
- Blobs slowly rotate, showing different surface angles
- Specular highlights visible on blob surfaces from key light
- Rim/edge highlights visible from back light
- Blobs sit behind content (deeper in scene)
- Bloom glow visible around blob edges
- Mouse parallax still works
- Theme toggle still adapts lighting/bloom
- Reduced motion fallback still works (test via browser DevTools → Rendering → prefers-reduced-motion: reduce)
