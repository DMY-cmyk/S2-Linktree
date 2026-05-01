'use client';

import { EMOJI_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

const EMOJI_LABELS: Record<string, string> = {
  '📝': 'Memo', '🌐': 'Globe', '📖': 'Open book', '📘': 'Blue book',
  '📗': 'Green book', '📙': 'Orange book', '📕': 'Red book', '📅': 'Calendar',
  '📚': 'Books', '🎓': 'Graduation cap', '💻': 'Laptop', '📊': 'Chart',
  '🔬': 'Microscope', '📐': 'Ruler', '✏️': 'Pencil', '🗂️': 'Dividers',
  '📌': 'Pin', '🔗': 'Link', '📎': 'Paperclip', '🏫': 'School',
  '🧪': 'Test tube', '📈': 'Trending up', '🗓️': 'Calendar pad', '💡': 'Light bulb',
  '🎯': 'Target', '📋': 'Clipboard', '🔍': 'Magnifying glass', '⭐': 'Star',
  '🏆': 'Trophy', '📁': 'Folder',
};

export function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Choose category emoji">
      {EMOJI_OPTIONS.map((emoji) => {
        const isSelected = selected === emoji;
        return (
          <button
            key={emoji}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${EMOJI_LABELS[emoji] ?? emoji} emoji`}
            onClick={() => onSelect(emoji)}
            className={cn(
              'flex items-center justify-center transition-colors cursor-pointer',
              'h-9 w-9 text-lg rounded-[8px] border-[1.5px]',
              isSelected
                ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_14%,var(--surface))]'
                : 'border-[var(--border-soft)] bg-[var(--surface)] hover:border-[var(--accent)]'
            )}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}
