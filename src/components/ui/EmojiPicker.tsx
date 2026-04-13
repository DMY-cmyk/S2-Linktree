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
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          role="radio"
          aria-checked={selected === emoji}
          aria-label={`${EMOJI_LABELS[emoji] ?? emoji} emoji`}
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
