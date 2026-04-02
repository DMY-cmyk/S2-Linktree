export function SkeletonCard() {
  return (
    <div
      data-testid="skeleton-card"
      className="rounded-xl border-3 border-[var(--border-color)] bg-[var(--bg-card)] p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded animate-shimmer" />
        <div className="h-5 w-24 rounded animate-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded animate-shimmer" />
        <div className="h-4 w-3/4 rounded animate-shimmer" />
        <div className="h-4 w-1/2 rounded animate-shimmer" />
      </div>
    </div>
  );
}
