'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 's2-linktree-theme';

function subscribe(callback: () => void): () => void {
  const ob = new MutationObserver(callback);
  ob.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => ob.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

/**
 * Reads/writes the document `data-theme` attribute (same channel the inline
 * boot script and ThemeToggle use) and stays in sync via a MutationObserver, so
 * any number of theme controls — the header toggle, the tweaks panel — agree.
 */
export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable — attribute change still drives the UI */
    }
  }, []);

  return [theme, setTheme];
}
