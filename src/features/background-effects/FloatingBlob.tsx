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
