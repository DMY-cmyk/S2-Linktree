interface DragHandleProps {
  ref?: React.Ref<HTMLButtonElement>;
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

export function DragHandle({ ref, listeners, attributes }: DragHandleProps) {
  return (
    <button
      ref={ref}
      className="cursor-grab active:cursor-grabbing touch-none p-1 text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3" r="1.5" />
        <circle cx="11" cy="3" r="1.5" />
        <circle cx="5" cy="8" r="1.5" />
        <circle cx="11" cy="8" r="1.5" />
        <circle cx="5" cy="13" r="1.5" />
        <circle cx="11" cy="13" r="1.5" />
      </svg>
    </button>
  );
}
