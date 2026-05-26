import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Density = 'compact' | 'comfy';
export type HeroVariant = 'rich' | 'minimal';

/** Curated accent swatches surfaced in the tweaks panel. '' means "auto" — let
 *  the active theme's own accent token drive (lavender in dark, violet in light). */
export const ACCENT_SWATCHES = ['#5b3df5', '#c2347a', '#1f7a4c', '#d65a18', '#1664b0'] as const;

interface TweaksState {
  /** '' = auto (theme token). Otherwise an explicit hex applied over the theme. */
  accent: string;
  density: Density;
  heroVariant: HeroVariant;
  filterVisible: boolean;
  setAccent: (accent: string) => void;
  setDensity: (density: Density) => void;
  setHeroVariant: (variant: HeroVariant) => void;
  setFilterVisible: (visible: boolean) => void;
  toggleFilter: () => void;
}

export const useTweaksStore = create<TweaksState>()(
  persist(
    (set) => ({
      accent: '',
      density: 'comfy',
      heroVariant: 'rich',
      filterVisible: true,
      setAccent: (accent) => set({ accent }),
      setDensity: (density) => set({ density }),
      setHeroVariant: (heroVariant) => set({ heroVariant }),
      setFilterVisible: (filterVisible) => set({ filterVisible }),
      toggleFilter: () => set((s) => ({ filterVisible: !s.filterVisible })),
    }),
    { name: 's2-tweaks' },
  ),
);
