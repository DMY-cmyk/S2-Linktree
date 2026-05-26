'use client';

import { useEffect } from 'react';
import { useTweaksStore } from '@/store/useTweaksStore';

/**
 * Applies the non-theme tweaks (accent override, density) to the document.
 * These drive CSS only — no React markup — so they're safe to set in an effect
 * without risking a hydration mismatch. Theme is handled separately via the
 * boot script + `useTheme`.
 */
export function TweaksEffects() {
  const accent = useTweaksStore((s) => s.accent);
  const density = useTweaksStore((s) => s.density);

  useEffect(() => {
    const root = document.documentElement;
    if (accent) root.style.setProperty('--accent', accent);
    else root.style.removeProperty('--accent');
  }, [accent]);

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  return null;
}
