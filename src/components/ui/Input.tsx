'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-[var(--text-primary)] mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 text-sm font-medium',
            'bg-[var(--bg-card)] text-[var(--text-primary)]',
            'border-2 border-[var(--border-color)] rounded-lg',
            'shadow-[2px_2px_0px_var(--border-color)]',
            'placeholder:text-[var(--text-secondary)]',
            'focus:outline-none focus:shadow-[3px_3px_0px_var(--border-color)]',
            'transition-shadow',
            error && 'border-[#ff6b6b]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs font-bold text-[#ff6b6b]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
