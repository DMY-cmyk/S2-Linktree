'use client';

interface Props { theme: 'light' | 'dark'; }

const PALETTE = {
  light: ['#6d3aed', '#0284c7', '#db2777', '#ea580c'] as const,
  dark:  ['#7c3aed', '#06b6d4', '#db2777', '#ea580c'] as const,
};

const ORBS = [
  { size: 400, left: '10%', top: '15%', dur: 25, anim: 'float' },
  { size: 350, left: '75%', top: '60%', dur: 30, anim: 'float-alt' },
  { size: 320, left: '50%', top: '40%', dur: 28, anim: 'float-slow' },
  { size: 280, left: '25%', top: '75%', dur: 22, anim: 'float-alt' },
] as const;

export function CssOrbs({ theme }: Props) {
  const colors = PALETTE[theme];
  return (
    <div className="animated-bg" aria-hidden>
      {ORBS.map((o, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: o.size, height: o.size, left: o.left, top: o.top,
          background: `radial-gradient(circle, var(--orb-${i}, ${colors[i]}) 0%, transparent 70%)`,
          opacity: 0.25,
          borderRadius: '50%',
          animation: `${o.anim} ${o.dur}s ease-in-out infinite, pulse-glow ${o.dur * 0.6}s ease-in-out infinite`,
          willChange: 'transform, opacity',
        }} />
      ))}
      <div style={{
        position: 'absolute', width: 600, height: 600, left: '60%', top: '10%',
        background: `conic-gradient(from 45deg, transparent, ${theme === 'dark' ? '#a855f7' : '#6d3aed'}08, transparent)`,
        borderRadius: '40%',
        animation: 'float-slow 35s ease-in-out infinite reverse',
        willChange: 'transform',
      }} />
    </div>
  );
}
