'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor } from 'lucide-react';

type ThemePreference = 'light' | 'dark' | 'system';

function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference === 'system') {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return preference;
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem('s2-linktree-theme') as ThemePreference | null;
    return stored ?? 'system';
  });

  useEffect(() => {
    const stored = localStorage.getItem('s2-linktree-theme') as ThemePreference | null;
    if (stored) {
      setPreference(stored);
      document.documentElement.setAttribute('data-theme', resolveTheme(stored));
    }
  }, []);

  const cycle = () => {
    const next: ThemePreference = preference === 'light' ? 'dark' : preference === 'dark' ? 'system' : 'light';
    setPreference(next);
    document.documentElement.setAttribute('data-theme', resolveTheme(next));
    localStorage.setItem('s2-linktree-theme', next);
  };

  const ariaLabel = preference === 'light'
    ? 'Switch to dark mode'
    : preference === 'dark'
    ? 'Switch to system theme'
    : 'Switch to light mode';

  return (
    <motion.button
      onClick={cycle}
      whileHover={{ rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className="px-3 py-1.5 text-sm font-bold border-2 border-[var(--border-color)] rounded-lg bg-[var(--color-warning)] text-[var(--color-on-warning)] shadow-[2px_2px_0px_var(--border-color)] cursor-pointer"
      aria-label={ariaLabel}
      data-testid="theme-toggle"
    >
      {preference === 'light' ? '☀️' : preference === 'dark' ? '🌙' : <Monitor size={16} strokeWidth={2.5} />}
    </motion.button>
  );
}
