interface Props { title: string; count: number; }
export function GroupHeader({ title, count }: Props) {
  return (
    <div style={{
      gridColumn: '1 / -1', display: 'flex', alignItems: 'baseline',
      gap: 12, padding: '20px 0 4px',
    }}>
      <h2 className="mono" style={{
        margin: 0, fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        color: 'var(--text-2)',
      }}>{title}</h2>
      <span style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
      <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>
        {String(count).padStart(2, '0')}
      </span>
    </div>
  );
}
