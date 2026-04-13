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

function getShortcutHint(): string {
  if (typeof navigator === 'undefined') return 'Ctrl+K';
  const isMac = (navigator as any).userAgentData?.platform === 'macOS' ||
    /Mac/.test(navigator.platform ?? '');
  return isMac ? '⌘K' : 'Ctrl+K';
}

export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(function SearchBar({ value, onChange }, ref) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

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
    <div className="relative" id="main-content">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
        <Search size={16} strokeWidth={2.5} />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={`Search resources... (${getShortcutHint()})`}
        aria-label="Search resources"
        className="w-40 md:w-60 pl-9 pr-8 py-1.5 text-sm font-medium bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-secondary)] focus:shadow-[3px_3px_0px_var(--border-color)] transition-shadow"
      />
      {localValue && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-[var(--border-color)] text-[var(--bg-card)] rounded cursor-pointer"
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
});
