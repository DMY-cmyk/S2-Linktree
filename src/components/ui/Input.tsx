'use client';

import { forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = externalId ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-bold text-[var(--text-primary)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2 text-sm font-medium',
              'bg-[var(--bg-card)] text-[var(--text-primary)]',
              'border-2 border-[var(--border-color)] rounded-lg',
              'shadow-[2px_2px_0px_var(--border-color)]',
              'placeholder:text-[var(--text-secondary)]',
              'focus:shadow-[3px_3px_0px_var(--border-color)]',
              'transition-shadow',
              error && 'border-[var(--color-danger)] pr-10',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-danger)]">
              <AlertCircle size={16} strokeWidth={2.5} />
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-xs font-bold text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
