'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { FloatingBlob } from './FloatingBlob';
import type { QualityLevel } from '@/hooks/useDeviceCapability';

const BLOB_CONFIG = [
  { position: [-3, 1, -2] as [number, number, number], color: '#a8ff78', radius: 1.6, speed: [0.2, 0.3, 0.15] as [number, number, number], amplitude: [1.5, 1.0, 0.8] as [number, number, number], phase: [0, 0.5, 1.0] as [number, number, number] },
  { position: [3, -1, -5] as [number, number, number], color: '#78d6ff', radius: 1.44, speed: [0.15, 0.2, 0.25] as [number, number, number], amplitude: [1.2, 1.5, 0.6] as [number, number, number], phase: [1.0, 0, 0.7] as [number, number, number] },
  { position: [0, 2, -8] as [number, number, number], color: '#ff78a8', radius: 1.0, speed: [0.25, 0.15, 0.3] as [number, number, number], amplitude: [0.8, 1.2, 1.0] as [number, number, number], phase: [0.3, 1.2, 0] as [number, number, number] },
  { position: [-2, -2, -9] as [number, number, number], color: '#d078ff', radius: 0.8, speed: [0.3, 0.25, 0.2] as [number, number, number], amplitude: [1.0, 0.8, 1.2] as [number, number, number], phase: [0.7, 0.3, 1.5] as [number, number, number] },
];

interface BlobSceneProps {
  mouseX: number;
  mouseY: number;
  quality?: QualityLevel;
}

const SEGMENTS: Record<QualityLevel, number> = { high: 32, mid: 20, low: 12 };
const BLOB_COUNT: Record<QualityLevel, number> = { high: 4, mid: 3, low: 2 };

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
    emissiveIntensity: isDark ? 0.4 : 0.2,
    ambientIntensity: isDark ? 0.3 : 0.5,
    keyLightIntensity: isDark ? 1.2 : 0.9,
    rimLightIntensity: isDark ? 0.7 : 0.5,
  };
}

export function BlobScene({ mouseX, mouseY, quality = 'mid' }: BlobSceneProps) {
  const { emissiveIntensity, ambientIntensity, keyLightIntensity, rimLightIntensity } = useThemeConfig();
  const segments = SEGMENTS[quality];
  const blobs = BLOB_CONFIG.slice(0, BLOB_COUNT[quality]);

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[5, 5, 5]} intensity={keyLightIntensity} />
      <directionalLight position={[-3, -2, -5]} intensity={rimLightIntensity} />

      {blobs.map((blob, i) => (
        <FloatingBlob
          key={i}
          position={blob.position}
          color={blob.color}
          radius={blob.radius}
          speed={blob.speed}
          amplitude={blob.amplitude}
          phase={blob.phase}
          segments={segments}
          emissiveIntensity={emissiveIntensity}
        />
      ))}

      <CameraParallax mouseX={mouseX} mouseY={mouseY} />
    </>
  );
}
