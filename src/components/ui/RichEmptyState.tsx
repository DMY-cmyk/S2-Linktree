interface RichEmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function RichEmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
}: RichEmptyStateProps) {
  return (
    <div
      className="fade-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        textAlign: 'center',
      }}
    >
      <span
        style={{ fontSize: 44, marginBottom: 12 }}
        role="img"
        aria-label={emoji}
      >
        {emoji}
      </span>
      <h3
        className="mono"
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '8px 0 16px',
          fontSize: 14,
          color: 'var(--text-2)',
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            background: 'var(--accent)',
            color: 'var(--accent-on)',
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '3px 3px 0 var(--shadow-color)',
            transition: 'transform 100ms ease, box-shadow 100ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px,-1px)';
            e.currentTarget.style.boxShadow = '4px 4px 0 var(--shadow-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0,0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 var(--shadow-color)';
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
