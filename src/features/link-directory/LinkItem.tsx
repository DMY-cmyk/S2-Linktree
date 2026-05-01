'use client';

import { useState } from 'react';
import { ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { MonogramFavicon } from '@/components/ui/MonogramFavicon';
import { HighlightText } from '@/components/ui/HighlightText';
import type { Link } from '@/types';

interface Props {
  link: Link;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
  searchQuery?: string;
  index?: number;
}

const domainOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

export function LinkItem({ link, accentColor, onEdit, onDelete, isDragging = false, searchQuery, index = 0 }: Props) {
  const [hover, setHover] = useState(false);
  const domain = domainOf(link.url);
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      data-link-id={link.id}
      className="fade-up"
      style={{
        ['--idx' as never]: String(index),
        animationDelay: `calc(var(--idx) * 30ms)`,
        display: 'grid',
        gridTemplateColumns: '20px 1fr auto',
        alignItems: 'center', gap: 10,
        padding: '9px 10px',
        background: hover ? `color-mix(in srgb, ${accentColor} 8%, var(--surface))` : 'transparent',
        border: `1.5px solid ${hover ? `color-mix(in srgb, ${accentColor} 40%, var(--border-soft))` : 'transparent'}`,
        borderRadius: 7,
        transition: 'background 120ms, border-color 120ms',
        textDecoration: 'none', color: 'inherit',
      }}
      onMouseEnter={() => !isDragging && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <MonogramFavicon url={link.url} accent={accentColor} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          <HighlightText text={link.title} query={searchQuery ?? ''} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: 'var(--text-3)', marginTop: 1,
        }}>
          <span className="mono" style={{ color: 'var(--text-2)' }}>{domain}</span>
          {link.description && (
            <>
              <span>·</span>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <HighlightText text={link.description} query={searchQuery ?? ''} />
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          aria-label={`Edit ${link.title}`}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}
        ><Pencil size={13} strokeWidth={1.75} /></button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onDelete(); }}
          aria-label={`Delete ${link.title}`}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}
        ><Trash2 size={13} strokeWidth={1.75} /></button>
        <span style={{
          color: hover ? accentColor : 'var(--text-3)',
          transform: hover ? 'translate(2px,-2px)' : 'translate(0,0)',
          transition: 'color 120ms, transform 120ms',
          display: 'grid', placeItems: 'center',
        }}><ArrowUpRight size={13} strokeWidth={1.75} /></span>
      </div>
    </a>
  );
}
