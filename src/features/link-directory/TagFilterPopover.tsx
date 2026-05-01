'use client';

import { useEffect, useRef } from 'react';
import { CATEGORY_TAGS } from '@/lib/constants';
import { useTagFilter } from '@/hooks/useTagFilter';

interface Props { open: boolean; onClose: () => void; }

export function TagFilterPopover({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { activeTags, toggleTag, clear } = useTagFilter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div ref={ref} role="dialog" aria-label="Filter by tag" style={{
      position: 'absolute', top: 'calc(100% + 12px)', right: 0,
      background: 'var(--surface)', border: '1.5px solid var(--border)',
      borderRadius: 12, padding: 16,
      boxShadow: '4px 4px 0 var(--shadow-color)',
      width: 280, zIndex: 50,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {CATEGORY_TAGS.map((t) => {
          const active = activeTags.has(t);
          return (
            <button
              key={t}
              type="button"
              role="checkbox"
              aria-checked={active}
              aria-label={t}
              onClick={() => toggleTag(t)}
              className="mono"
              style={{
                height: 28, padding: '0 10px',
                fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                border: active ? '1.5px solid var(--border)' : '1.5px solid var(--border-soft)',
                borderRadius: 999,
                background: active ? 'color-mix(in srgb, var(--accent) 14%, var(--surface))' : 'var(--surface)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >{t}</button>
          );
        })}
      </div>
      {activeTags.size > 0 && (
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={clear} className="mono" style={{
            background: 'transparent', border: 'none', color: 'var(--text-2)',
            fontSize: 11, cursor: 'pointer',
          }}>Clear</button>
        </div>
      )}
    </div>
  );
}
