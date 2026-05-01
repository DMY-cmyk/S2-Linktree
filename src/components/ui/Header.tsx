'use client';

import { useState, type RefObject } from 'react';
import { Filter, Plus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar, type SearchBarRef } from '@/features/search/SearchBar';
import { TagFilterPopover } from '@/features/link-directory/TagFilterPopover';
import { useTagFilter } from '@/hooks/useTagFilter';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onAddLink: () => void;
  searchInputRef: RefObject<SearchBarRef | null>;
}

export function Header({ query, onQueryChange, onAddLink, searchInputRef }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const { activeTags } = useTagFilter();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid var(--border-soft)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, display: 'grid', placeItems: 'center',
            background: 'var(--text)', color: 'var(--bg)',
            borderRadius: 8, fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em',
          }}>S2</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Resource Hub</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>v5.0 · polished</span>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar ref={searchInputRef} value={query} onChange={onQueryChange} />
        <ThemeToggle />
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            aria-label="Filter by tag"
            style={btnGhost}
          >
            <Filter size={14} strokeWidth={1.75} />
            Filter{activeTags.size > 0 && (
              <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>
                · {activeTags.size}
              </span>
            )}
          </button>
          <TagFilterPopover open={filterOpen} onClose={() => setFilterOpen(false)} />
        </div>
        <button
          type="button"
          onClick={onAddLink}
          aria-label="Add link"
          style={btnPrimary}
        >
          <Plus size={14} strokeWidth={1.75} /> Add link
        </button>
      </div>
    </header>
  );
}

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 34, padding: '0 14px',
  background: 'var(--text)', color: 'var(--bg)',
  border: '1.5px solid var(--border)', borderRadius: 8,
  fontSize: 13, fontWeight: 600,
  boxShadow: '2px 2px 0 var(--shadow-color)',
  cursor: 'pointer',
} as const;

const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 34, padding: '0 12px',
  background: 'var(--surface)', color: 'var(--text)',
  border: '1.5px solid var(--border-soft)', borderRadius: 8,
  fontSize: 13, fontWeight: 500,
  cursor: 'pointer',
} as const;
