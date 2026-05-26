'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';
import { CATEGORY_TAGS } from '@/lib/constants';
import { useTagFilter } from '@/hooks/useTagFilter';

export type SortMode = 'order' | 'recent' | 'alpha';

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: 'order', label: 'Custom order' },
  { id: 'recent', label: 'Recently used' },
  { id: 'alpha', label: 'Alphabetical' },
];

interface Props {
  visible: boolean;
  sort: SortMode;
  onSort: (sort: SortMode) => void;
}

export function FilterStrip({ visible, sort, onSort }: Props) {
  const { activeTags, toggleTag } = useTagFilter();
  if (!visible) return null;

  return (
    <div
      className="fade-up"
      style={{
        margin: '6px 0 24px', padding: '14px 18px',
        background: 'var(--paper)', border: '1.5px solid var(--border-soft)', borderRadius: 14,
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}
    >
      <span className="mono" style={metaStyle}>Filter by tag</span>
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
              height: 28, padding: '0 11px', cursor: 'pointer',
              fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              borderRadius: 999,
              border: active ? '1.5px solid var(--border)' : '1.5px solid var(--border-soft)',
              background: active ? 'color-mix(in srgb, var(--accent) 18%, var(--paper))' : 'var(--paper)',
              color: active ? 'var(--text)' : 'var(--text-2)',
            }}
          >
            {t}
          </button>
        );
      })}
      <span style={{ flex: 1 }} />
      <span className="mono" style={metaStyle}>Sort</span>
      <SortPicker value={sort} onChange={onSort} />
    </div>
  );
}

function SortPicker({ value, onChange }: { value: SortMode; onChange: (v: SortMode) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = SORT_OPTIONS.find((o) => o.id === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="mono"
        style={{
          height: 28, padding: '0 11px', display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          background: 'var(--paper)', color: 'var(--text)',
          border: '1.5px solid var(--border-soft)', borderRadius: 999, cursor: 'pointer',
        }}
      >
        {cur.label} <ChevronDown size={11} strokeWidth={2} />
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 30,
            minWidth: 180, padding: 4,
            background: 'var(--paper)', border: '1.5px solid var(--border-soft)', borderRadius: 10,
            boxShadow: '0 12px 30px -12px color-mix(in srgb, var(--shadow-color) 35%, transparent)',
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              role="option"
              aria-selected={o.id === value}
              onClick={() => { onChange(o.id); setOpen(false); }}
              className="mono"
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 10px', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: o.id === value ? 'var(--surface-2)' : 'transparent',
                color: 'var(--text)', border: 'none', borderRadius: 6, cursor: 'pointer',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const metaStyle: CSSProperties = {
  fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)',
};
