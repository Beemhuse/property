export function ListingGridSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-3">
          <div className="h-9 w-40 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-4 w-48 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="hidden md:flex gap-2">
          <div className="h-8 w-24 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-3xl bg-white border border-slate-100 p-3 shadow-soft"
          >
            <div className="aspect-4/5 w-full rounded-2xl bg-slate-200 animate-pulse" />
            <div className="p-3 mt-3 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4.5 w-24 rounded bg-slate-200/80 animate-pulse" />
                <div className="h-4.5 w-12 rounded bg-slate-200/80 animate-pulse" />
              </div>
              <div className="h-5 w-44 rounded bg-slate-200 animate-pulse" />
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-full rounded bg-slate-200/60 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-slate-200/60 animate-pulse" />
              </div>
              <div className="flex gap-1.5 pt-3">
                <div className="h-5.5 w-14 rounded-full bg-slate-200/80 animate-pulse" />
                <div className="h-5.5 w-14 rounded-full bg-slate-200/80 animate-pulse" />
                <div className="h-5.5 w-14 rounded-full bg-slate-200/80 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
