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

interface Props { url: string; accent?: string; size?: number }

export function MonogramFavicon({ url, accent, size = 20 }: Props) {
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
        width: size, height: size, display: 'grid', placeItems: 'center',
        borderRadius: size >= 28 ? 8 : 4,
        background: accent ? `color-mix(in srgb, ${accent} 10%, var(--paper))` : 'var(--surface-2)',
        border: `1.5px solid ${accent ? `color-mix(in srgb, ${accent} 30%, var(--border-soft))` : 'var(--border-soft)'}`,
        color: accent ?? 'var(--text)',
        fontSize: size >= 28 ? 10 : 9, fontWeight: 600, letterSpacing: '0.04em',
        flexShrink: 0,
      }}
    >{ch}</span>
  );
}
