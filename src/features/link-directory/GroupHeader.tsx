interface Props { title: string; count: number; index?: number; }

export function GroupHeader({ title, count, index }: Props) {
  return (
    <div style={{
      gridColumn: '1 / -1', display: 'flex', alignItems: 'baseline',
      gap: 16, padding: '32px 0 14px',
    }}>
      {index != null && (
        <span className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: 'var(--text-3)' }}>
          {String(index).padStart(2, '0')}
        </span>
      )}
      <h2 className="mono" style={{
        margin: 0, fontSize: 12, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.20em',
        color: 'var(--text)',
      }}>{title}</h2>
      <span style={{ flex: 1, height: 1.5, background: 'var(--border-soft)' }} />
      <span className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: 'var(--text-3)', display: 'inline-flex', gap: 6 }}>
        <span>{String(count).padStart(2, '0')}</span>
        <span style={{ color: 'var(--text-3)' }}>{count === 1 ? 'item' : 'items'}</span>
      </span>
    </div>
  );
}
