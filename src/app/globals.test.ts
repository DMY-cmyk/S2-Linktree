import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const css = readFileSync(join(__dirname, 'globals.css'), 'utf8');

describe('globals.css polished tokens', () => {
  it('defines warm-paper light palette', () => {
    expect(css).toMatch(/--bg:\s*#fbf9f4/);
    expect(css).toMatch(/--accent:\s*#6d3aed/);
    expect(css).toMatch(/--surface:\s*#ffffff/);
    expect(css).toMatch(/--border-soft:\s*#d8d3c6/);
  });
  it('defines deep-navy dark palette', () => {
    expect(css).toMatch(/\[data-theme="dark"\]/);
    expect(css).toMatch(/--bg:\s*#0e0f1a/);
    expect(css).toMatch(/--accent:\s*#b497ff/);
  });
  it('defines orb keyframes', () => {
    for (const k of ['float', 'float-alt', 'float-slow', 'pulse-glow', 'fade-up']) {
      expect(css).toMatch(new RegExp(`@keyframes\\s+${k}\\b`));
    }
  });
  it('defines reduced-motion override for .animated-bg', () => {
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce[\s\S]*\.animated-bg/);
  });
  it('removes legacy aurora keyframes', () => {
    expect(css).not.toMatch(/@keyframes\s+aurora/);
  });
});
