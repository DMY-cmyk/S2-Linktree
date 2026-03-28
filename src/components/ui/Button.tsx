'use client';

import { motion } from 'framer-motion';
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
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { y: 0, scale: 0.98 }}
      className={cn(
        'font-bold border-2 rounded-lg cursor-pointer',
        'border-[var(--border-color)]',
        'shadow-[3px_3px_0px_var(--border-color)]',
        'hover:shadow-[4px_4px_0px_var(--border-color)]',
        'active:shadow-[1px_1px_0px_var(--border-color)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-[#a8ff78] text-[#222]',
        variant === 'secondary' && 'bg-[var(--bg-card)] text-[var(--text-primary)]',
        variant === 'danger' && 'bg-[#ff6b6b] text-white',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        className
      )}
    >
      {children}
    </motion.button>
  );
}
