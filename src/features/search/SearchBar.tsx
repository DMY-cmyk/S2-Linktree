'use client';

import { forwardRef, useRef, useEffect, useState, useImperativeHandle } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface SearchBarRef {
  focus: () => void;
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(function SearchBar({ value, onChange }, ref) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => { setLocalValue(value); }, [value]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 150);
  };

  const handleClear = () => {
    setLocalValue('');
    clearTimeout(timerRef.current);
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (localValue) {
        setLocalValue('');
        clearTimeout(timerRef.current);
        onChange('');
      } else {
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div id="main-content" style={{ position: 'relative', width: 320 }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-3)', display: 'grid', placeItems: 'center',
        pointerEvents: 'none',
      }}>
        <Search size={14} strokeWidth={1.75} />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search resources, links, courses…"
        aria-label="Search resources"
        style={{
          width: '100%', height: 34, padding: '0 56px 0 34px',
          background: 'var(--surface)',
          border: '1.5px solid var(--border-soft)', borderRadius: 8,
          color: 'var(--text)', fontSize: 13, fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)',
            width: 18, height: 18, display: 'grid', placeItems: 'center',
            background: 'var(--surface-2)', color: 'var(--text-2)',
            border: '1px solid var(--border-soft)', borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          <X size={11} strokeWidth={1.75} />
        </button>
      )}
      <span className="mono" style={{
        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
        display: 'inline-flex', alignItems: 'center', gap: 2,
        fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
        background: 'var(--surface-2)', border: '1px solid var(--border-soft)',
        padding: '2px 6px', borderRadius: 4,
      }}>⌘K</span>
    </div>
  );
});
