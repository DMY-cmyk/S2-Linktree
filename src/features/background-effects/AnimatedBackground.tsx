'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { BlobScene } from './BlobScene';
import { useMouseParallax } from './useMouseParallax';
import { useDeviceCapability, type QualityLevel } from '@/hooks/useDeviceCapability';

const DPR_MAP: Record<QualityLevel, [number, number]> = {
  high: [1, 2],
  mid: [1, 1.5],
  low: [1, 1],
};

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

function GradientFallback() {
  return <div className="absolute inset-0 bg-aurora-gradient" />;
}

export function AnimatedBackground() {
  const { x: mouseX, y: mouseY } = useMouseParallax();
  const quality = useDeviceCapability();
  const [showCanvas, setShowCanvas] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Progressive load: defer 3D canvas until browser is idle
  useEffect(() => {
    if (prefersReducedMotion || quality === 'low') return;
    const load = () => setShowCanvas(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(load, 100);
    return () => clearTimeout(id);
  }, [prefersReducedMotion, quality]);

  // Pause when tab is hidden
  useEffect(() => {
    const handleVisibility = () => setIsIdle(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Idle after 5s of no mouse movement
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsIdle(true), 5000);
    };
    window.addEventListener('mousemove', resetIdle);
    timer = setTimeout(() => setIsIdle(true), 5000);
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-canvas-layer">
      {/* CSS gradient fallback — always visible beneath canvas */}
      <GradientFallback />

      {prefersReducedMotion ? (
        <ReducedMotionFallback />
      ) : showCanvas ? (
        <Suspense fallback={null}>
          <Canvas
            className="canvas-fade-in"
            dpr={DPR_MAP[quality]}
            camera={{ position: [0, 0, 10], fov: 50 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: quality === 'high' }}
            frameloop={isIdle ? 'demand' : 'always'}
          >
            <BlobScene mouseX={mouseX} mouseY={mouseY} quality={quality} />
          </Canvas>
        </Suspense>
      ) : null}
    </div>
  );
}
