'use client';

import { useRef, useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalValue(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 150);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Search links..."
        className="w-40 md:w-60 pl-8 pr-3 py-1.5 text-sm font-medium bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-[2px_2px_0px_var(--border-color)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:shadow-[3px_3px_0px_var(--border-color)]"
      />
    </div>
  );
}
