export function Footer() {
  return (
    <footer className="mono" style={{
      maxWidth: 1100, margin: '60px auto 32px', padding: 24,
      borderTop: '1.5px solid var(--border-soft)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 11, color: 'var(--text-3)',
      flexWrap: 'wrap', gap: 12,
    }}>
      <div>S2-LINKTREE · POLISHED · v5.0</div>
      <div style={{ display: 'flex', gap: 16 }}>
        <span>↑ ↓ ← → navigate</span>
        <span>⌘K search</span>
        <span>E edit · D delete</span>
      </div>
    </footer>
  );
}
