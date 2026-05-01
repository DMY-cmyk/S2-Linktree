'use client';

import { MonogramFavicon } from '@/components/ui/MonogramFavicon';
import type { Category, Link } from '@/types';

interface DragOverlayContentProps {
  type: 'category' | 'link';
  category?: Category;
  link?: Link;
}

const liftStyle: React.CSSProperties = {
  transform: 'rotate(1deg) scale(1.02)',
  transition: 'transform 150ms ease, box-shadow 150ms ease',
};

export function DragOverlayContent({ type, category, link }: DragOverlayContentProps) {
  if (type === 'category' && category) {
    const accent = category.color;
    const headerBg = `color-mix(in srgb, ${accent} 14%, var(--surface))`;
    return (
      <div
        className="max-w-[16rem] w-[80vw]"
        style={{
          ...liftStyle,
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 10,
          boxShadow: `6px 6px 0 var(--shadow-color)`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: headerBg,
            borderBottom: '1.5px solid var(--border-soft)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: accent,
              border: `1px solid color-mix(in srgb, ${accent} 60%, var(--border))`,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '-0.015em',
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {category.name}
            </div>
            <div
              className="mono"
              style={{
                marginTop: 2,
                fontSize: 10.5,
                color: 'var(--text-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {category.tag}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'link' && link) {
    return (
      <div
        className="max-w-[14rem] w-[75vw]"
        style={{
          ...liftStyle,
          display: 'grid',
          gridTemplateColumns: '20px 1fr',
          alignItems: 'center',
          gap: 10,
          padding: '9px 10px',
          background: 'var(--surface)',
          border: '1.5px solid var(--border-soft)',
          borderRadius: 7,
          boxShadow: '4px 4px 0 var(--shadow-color)',
        }}
      >
        <MonogramFavicon url={link.url} accent="var(--accent)" />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {link.title}
        </span>
      </div>
    );
  }

  return null;
}
