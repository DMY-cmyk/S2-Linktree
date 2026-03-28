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
