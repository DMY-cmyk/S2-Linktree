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
  segments?: number;
  emissiveIntensity?: number;
}

export function FloatingBlob({
  position,
  color,
  radius,
  speed,
  amplitude,
  phase,
  segments = 20,
  emissiveIntensity = 0.3,
}: FloatingBlobProps) {
  const meshRef = useRef<Mesh | null>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      // Dual-sine for organic motion: primary wave + secondary harmonic
      meshRef.current.position.x = position[0]
        + Math.sin(t * speed[0] + phase[0]) * amplitude[0]
        + Math.sin(t * speed[0] * 1.7 + phase[2]) * amplitude[0] * 0.3;
      meshRef.current.position.y = position[1]
        + Math.sin(t * speed[1] + phase[1]) * amplitude[1]
        + Math.sin(t * speed[1] * 2.3 + phase[0]) * amplitude[1] * 0.25;
      meshRef.current.position.z = position[2]
        + Math.sin(t * speed[2] + phase[2]) * amplitude[2];

      meshRef.current.rotation.x += speed[0] * 0.08 * delta;
      meshRef.current.rotation.y += speed[1] * 0.08 * delta;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, segments, segments]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.4}
        metalness={0.1}
        transparent
        opacity={0.7}
        distort={0.2}
        speed={1.0}
      />
    </mesh>
  );
}
