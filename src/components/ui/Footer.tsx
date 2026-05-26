export function Footer() {
  return (
    <footer
      style={{
        maxWidth: 1180, margin: '80px auto 28px', padding: '28px 24px',
        borderTop: '1.5px solid var(--border-soft)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}
    >
      <div
        className="mono"
        style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)' }}
      >
        S2-LINKTREE · POLISHED · v5.0
      </div>
      <div
        className="mono"
        style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 11, color: 'var(--text-3)' }}
      >
        <span>↑ ↓ ← → navigate</span>
        <span>⌘K search</span>
        <span>E edit · D delete</span>
      </div>
    </footer>
  );
}
