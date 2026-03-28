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
