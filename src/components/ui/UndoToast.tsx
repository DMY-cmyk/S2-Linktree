'use client';

import { useEffect, useState, useRef } from 'react';

interface UndoToastProps {
  message: string;
  duration: number;
  onUndo: () => void;
  onDismiss: () => void;
}

export function UndoToast({ message, duration, onUndo, onDismiss }: UndoToastProps) {
  const [progress, setProgress] = useState(100);
  const dismissedRef = useRef(false);

  useEffect(() => {
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - step;
        if (next <= 0) {
          clearInterval(timer);
          if (!dismissedRef.current) {
            dismissedRef.current = true;
            setTimeout(() => onDismiss(), 0);
          }
          return 0;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className="fade-up"
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 10,
        boxShadow: '3px 3px 0 var(--shadow-color)',
        padding: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{message}</span>
        <button
          type="button"
          onClick={() => {
            if (!dismissedRef.current) {
              dismissedRef.current = true;
              onUndo();
              onDismiss();
            }
          }}
          className="mono"
          style={{
            flexShrink: 0,
            border: '1.5px solid var(--border)',
            borderRadius: 8,
            background: 'var(--accent)',
            color: 'var(--accent-on)',
            padding: '4px 10px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Undo
        </button>
      </div>
      <div
        style={{
          marginTop: 8,
          height: 3,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 999,
          background: 'var(--border-soft)',
        }}
      >
        <div
          data-testid="undo-progress"
          style={{
            height: '100%',
            borderRadius: 999,
            background: 'var(--accent)',
            width: `${progress}%`,
            transition: 'width 75ms linear',
          }}
        />
      </div>
    </div>
  );
}
