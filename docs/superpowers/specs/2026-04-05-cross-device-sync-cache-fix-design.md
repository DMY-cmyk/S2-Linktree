# Cross-Device Sync & Cache Fix — Design Spec

**Date:** 2026-04-05
**Status:** Approved

---

## Problem Summary

Two separate issues prevent changes from appearing on other devices:

1. **Data not syncing (Fix A):** Links and categories added via the app UI are stored in `localStorage` (`s2-linktree-store`). Other devices always load `DEFAULT_CATEGORIES` / `DEFAULT_LINKS` from `src/lib/constants.ts` — they never see the user's customized data.

2. **UI changes not updating (Fix B):** Next.js statically pre-renders pages. Without `Cache-Control` headers, browsers on other devices aggressively cache the old HTML and JS/CSS bundles even after a new Vercel deployment.

---

## Fix A — Sync localStorage Data into `constants.ts`

### Architecture

- Add an **"Export to Code"** button in the app UI (e.g., inside the existing header/settings area).
- The button reads the current Zustand store (`useLinkStore`) and generates a TypeScript code block that matches the shape of `DEFAULT_CATEGORIES` and `DEFAULT_LINKS` in `src/lib/constants.ts`.
- The generated code is copied to the clipboard. The user pastes it into `constants.ts`, commits, and pushes — Vercel redeploys with the updated defaults.

### Behavior

- The button lives in a logical place in the UI (e.g., a small "Export" option in the header or a dedicated settings area).
- On click: reads `useLinkStore.getState()`, formats categories and links as valid TypeScript arrays, and calls `navigator.clipboard.writeText(...)`.
- A toast notification confirms "Copied to clipboard".
- No backend, no API — purely client-side.

### Safety

- Existing visitors with data already in their `localStorage` are unaffected — the `persist` middleware keeps their local data intact.
- Only brand-new visitors (no `s2-linktree-store` key) will receive the updated defaults after the push.
- Updating `constants.ts` is always safe to deploy.

### Files affected

- `src/lib/constants.ts` — updated with new defaults after export (manual step by user)
- `src/features/home/HomePage.tsx` and/or the header component — add Export button alongside the existing theme toggle
- A new utility function in `src/lib/` to format store state as TypeScript source

---

## Fix B — Cache-Control Headers in `next.config.ts`

### Architecture

Use Next.js `headers()` config to set HTTP response headers:

| Path pattern | Header | Value |
|---|---|---|
| `/(.*)`  (all HTML routes) | `Cache-Control` | `no-cache, no-store, must-revalidate` |
| `/_next/static/(.*)` | (leave as-is) | Next.js handles hashed static assets automatically |
| `/favicon.ico`, `/*.svg` | `Cache-Control` | `public, max-age=3600` |

### Behavior

- After any new Vercel deployment, the next page load on any device fetches fresh HTML.
- Fresh HTML references new hashed JS/CSS bundle filenames — the browser downloads the updated bundles.
- No stale UI on other devices after a push.

### Files affected

- `next.config.ts` — add `headers()` async function returning the header rules

---

## Success Criteria

- [ ] After updating `constants.ts` and pushing, a fresh browser (no prior localStorage) shows the user's current links and categories.
- [ ] After any code push to GitHub, the Vercel deployment is reflected on other devices on the next page load without requiring a hard refresh.
- [ ] The "Export to Code" button correctly generates valid TypeScript that can be pasted into `constants.ts`.
- [ ] A toast confirms the copy action.

---

## Out of Scope

- Real-time sync across devices (no database)
- Authentication / admin-only editing
- Service Workers or PWA caching
