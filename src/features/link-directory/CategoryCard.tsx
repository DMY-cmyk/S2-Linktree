'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, BookOpen } from 'lucide-react';
import { LinkItem } from './LinkItem';
import { DragHandle } from '@/components/ui/DragHandle';
import type { Category, Link } from '@/types';

interface Props {
  category: Category;
  links: Link[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onAddLink: (categoryId: string) => void;
  isDragging?: boolean;
  searchQuery?: string;
  dragHandleProps?: {
    listeners: Record<string, unknown> | undefined;
    attributes: Record<string, unknown>;
  };
  renderLinks?: (links: Link[], accentColor: string) => React.ReactNode;
  index?: number;
}

export function CategoryCard({
  category, links, onEditLink, onDeleteLink, onEditCategory, onDeleteCategory,
  onAddLink, isDragging = false, searchQuery, dragHandleProps, renderLinks, index = 0,
}: Props) {
  const [hover, setHover] = useState(false);
  const accent = category.color;
  const headerBg = `color-mix(in srgb, ${accent} 14%, var(--surface))`;
  const ariaLabel = `${category.name}, ${links.length} link${links.length === 1 ? '' : 's'}, press E to edit or D to delete`;

  return (
    <article
      tabIndex={0}
      data-card-id={category.id}
      aria-label={ariaLabel}
      className="fade-up"
      style={{
        ['--idx' as never]: String(index),
        animationDelay: `calc(var(--idx) * 30ms)`,
        position: 'relative',
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 10,
        boxShadow: hover && !isDragging ? '4px 4px 0 var(--shadow-color)' : '3px 3px 0 var(--shadow-color)',
        transform: hover && !isDragging ? 'translate(-1px,-1px)' : 'translate(0,0)',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <header style={{
        padding: '14px 16px 12px', display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '1.5px solid var(--border-soft)',
        background: headerBg,
      }}>
        {dragHandleProps && (
          <DragHandle listeners={dragHandleProps.listeners} attributes={dragHandleProps.attributes} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 8, height: 8, borderRadius: 2, background: accent,
              border: `1px solid color-mix(in srgb, ${accent} 60%, var(--border))`,
              flexShrink: 0,
            }} />
            <h3 style={{
              margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: '-0.015em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              color: 'var(--text)',
            }}>{category.name}</h3>
          </div>
          <div className="mono" style={{
            marginTop: 3, fontSize: 10.5, color: 'var(--text-3)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {category.tag} · <span style={{ color: 'var(--text-2)' }}>
              {links.length} link{links.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button type="button" onClick={() => onEditCategory(category)}
            aria-label={`Edit ${category.name}`}
            style={{ width: 26, height: 26, display: 'grid', placeItems: 'center',
              background: 'transparent', border: 'none', borderRadius: 6,
              color: 'var(--text-3)', cursor: 'pointer' }}>
            <Pencil size={13} strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => onDeleteCategory(category)}
            aria-label={`Delete ${category.name}`}
            style={{ width: 26, height: 26, display: 'grid', placeItems: 'center',
              background: 'transparent', border: 'none', borderRadius: 6,
              color: 'var(--text-3)', cursor: 'pointer' }}>
            <Trash2 size={13} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {links.length === 0 ? (
          <div style={{
            padding: '20px 12px', textAlign: 'center',
            border: '1.5px dashed var(--border-soft)', borderRadius: 8,
            background: 'var(--surface-2)',
          }}>
            <div style={{
              width: 28, height: 28, margin: '0 auto 8px',
              display: 'grid', placeItems: 'center',
              background: 'var(--surface)', border: '1.5px solid var(--border-soft)',
              borderRadius: 6, color: 'var(--text-3)',
            }}><BookOpen size={14} strokeWidth={1.75} /></div>
            <div className="mono" style={{
              fontSize: 10.5, fontWeight: 500, color: 'var(--text-3)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>No links yet</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
              Drop a Classroom link or Drive folder.
            </div>
          </div>
        ) : renderLinks ? (
          renderLinks(links, accent)
        ) : (
          links.map((l, i) => (
            <LinkItem key={l.id} link={l} accentColor={accent}
              onEdit={() => onEditLink(l)} onDelete={() => onDeleteLink(l)}
              isDragging={isDragging} searchQuery={searchQuery} index={i} />
          ))
        )}
        <button
          type="button"
          onClick={() => onAddLink(category.id)}
          aria-label="Add link"
          style={{
            marginTop: 4, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'transparent',
            border: '1.5px dashed var(--border-soft)',
            borderRadius: 8,
            color: 'var(--text-3)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Plus size={12} strokeWidth={1.75} /> Add link
        </button>
      </div>
    </article>
  );
}
