// Next.js shows this file instantly (before the Server Component resolves).
// It replaces the blank white flash during data fetching.

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`admin-skeleton rounded-lg bg-white/[0.06] ${className ?? ""}`}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-9 w-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-4 w-40" />
        </div>
      </div>
      <SkeletonBlock className="h-8" />
      <SkeletonBlock className="h-8" />
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      {/* Page header skeleton */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-4 w-80 max-w-full" />
        </div>
        <SkeletonBlock className="h-9 w-32 rounded-lg" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
