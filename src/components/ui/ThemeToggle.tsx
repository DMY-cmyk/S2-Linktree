'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';
const KEY = 's2-linktree-theme';

function readInitial(): Theme {
  if (typeof window === 'undefined') return 'light';
  const raw = localStorage.getItem(KEY);
  if (raw === 'light' || raw === 'dark') return raw;
  if (raw === 'system') {
    const next: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
    localStorage.setItem(KEY, next);
    return next;
  }
  localStorage.setItem(KEY, 'light');
  return 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const initial = readInitial();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      data-testid="theme-toggle"
      style={{
        width: 34, height: 34, display: 'grid', placeItems: 'center',
        background: 'var(--surface)', color: 'var(--text)',
        border: '1.5px solid var(--border-soft)', borderRadius: 8,
        cursor: 'pointer',
      }}
    >
      {theme === 'dark' ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
    </button>
  );
}
