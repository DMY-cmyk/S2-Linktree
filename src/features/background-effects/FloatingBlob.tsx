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
}

export function FloatingBlob({
  position,
  color,
  radius,
  speed,
  amplitude,
  phase,
  segments = 64,
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
      <sphereGeometry args={[radius, segments, segments]} />
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
