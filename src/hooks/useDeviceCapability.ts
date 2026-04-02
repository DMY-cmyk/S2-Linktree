'use client';

import { useState, useEffect } from 'react';

export type QualityLevel = 'high' | 'mid' | 'low';

function hasDedicatedGPU(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return false;
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
    return /nvidia|radeon|geforce|rtx|gtx|rx\s?\d/i.test(renderer);
  } catch {
    return false;
  }
}

export function useDeviceCapability(): QualityLevel {
  const [quality, setQuality] = useState<QualityLevel>('mid');

  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency || 2;
    const gpu = hasDedicatedGPU();

    if (dpr >= 2 && cores >= 12 && gpu) {
      setQuality('high');
    } else if (dpr < 1.5 || cores <= 2) {
      setQuality('low');
    } else {
      setQuality('mid');
    }
  }, []);

  return quality;
}
