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
          <label
            htmlFor={inputId}
            className="block text-xs font-medium mb-1.5 text-[var(--text-2)]"
            style={{
              fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-3 py-2 text-sm',
              'bg-[var(--surface)] text-[var(--text)]',
              'border-[1.5px] border-[var(--border-soft)] rounded-[8px]',
              'placeholder:text-[var(--text-3)]',
              'focus:border-[var(--accent)]',
              'transition-colors',
              error && 'border-[var(--danger)] pr-9',
              className
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--danger)]">
              <AlertCircle size={14} strokeWidth={1.75} />
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-xs font-medium text-[var(--danger)]">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
