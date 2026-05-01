'use client';

import { useLinkStore } from '@/store/useLinkStore';
import { formatRelative } from '@/lib/utils';

export function HeroSection() {
  const categories = useLinkStore((s) => s.categories);
  const links = useLinkStore((s) => s.links);
  const lastUpdatedAt = useLinkStore((s) => s.lastUpdatedAt);

  return (
    <section style={{ padding: '44px 0 32px', maxWidth: 1100, margin: '0 auto' }}>
      <div className="mono" style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontSize: 11, fontWeight: 500,
        color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.12em',
        background: 'var(--surface)', border: '1.5px solid var(--border-soft)',
        borderRadius: 999, padding: '5px 12px',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
        Program Magister · TA 2025/26
      </div>
      <h1 style={{
        margin: '20px 0 10px', fontSize: 64, fontWeight: 800,
        letterSpacing: '-0.04em', lineHeight: 0.95,
      }}>
        Resource hub<br />
        <span style={{ color: 'var(--text-3)' }}>for the long haul.</span>
      </h1>
      <p style={{ margin: 0, fontSize: 17, color: 'var(--text-2)', maxWidth: 560, lineHeight: 1.5 }}>
        Classroom, jadwal, dan folder belajar untuk empat semester — diatur sekali, mudah dicari selamanya.
      </p>
      <div className="mono" style={{
        marginTop: 28, display: 'flex', gap: 24, alignItems: 'center',
        fontSize: 12, color: 'var(--text-2)', flexWrap: 'wrap',
      }}>
        <Stat label="Categories" value={String(categories.length)} />
        <Divider />
        <Stat label="Links" value={String(links.length)} />
        <Divider />
        <Stat label="Last updated" value={formatRelative(lastUpdatedAt)} />
      </div>
    </section>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>{value}</div>
    <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 10 }}>{label}</div>
  </div>
);
const Divider = () => <div style={{ width: 1, height: 32, background: 'var(--border-soft)' }} />;
