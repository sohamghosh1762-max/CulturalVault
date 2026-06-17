export function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="h-[50vh] sm:h-[60vh] shimmer" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-3">
              <div className="h-4 w-32 rounded shimmer" />
              <div className="h-4 w-24 rounded shimmer" />
              <div className="h-4 w-28 rounded shimmer" />
            </div>
            <div>
              <div className="h-7 w-32 rounded mb-4 shimmer" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-4 rounded mb-2 shimmer ${i === 5 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>
            <div>
              <div className="h-5 w-16 rounded mb-3 shimmer" />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-7 w-20 rounded-full shimmer" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-card p-6 space-y-3">
                <div className="h-5 w-32 rounded shimmer" />
                <div className="h-12 w-full rounded shimmer" />
                <div className="h-4 w-24 mx-auto rounded shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
