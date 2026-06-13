// Skeleton placeholders shown while admin Server Components resolve.

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`admin-skeleton rounded-lg bg-white/[0.06] ${className ?? ""}`}
    />
  );
}

export function PageHeaderSkeleton({ withAction = false }: { withAction?: boolean }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <SkeletonBlock className="h-9 w-52 md:h-10" />
        <SkeletonBlock className="mt-2 h-4 w-full max-w-2xl" />
      </div>
      {withAction ? <SkeletonBlock className="h-9 w-36 shrink-0 rounded-lg" /> : null}
    </div>
  );
}

export function LocaleTabsSkeleton() {
  return (
    <div className="mb-6">
      <SkeletonBlock className="mb-2 h-3 w-28" />
      <div className="inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        <SkeletonBlock className="h-9 w-24 rounded-lg" />
        <SkeletonBlock className="h-9 w-28 rounded-lg" />
        <SkeletonBlock className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}

function SkeletonCardShell({
  headerWidth = "w-36",
  children,
}: {
  headerWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] shadow-sm shadow-black/20">
      <div className="border-b border-white/10 px-5 py-4">
        <SkeletonBlock className={`h-5 ${headerWidth}`} />
        <SkeletonBlock className="mt-1 h-4 w-64 max-w-full" />
      </div>
      {children}
    </div>
  );
}

function SkeletonListRow({
  withThumbnail = false,
  rows = 1,
}: {
  withThumbnail?: boolean;
  rows?: number;
}) {
  return (
    <li className="flex items-center gap-4 px-5 py-3 sm:py-4">
      {withThumbnail ? (
        <SkeletonBlock className="h-12 w-12 shrink-0 rounded-lg" />
      ) : (
        <SkeletonBlock className="h-8 w-8 shrink-0 rounded-lg" />
      )}
      <div className="min-w-0 flex-1 space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonBlock
            key={i}
            className={i === 0 ? "h-4 w-40" : "h-3 w-56 max-w-full"}
          />
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SkeletonBlock className="h-8 w-16 rounded-lg" />
        <SkeletonBlock className="h-8 w-16 rounded-lg" />
      </div>
    </li>
  );
}

export function DashboardSkeleton() {
  const sections = [
    { label: "w-20", items: 2 },
    { label: "w-32", items: 3 },
    { label: "w-20", items: 2 },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/[0.03] shadow-sm shadow-black/20"
        >
          <div className="border-b border-white/10 px-5 py-3">
            <SkeletonBlock className={`h-3 ${section.label}`} />
          </div>
          <ul className="divide-y divide-white/10">
            {Array.from({ length: section.items }).map((_, j) => (
              <li key={j} className="flex items-center gap-4 px-5 py-4">
                <SkeletonBlock className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-48 max-w-full" />
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <SkeletonBlock className="h-8 w-10" />
                  <SkeletonBlock className="h-4 w-4 rounded" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ContentFormSkeleton({ blocks = 2 }: { blocks?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: blocks }).map((_, i) => (
        <SkeletonCardShell key={i} headerWidth={i === 0 ? "w-32" : "w-28"}>
          <div className="space-y-5 p-5">
            {blocks > 1 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-12" />
                  <SkeletonBlock className="h-40 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-16" />
                  <SkeletonBlock className="h-40 w-full rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-40 w-full rounded-xl" />
              </div>
            )}
          </div>
        </SkeletonCardShell>
      ))}
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-9 w-40 rounded-lg" />
        <SkeletonBlock className="h-4 w-36" />
      </div>
    </div>
  );
}

export function ListCardSkeleton({
  rows = 5,
  withThumbnail = true,
}: {
  rows?: number;
  withThumbnail?: boolean;
}) {
  return (
    <SkeletonCardShell headerWidth="w-24">
      <ul className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonListRow key={i} withThumbnail={withThumbnail} rows={withThumbnail ? 3 : 2} />
        ))}
      </ul>
    </SkeletonCardShell>
  );
}

export function FormCardSkeleton() {
  return (
    <SkeletonCardShell headerWidth="w-28">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-9 w-32 rounded-lg" />
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-9 w-64 rounded-lg" />
        </div>
        <div className="flex gap-4">
          <SkeletonBlock className="h-4 w-14" />
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </SkeletonCardShell>
  );
}

export function GalleryToolbarSkeleton() {
  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SkeletonBlock className="h-10 w-full rounded-xl" />
        <SkeletonBlock className="h-9 w-40 shrink-0 rounded-xl" />
        <SkeletonBlock className="h-9 w-36 shrink-0 rounded-xl" />
      </div>
      <SkeletonBlock className="h-4 w-24" />
    </div>
  );
}

export function TableCardSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <SkeletonCardShell headerWidth="w-32">
      <div className="overflow-x-auto p-0">
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-3">
          <div className="flex gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-white/10">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-8 px-5 py-4">
              <SkeletonBlock className="h-4 w-28 shrink-0" />
              <SkeletonBlock className="h-4 w-36 shrink-0" />
              <SkeletonBlock className="h-4 w-24 shrink-0" />
              <SkeletonBlock className="h-4 w-32 shrink-0" />
              <SkeletonBlock className="h-16 w-48 shrink-0 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonCardShell>
  );
}
