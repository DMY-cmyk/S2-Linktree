'use client';

import { type CSSProperties } from 'react';
import { useLinkStore } from '@/store/useLinkStore';
import { useTweaksStore } from '@/store/useTweaksStore';
import { useHydrated } from '@/hooks/useHydrated';
import { formatRelative } from '@/lib/utils';

export function HeroSection() {
  const categories = useLinkStore((s) => s.categories);
  const links = useLinkStore((s) => s.links);
  const lastUpdatedAt = useLinkStore((s) => s.lastUpdatedAt);

  const hydrated = useHydrated();
  const heroVariant = useTweaksStore((s) => s.heroVariant);
  const minimal = hydrated && heroVariant === 'minimal';

  return (
    <section style={{ padding: '60px 0 34px', position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
      {/* eyebrow + live status dot */}
      <div className="pill" style={{ marginBottom: 22 }}>
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--success)',
            boxShadow: '0 0 0 4px color-mix(in srgb, var(--success) 25%, transparent)',
            animation: 'pulse-dot 2.4s ease-in-out infinite',
          }}
        />
        Live · Program Magister · TA 2025/26
      </div>

      <h1
        className="serif"
        style={{
          margin: 0, fontWeight: 400,
          fontSize: 'clamp(52px, 7vw, 92px)', lineHeight: 0.96,
          letterSpacing: '-0.025em', color: 'var(--text)', maxWidth: 920,
        }}
      >
        Resource hub
        <br />
        <span style={{ fontStyle: 'italic' }}>for the long haul</span>
        <span style={{ color: 'var(--accent)' }}>.</span>
      </h1>

      <p style={{ margin: '22px 0 0', fontSize: 17.5, lineHeight: 1.55, color: 'var(--text-2)', maxWidth: 600 }}>
        Classroom, jadwal, dan folder belajar untuk empat semester — diatur sekali, mudah dicari selamanya.
      </p>

      {!minimal && (
        <div
          style={{
            marginTop: 38, display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14,
          }}
        >
          <StatTile label="Categories" value={String(categories.length)} accent="#1f7a4c" emoji="🗂" />
          <StatTile label="Links" value={String(links.length)} accent="#1664b0" emoji="🔖" />
          <StatTile label="This week" value="4" accent="#c2347a" emoji="📌" sublabel="due / pending" />
          <StatTile label="Last updated" value={formatRelative(lastUpdatedAt)} accent="#b07a06" emoji="🕒" sublabel="auto-tracked" />
        </div>
      )}
    </section>
  );
}

function StatTile({
  label, value, accent, emoji, sublabel,
}: {
  label: string; value: string; accent: string; emoji: string; sublabel?: string;
}) {
  return (
    <div className="fade-up" style={tileStyle(accent)}>
      <div style={chipStyle}>{emoji}</div>
      <div className="mono" style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-2)' }}>
        {label}
      </div>
      <div className="serif" style={{ marginTop: 26, fontWeight: 400, fontSize: 38, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text)' }}>
        {value}
      </div>
      {sublabel && (
        <div className="mono" style={{ marginTop: 6, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

const tileStyle = (accent: string): CSSProperties => ({
  position: 'relative', overflow: 'hidden',
  padding: '18px 18px 16px',
  borderRadius: 14, border: '1.5px solid var(--border-soft)',
  background: `radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, ${accent} 22%, var(--paper)) 0%, var(--paper) 55%)`,
  boxShadow: '0 1px 0 color-mix(in srgb, var(--shadow-color) 5%, transparent), 0 12px 24px -18px color-mix(in srgb, var(--shadow-color) 30%, transparent)',
});

const chipStyle: CSSProperties = {
  position: 'absolute', top: 12, right: 12,
  width: 36, height: 36, display: 'grid', placeItems: 'center',
  background: 'var(--paper)', border: '1.5px solid var(--border-soft)', borderRadius: 9,
  boxShadow: '0 4px 0 -2px color-mix(in srgb, var(--shadow-color) 18%, transparent)',
  fontSize: 18,
};
