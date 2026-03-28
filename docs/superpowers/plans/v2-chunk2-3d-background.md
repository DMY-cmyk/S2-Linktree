# Chunk 2: 3D Animated Background

> **Spec:** `docs/superpowers/specs/2026-03-28-s2-linktree-v2-design.md` — Section 3
> **Depends on:** Chunk 1 (CSS layers + content-layer wrapper must be in place)

## Task 6: Create useMouseParallax hook with tests

**Files:**
- Create: `src/features/background-effects/useMouseParallax.ts`
- Create: `src/features/background-effects/useMouseParallax.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/features/background-effects/useMouseParallax.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMouseParallax } from './useMouseParallax';

describe('useMouseParallax', () => {
  beforeEach(() => {
    // Set window dimensions for normalization
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
  });

  it('returns {0, 0} initially', () => {
    const { result } = renderHook(() => useMouseParallax());
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('returns normalized coordinates on mousemove', () => {
    const { result } = renderHook(() => useMouseParallax());
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 400 }));
    });
    // Center of 1000x800 → (0, 0) normalized
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('returns -1 at top-left corner', () => {
    const { result } = renderHook(() => useMouseParallax());
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    });
    expect(result.current.x).toBe(-1);
    expect(result.current.y).toBe(-1);
  });

  it('returns 1 at bottom-right corner', () => {
    const { result } = renderHook(() => useMouseParallax());
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1000, clientY: 800 }));
    });
    expect(result.current.x).toBe(1);
    expect(result.current.y).toBe(1);
  });

  it('cleans up event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useMouseParallax());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    removeSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/features/background-effects/useMouseParallax.test.ts`
Expected: FAIL — `Cannot find module './useMouseParallax'`

- [ ] **Step 3: Implement the hook**

Create `src/features/background-effects/useMouseParallax.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useMouseParallax(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setPosition({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return position;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/features/background-effects/useMouseParallax.test.ts`
Expected: `Tests 5 passed (5)`

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 29 passed (29)` (24 existing + 5 new)

- [ ] **Step 6: Commit**

```bash
git add src/features/background-effects/useMouseParallax.ts src/features/background-effects/useMouseParallax.test.ts
git commit -m "feat: add useMouseParallax hook with normalized coordinate tracking

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 7: Create FloatingBlob component

**Files:**
- Create: `src/features/background-effects/FloatingBlob.tsx`

> Note: This is a Three.js/R3F component that renders a 3D sphere. It cannot be unit-tested in jsdom (no WebGL). Verification is via TypeScript compilation and build.

- [ ] **Step 1: Create FloatingBlob component**

Create `src/features/background-effects/FloatingBlob.tsx`:

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

interface FloatingBlobProps {
  position: [number, number, number];
  color: string;
  radius: number;
  speed: [number, number, number];
  amplitude: [number, number, number];
  phase: [number, number, number];
  opacity: number;
}

export function FloatingBlob({
  position,
  color,
  radius,
  speed,
  amplitude,
  phase,
  opacity,
}: FloatingBlobProps) {
  const meshRef = useRef<Mesh | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = position[0] + Math.sin(t * speed[0] + phase[0]) * amplitude[0];
      meshRef.current.position.y = position[1] + Math.sin(t * speed[1] + phase[1]) * amplitude[1];
      meshRef.current.position.z = position[2] + Math.sin(t * speed[2] + phase[2]) * amplitude[2];
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.9}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors (Note: `npx next build` won't type-check orphan files — use tsc directly)

- [ ] **Step 3: Commit**

```bash
git add src/features/background-effects/FloatingBlob.tsx
git commit -m "feat: add FloatingBlob 3D sphere component with sine-based motion

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 8: Create BlobScene component

**Files:**
- Create: `src/features/background-effects/BlobScene.tsx`

- [ ] **Step 1: Create BlobScene component**

Create `src/features/background-effects/BlobScene.tsx`:

```typescript
'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { FloatingBlob } from './FloatingBlob';

const BLOB_CONFIG = [
  { position: [-3, 1, -2] as [number, number, number], color: '#a8ff78', radius: 2.0, speed: [0.2, 0.3, 0.15] as [number, number, number], amplitude: [1.5, 1.0, 0.8] as [number, number, number], phase: [0, 0.5, 1.0] as [number, number, number] },
  { position: [3, -1, -3] as [number, number, number], color: '#78d6ff', radius: 1.8, speed: [0.15, 0.2, 0.25] as [number, number, number], amplitude: [1.2, 1.5, 0.6] as [number, number, number], phase: [1.0, 0, 0.7] as [number, number, number] },
  { position: [0, 2, -1] as [number, number, number], color: '#ff78a8', radius: 1.5, speed: [0.25, 0.15, 0.3] as [number, number, number], amplitude: [0.8, 1.2, 1.0] as [number, number, number], phase: [0.3, 1.2, 0] as [number, number, number] },
  { position: [-2, -2, -2] as [number, number, number], color: '#ffd078', radius: 1.2, speed: [0.3, 0.25, 0.2] as [number, number, number], amplitude: [1.0, 0.8, 1.2] as [number, number, number], phase: [0.7, 0.3, 1.5] as [number, number, number] },
  { position: [2, 0, -4] as [number, number, number], color: '#d078ff', radius: 2.2, speed: [0.1, 0.2, 0.15] as [number, number, number], amplitude: [1.8, 1.0, 0.5] as [number, number, number], phase: [1.5, 0.8, 0.2] as [number, number, number] },
  { position: [0, -1, -3] as [number, number, number], color: '#78ffd0', radius: 0.9, speed: [0.35, 0.15, 0.25] as [number, number, number], amplitude: [0.6, 1.5, 1.0] as [number, number, number], phase: [0.2, 1.0, 0.5] as [number, number, number] },
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
    camera.position.x += (targetRef.current.x - camera.position.x) * 0.05;
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function useThemeConfig() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    setIsDark(html.getAttribute('data-theme') !== 'light');

    const observer = new MutationObserver(() => {
      setIsDark(html.getAttribute('data-theme') !== 'light');
    });
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return {
    sphereOpacity: isDark ? 0.25 : 0.15,
    bloomIntensity: isDark ? 1.5 : 0.8,
    ambientIntensity: isDark ? 0.4 : 0.6,
  };
}

export function BlobScene({ mouseX, mouseY }: BlobSceneProps) {
  const { sphereOpacity, bloomIntensity, ambientIntensity } = useThemeConfig();

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <pointLight position={[0, 5, 5]} intensity={1.0} />

      {BLOB_CONFIG.map((blob, i) => (
        <FloatingBlob
          key={i}
          position={blob.position}
          color={blob.color}
          radius={blob.radius}
          speed={blob.speed}
          amplitude={blob.amplitude}
          phase={blob.phase}
          opacity={sphereOpacity}
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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/background-effects/BlobScene.tsx
git commit -m "feat: add BlobScene with 6 floating blobs, bloom, parallax, theme adaptation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 9: Create AnimatedBackground wrapper

**Files:**
- Create: `src/features/background-effects/AnimatedBackground.tsx`

- [ ] **Step 1: Create the AnimatedBackground component**

Create `src/features/background-effects/AnimatedBackground.tsx`:

```typescript
'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { BlobScene } from './BlobScene';
import { useMouseParallax } from './useMouseParallax';

function ReducedMotionFallback() {
  return (
    <div className="reduced-motion-fallback absolute inset-0">
      <div className="absolute w-32 h-32 rounded-full bg-[#a8ff78] opacity-10 blur-3xl top-1/4 left-1/4" />
      <div className="absolute w-40 h-40 rounded-full bg-[#78d6ff] opacity-10 blur-3xl top-1/3 right-1/4" />
      <div className="absolute w-24 h-24 rounded-full bg-[#ff78a8] opacity-10 blur-3xl bottom-1/4 left-1/3" />
      <div className="absolute w-36 h-36 rounded-full bg-[#d078ff] opacity-10 blur-3xl bottom-1/3 right-1/3" />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-card)]" />
  );
}

export function AnimatedBackground() {
  const { x: mouseX, y: mouseY } = useMouseParallax();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="bg-canvas-layer">
      {prefersReducedMotion ? (
        <ReducedMotionFallback />
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 10], fov: 50 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true }}
          >
            <BlobScene mouseX={mouseX} mouseY={mouseY} />
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/background-effects/AnimatedBackground.tsx
git commit -m "feat: add AnimatedBackground with R3F Canvas, reduced-motion fallback

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 10: Integrate AnimatedBackground into HomePage

**Files:**
- Modify: `src/features/home/HomePage.tsx`

- [ ] **Step 1: Add dynamic import for AnimatedBackground**

At the top of `src/features/home/HomePage.tsx`, add after the existing imports:

```typescript
import dynamic from 'next/dynamic';

const AnimatedBackground = dynamic(
  () => import('@/features/background-effects/AnimatedBackground').then((mod) => ({ default: mod.AnimatedBackground })),
  { ssr: false }
);
```

- [ ] **Step 2: Render AnimatedBackground before the content-layer div**

In the return JSX of HomePage, wrap the existing content in a fragment and add AnimatedBackground before it:

```tsx
// BEFORE:
return (
  <div className="content-layer min-h-screen bg-[var(--bg-primary)]">
    {/* Header */}
    ...
  </div>
);

// AFTER:
return (
  <>
    <AnimatedBackground />
    <div className="content-layer min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      ...
    </div>
  </>
);
```

- [ ] **Step 3: Verify build succeeds**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 4: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 29 passed (29)`

- [ ] **Step 5: Commit**

```bash
git add src/features/home/HomePage.tsx
git commit -m "feat: integrate AnimatedBackground into HomePage via dynamic import

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 11: Visual verification of 3D background

- [ ] **Step 1: Start dev server and verify in browser**

Run: `npm run dev`
Open: `http://localhost:3000`

Verify:
- [ ] 3D floating blobs visible behind content in dark theme
- [ ] Switch to light theme → blobs become more transparent, bloom softens
- [ ] Mouse movement causes subtle camera parallax
- [ ] Content (header, cards) is fully interactive above the background
- [ ] No console errors related to WebGL or Three.js

- [ ] **Step 2: Run production build**

Run: `npx next build`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Run full test suite**

Run: `npx vitest run`
Expected: `Tests 29 passed (29)`

- [ ] **Step 4: Commit (no code changes — just verification checkpoint)**

No commit needed if no changes. If any fixes were needed during visual verification, commit those fixes.
