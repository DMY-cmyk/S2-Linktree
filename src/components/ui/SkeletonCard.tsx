export function SkeletonCard() {
  return (
    <div
      data-testid="skeleton-card"
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border-soft)',
        borderRadius: 14,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="animate-shimmer" style={{ height: 24, width: 24, borderRadius: 6 }} />
        <div className="animate-shimmer" style={{ height: 18, width: 96, borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="animate-shimmer" style={{ height: 14, width: '100%', borderRadius: 4 }} />
        <div className="animate-shimmer" style={{ height: 14, width: '75%', borderRadius: 4 }} />
        <div className="animate-shimmer" style={{ height: 14, width: '50%', borderRadius: 4 }} />
      </div>
    </div>
  );
}
