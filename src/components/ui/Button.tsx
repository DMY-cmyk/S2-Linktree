'use client';

import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  type = 'button',
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'font-semibold cursor-pointer transition-[transform,box-shadow] duration-100',
        'border-[1.5px] rounded-[10px] border-[var(--border)]',
        'shadow-[3px_3px_0_var(--shadow-color)]',
        'hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_var(--shadow-color)]',
        'active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_var(--shadow-color)]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_var(--shadow-color)]',
        variant === 'primary' && 'bg-[var(--accent)] text-[var(--accent-on)]',
        variant === 'secondary' && 'bg-[var(--surface)] text-[var(--text)]',
        variant === 'danger' && 'bg-[var(--danger)] text-white',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        className
      )}
    >
      {children}
    </button>
  );
}
