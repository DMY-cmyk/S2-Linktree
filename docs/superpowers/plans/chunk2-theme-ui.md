# Chunk 2: Theme System & Reusable UI Components

### Task 10: Create theme system (globals.css)

**Files:** Replace contents of `src/app/globals.css`

- [ ] **Step 1:** Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root,
[data-theme="light"] {
  --bg-primary: #fffbe6;
  --bg-card: #ffffff;
  --text-primary: #222222;
  --text-secondary: #666666;
  --border-color: #222222;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-card: #2a2a4a;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --border-color: #ffffff;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
  min-height: 100vh;
}

* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Reset transition for elements that need instant response */
button:active,
a:active,
input:focus {
  transition: none;
}

/* Scrollbar styling for dark mode */
[data-theme="dark"] ::-webkit-scrollbar {
  width: 8px;
}
[data-theme="dark"] ::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
[data-theme="dark"] ::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 4px;
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add theme system with dark/light CSS custom properties"
```

---

### Task 11: Create root layout with theme flash prevention

**Files:** Replace `src/app/layout.tsx`

- [ ] **Step 1:** Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'S2 Resource Hub',
  description: "Academic resource hub for Master's degree journey",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('s2-linktree-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2:** Verify build succeeds

```bash
npx next build
```

- [ ] **Step 3:** Commit

```bash
git add -A && git commit -m "feat: add root layout with theme flash prevention script"
```

---

### Task 12: Create Button component

**Files:** Create `src/components/ui/Button.tsx`

- [ ] **Step 1:** Create `src/components/ui/Button.tsx`

```tsx
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
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add Neo-Brutalism Button component"
```

---

### Task 13: Create Input component

**Files:** Create `src/components/ui/Input.tsx`

- [ ] **Step 1:** Create `src/components/ui/Input.tsx`

```tsx
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
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add Neo-Brutalism Input component with label and error"
```

---

### Task 14: Create Modal component

**Files:** Create `src/components/ui/Modal.tsx`

- [ ] **Step 1:** Create `src/components/ui/Modal.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalOverlay, modalContent } from '@/animations/variants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            {...modalOverlay}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            {...modalContent}
            className="relative w-full max-w-md bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-xl shadow-[6px_6px_0px_var(--border-color)] p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-[var(--text-primary)]">{title}</h2>
              <button
                onClick={onClose}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add animated Modal component with escape-to-close"
```

---

### Task 15: Create ThemeToggle component

**Files:** Create `src/components/ui/ThemeToggle.tsx`

- [ ] **Step 1:** Create `src/components/ui/ThemeToggle.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('s2-linktree-theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('s2-linktree-theme', next);
  };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      className="px-3 py-1.5 text-sm font-bold border-2 border-[var(--border-color)] rounded-lg bg-[#ffd078] text-[#222] shadow-[2px_2px_0px_var(--border-color)] cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </motion.button>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add ThemeToggle with localStorage persistence"
```

---

### Task 16: Create Toast container component

**Files:** Create `src/components/ui/Toast.tsx`

- [ ] **Step 1:** Create `src/components/ui/Toast.tsx`

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

const variantStyles = {
  success: 'bg-[#a8ff78] text-[#222] border-[#222]',
  warning: 'bg-[#ffd078] text-[#222] border-[#222]',
  error: 'bg-[#ff6b6b] text-white border-[#222]',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn(
              'px-4 py-3 border-2 rounded-lg shadow-[3px_3px_0px_var(--border-color)] font-bold text-sm max-w-sm cursor-pointer',
              variantStyles[toast.variant]
            )}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2:** Commit

```bash
git add -A && git commit -m "feat: add Toast container with Neo-Brutalism styling"
```

---

### Task 17: Create EmojiPicker component

**Files:** Create `src/components/ui/EmojiPicker.tsx`

- [ ] **Step 1:** Create `src/components/ui/EmojiPicker.tsx`

```tsx
'use client';

import { EMOJI_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className={cn(
            'w-10 h-10 flex items-center justify-center text-lg rounded-lg border-2 transition-all cursor-pointer',
            selected === emoji
              ? 'border-[var(--border-color)] shadow-[2px_2px_0px_var(--border-color)] bg-[var(--bg-primary)]'
              : 'border-transparent hover:border-[var(--border-color)]'
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2:** Verify build

```bash
npx next build
```

Expected: Build succeeds with all UI components

- [ ] **Step 3:** Commit

```bash
git add -A && git commit -m "feat: add EmojiPicker grid component"
```
