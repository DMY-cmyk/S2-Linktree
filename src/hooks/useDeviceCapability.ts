'use client';

import { useState, useEffect } from 'react';

export type QualityLevel = 'high' | 'mid' | 'low';

export function useDeviceCapability(): QualityLevel {
  const [quality, setQuality] = useState<QualityLevel>('mid');

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency || 2;

    if (dpr >= 2 && cores >= 8) {
      setQuality('high');
    } else if (dpr < 1.5 || cores <= 2) {
      setQuality('low');
    } else {
      setQuality('mid');
    }
  }, []);

  return quality;
}
