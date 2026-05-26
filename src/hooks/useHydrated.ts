'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * Returns false on the server and on the first client render, then true once
 * hydrated. Backed by useSyncExternalStore so the server/client snapshots
 * differ deterministically — gate persisted client-only state (e.g. tweaks) on
 * this so the first client paint matches the server HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
