'use client';

import { type RefObject, type CSSProperties } from 'react';
import { Filter, Plus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar, type SearchBarRef } from '@/features/search/SearchBar';
import { useTagFilter } from '@/hooks/useTagFilter';
import { useTweaksStore } from '@/store/useTweaksStore';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onAddLink: () => void;
  searchInputRef: RefObject<SearchBarRef | null>;
}

export function Header({ query, onQueryChange, onAddLink, searchInputRef }: Props) {
  const { activeTags } = useTagFilter();
  const filterVisible = useTweaksStore((s) => s.filterVisible);
  const toggleFilter = useTweaksStore((s) => s.toggleFilter);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div
        style={{
          maxWidth: 1180, margin: '0 auto', padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}
      >
        {/* Logo lockup — serif monogram with the brand's hard accent shadow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="serif"
            style={{
              width: 38, height: 38, display: 'grid', placeItems: 'center',
              background: 'var(--text)', color: 'var(--bg)',
              border: '1.5px solid var(--border)', borderRadius: 10,
              boxShadow: '3px 3px 0 var(--accent)',
              fontSize: 22, fontStyle: 'italic', letterSpacing: '-0.02em',
              transform: 'translate(-2px,-2px)',
            }}
          >
            S2
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.01em' }}>Resource Hub</span>
            <span
              className="mono"
              style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              v5.0 · polished
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <SearchBar ref={searchInputRef} value={query} onChange={onQueryChange} />

        <ThemeToggle />

        <button
          type="button"
          onClick={toggleFilter}
          aria-label="Filter by tag"
          aria-pressed={filterVisible}
          style={{
            ...btnGhost,
            background: filterVisible ? 'color-mix(in srgb, var(--accent) 12%, var(--paper))' : 'var(--paper)',
            borderColor: filterVisible ? 'color-mix(in srgb, var(--accent) 40%, var(--border-soft))' : 'var(--border-soft)',
          }}
        >
          <Filter size={14} strokeWidth={1.75} />
          <span>Filter</span>
          {activeTags.size > 0 && (
            <span
              className="mono"
              style={{
                padding: '2px 7px', borderRadius: 999,
                background: 'var(--accent)', color: 'var(--accent-on)',
                fontSize: 10, fontWeight: 600,
              }}
            >
              {activeTags.size}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onAddLink}
          aria-label="Add link"
          style={btnPrimary}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px,-1px)';
            e.currentTarget.style.boxShadow = '4px 4px 0 var(--shadow-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0,0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 var(--shadow-color)';
          }}
        >
          <Plus size={14} strokeWidth={1.75} /> Add link
        </button>
      </div>
    </header>
  );
}

const btnPrimary: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  height: 36, padding: '0 16px',
  background: 'var(--text)', color: 'var(--bg)',
  border: '1.5px solid var(--border)', borderRadius: 9,
  fontSize: 13, fontWeight: 600,
  boxShadow: '3px 3px 0 var(--shadow-color)',
  cursor: 'pointer',
  transition: 'transform 120ms ease, box-shadow 120ms ease',
};

const btnGhost: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  height: 36, padding: '0 14px',
  background: 'var(--paper)', color: 'var(--text)',
  border: '1.5px solid var(--border-soft)', borderRadius: 9,
  fontSize: 13, fontWeight: 500,
  cursor: 'pointer',
};
