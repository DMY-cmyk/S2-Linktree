'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ?? 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const stored = localStorage.getItem('s2-linktree-theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('s2-linktree-theme', next);
  };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className="px-3 py-1.5 text-sm font-bold border-2 border-[var(--border-color)] rounded-lg bg-[#ffd078] text-[#222] shadow-[2px_2px_0px_var(--border-color)] cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      data-testid="theme-toggle"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </motion.button>
  );
}
