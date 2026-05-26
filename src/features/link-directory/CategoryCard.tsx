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
  const ariaLabel = `${category.name}, ${links.length} link${links.length === 1 ? '' : 's'}, press E to edit or D to delete`;
  const lifted = hover && !isDragging;

  return (
    <article
      tabIndex={0}
      data-card-id={category.id}
      aria-label={ariaLabel}
      className="fade-up"
      style={{
        ['--idx' as never]: String(index),
        animationDelay: `calc(var(--idx) * 28ms)`,
        position: 'relative',
        background: `
          radial-gradient(130% 80% at 100% 0%, color-mix(in srgb, ${accent} 18%, var(--paper)) 0%, var(--paper) 50%),
          var(--paper)
        `,
        border: '1.5px solid var(--border-soft)',
        borderRadius: 16,
        boxShadow: lifted
          ? `0 14px 28px -16px color-mix(in srgb, ${accent} 50%, var(--shadow-color)), 0 2px 0 color-mix(in srgb, var(--shadow-color) 6%, transparent)`
          : `0 6px 18px -14px color-mix(in srgb, var(--shadow-color) 35%, transparent), 0 1px 0 color-mix(in srgb, var(--shadow-color) 5%, transparent)`,
        transform: lifted ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 180ms cubic-bezier(0.2,0.7,0.2,1), box-shadow 180ms ease',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <header style={{
        padding: 'var(--card-pad) var(--card-pad) calc(var(--card-pad) - 4px)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        {dragHandleProps && (
          <DragHandle listeners={dragHandleProps.listeners} attributes={dragHandleProps.attributes} />
        )}

        {/* emoji chip tinted by the category color */}
        <div style={{
          width: 38, height: 38, flexShrink: 0, display: 'grid', placeItems: 'center',
          background: 'var(--paper)',
          border: `1.5px solid color-mix(in srgb, ${accent} 35%, var(--border-soft))`,
          borderRadius: 10, fontSize: 18,
          boxShadow: `inset 0 -2px 0 color-mix(in srgb, ${accent} 20%, transparent)`,
        }}>{category.emoji}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: '-0.012em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)',
          }}>{category.name}</h3>
          <div className="mono" style={{
            marginTop: 4, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
            <span>{category.tag}</span>
            <span>·</span>
            <span style={{ color: 'var(--text-2)' }}>
              {links.length} link{links.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 2,
          opacity: hover ? 1 : 0.45, transition: 'opacity 140ms ease',
        }}>
          <CardIconButton label={`Edit ${category.name}`} onClick={() => onEditCategory(category)}>
            <Pencil size={13} strokeWidth={1.75} />
          </CardIconButton>
          <CardIconButton label={`Delete ${category.name}`} onClick={() => onDeleteCategory(category)}>
            <Trash2 size={13} strokeWidth={1.75} />
          </CardIconButton>
        </div>
      </header>

      <div style={{ margin: '0 var(--card-pad)', height: 1, background: 'var(--border-soft)', opacity: 0.6 }} />

      <div style={{
        padding: 'calc(var(--card-pad) - 4px) calc(var(--card-pad) - 6px)',
        display: 'flex', flexDirection: 'column', gap: 2, flex: 1,
      }}>
        {links.length === 0 ? (
          <div style={{
            margin: '4px 4px 0', padding: '24px 16px', textAlign: 'center',
            border: '1.5px dashed var(--border-soft)', borderRadius: 10,
            background: 'color-mix(in srgb, var(--surface-2) 60%, transparent)',
          }}>
            <div style={{
              width: 30, height: 30, margin: '0 auto 10px', display: 'grid', placeItems: 'center',
              background: 'var(--paper)', border: '1.5px solid var(--border-soft)', borderRadius: 8,
              color: 'var(--text-3)',
            }}><BookOpen size={14} strokeWidth={1.75} /></div>
            <div className="mono" style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-2)',
            }}>No links yet</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 5 }}>
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
            marginTop: 6, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'transparent', color: 'var(--text-3)',
            border: '1.5px dashed var(--border-soft)', borderRadius: 8,
            fontSize: 12, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          <Plus size={12} strokeWidth={1.75} /> Add link
        </button>
      </div>
    </article>
  );
}

function CardIconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: 28, height: 28, display: 'grid', placeItems: 'center',
        background: 'transparent', color: 'var(--text-2)',
        border: 'none', borderRadius: 7, cursor: 'pointer',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}
