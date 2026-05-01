const MAP: Record<string, string> = {
  'github.com': 'G',
  'classroom.google.com': 'C',
  'drive.google.com': 'D',
  'docs.google.com': 'D',
  'ilpcikini.com': 'I',
  'speakingpartner.id': 'S',
  'portal.etc.web.id': 'E',
  'koperasi.bappenas.go.id': 'B',
};

interface Props { url: string; accent?: string; }

export function MonogramFavicon({ url, accent }: Props) {
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }
  if (!host) return <span aria-hidden>·</span>;
  const ch = MAP[host] ?? host[0]?.toUpperCase() ?? '·';
  return (
    <span
      className="mono"
      role="img"
      aria-label={`Favicon for ${host}`}
      style={{
        width: 20, height: 20, display: 'grid', placeItems: 'center',
        borderRadius: 4, background: 'var(--surface-2)',
        border: '1px solid var(--border-soft)',
        color: accent ?? 'var(--text)', fontSize: 10, fontWeight: 700,
        flexShrink: 0,
      }}
    >{ch}</span>
  );
}
