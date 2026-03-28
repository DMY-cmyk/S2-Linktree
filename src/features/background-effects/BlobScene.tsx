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
