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
