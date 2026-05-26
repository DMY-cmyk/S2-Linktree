'use client';

import { useState, type CSSProperties } from 'react';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useHydrated } from '@/hooks/useHydrated';
import {
  useTweaksStore,
  ACCENT_SWATCHES,
  type Density,
  type HeroVariant,
} from '@/store/useTweaksStore';

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const [theme, setTheme] = useTheme();

  const accent = useTweaksStore((s) => s.accent);
  const density = useTweaksStore((s) => s.density);
  const heroVariant = useTweaksStore((s) => s.heroVariant);
  const filterVisible = useTweaksStore((s) => s.filterVisible);
  const setAccent = useTweaksStore((s) => s.setAccent);
  const setDensity = useTweaksStore((s) => s.setDensity);
  const setHeroVariant = useTweaksStore((s) => s.setHeroVariant);
  const setFilterVisible = useTweaksStore((s) => s.setFilterVisible);

  // Don't read persisted values until hydrated, so the trigger/panel are stable.
  const dens: Density = hydrated ? density : 'comfy';
  const hero: HeroVariant = hydrated ? heroVariant : 'rich';
  const filt = hydrated ? filterVisible : true;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open tweaks"
          style={triggerStyle}
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
        </button>
      )}

      {open && (
        <div role="dialog" aria-label="Tweaks" style={panelStyle}>
          <div style={headerStyle}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Tweaks
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close tweaks" style={closeStyle}>
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          <div style={bodyStyle}>
            <Section label="Theme">
              <Segmented
                value={theme}
                onChange={(v) => setTheme(v as 'light' | 'dark')}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
              <Row label="Accent">
                <div style={{ display: 'flex', gap: 6 }}>
                  <AccentChip label="Auto" active={hydrated && !accent} onClick={() => setAccent('')} />
                  {ACCENT_SWATCHES.map((hex) => (
                    <AccentChip
                      key={hex}
                      color={hex}
                      active={hydrated && accent.toLowerCase() === hex.toLowerCase()}
                      onClick={() => setAccent(hex)}
                    />
                  ))}
                </div>
              </Row>
            </Section>

            <Section label="Layout">
              <Row label="Density">
                <Segmented
                  value={dens}
                  onChange={(v) => setDensity(v as Density)}
                  options={[
                    { value: 'compact', label: 'Compact' },
                    { value: 'comfy', label: 'Comfy' },
                  ]}
                />
              </Row>
              <Row label="Hero">
                <Segmented
                  value={hero}
                  onChange={(v) => setHeroVariant(v as HeroVariant)}
                  options={[
                    { value: 'rich', label: 'Rich' },
                    { value: 'minimal', label: 'Minimal' },
                  ]}
                />
              </Row>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={labelStyle}>Filter bar</span>
                <Toggle value={filt} onChange={setFilterVisible} label="Filter bar" />
              </div>
            </Section>
          </div>
        </div>
      )}
    </>
  );
}

// ── controls ─────────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--surface-2)', borderRadius: 9 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              background: on ? 'var(--paper)' : 'transparent',
              color: on ? 'var(--text)' : 'var(--text-2)',
              boxShadow: on ? '0 1px 3px color-mix(in srgb, var(--shadow-color) 20%, transparent)' : 'none',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function AccentChip({
  color,
  label,
  active,
  onClick,
}: {
  color?: string;
  label?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label ?? color}
      onClick={onClick}
      title={label ?? color}
      style={{
        position: 'relative',
        width: label ? 'auto' : 26, height: 26, flex: label ? 1 : 'none',
        padding: label ? '0 8px' : 0,
        borderRadius: 7, cursor: 'pointer',
        background: color ?? 'var(--surface-2)',
        color: color ? '#fff' : 'var(--text-2)',
        fontSize: 10, fontWeight: 600, fontFamily: 'inherit',
        border: active ? '2px solid var(--text)' : '1.5px solid var(--border-soft)',
        display: 'grid', placeItems: 'center',
      }}
    >
      {label ? label : active ? <Check size={13} strokeWidth={3} /> : null}
    </button>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      style={{
        position: 'relative', width: 38, height: 22, padding: 0, border: 'none', cursor: 'pointer',
        borderRadius: 999,
        background: value ? 'var(--accent)' : 'var(--border-soft)',
        transition: 'background 140ms ease',
      }}
    >
      <span
        style={{
          position: 'absolute', top: 3, left: value ? 19 : 3,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)', transition: 'left 140ms ease',
        }}
      />
    </button>
  );
}

// ── styles ───────────────────────────────────────────────────────────────────

const labelStyle: CSSProperties = { fontSize: 12.5, fontWeight: 500, color: 'var(--text-2)' };

const triggerStyle: CSSProperties = {
  position: 'fixed', right: 20, bottom: 20, zIndex: 60,
  width: 44, height: 44, display: 'grid', placeItems: 'center',
  background: 'var(--text)', color: 'var(--bg)',
  border: '1.5px solid var(--border)', borderRadius: 12,
  boxShadow: '3px 3px 0 var(--shadow-color)', cursor: 'pointer',
};

const panelStyle: CSSProperties = {
  position: 'fixed', right: 20, bottom: 20, zIndex: 60,
  width: 280, maxHeight: 'calc(100vh - 40px)',
  display: 'flex', flexDirection: 'column',
  background: 'color-mix(in srgb, var(--paper) 92%, transparent)',
  backdropFilter: 'blur(16px) saturate(140%)',
  WebkitBackdropFilter: 'blur(16px) saturate(140%)',
  border: '1.5px solid var(--border-soft)', borderRadius: 16,
  boxShadow: '0 20px 50px -20px color-mix(in srgb, var(--shadow-color) 55%, transparent)',
  overflow: 'hidden',
};

const headerStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '13px 14px', borderBottom: '1.5px solid var(--border-soft)',
  color: 'var(--text)',
};

const closeStyle: CSSProperties = {
  width: 26, height: 26, display: 'grid', placeItems: 'center',
  background: 'transparent', color: 'var(--text-2)',
  border: 'none', borderRadius: 7, cursor: 'pointer',
};

const bodyStyle: CSSProperties = {
  padding: 16, display: 'flex', flexDirection: 'column', gap: 18,
  overflowY: 'auto',
};
