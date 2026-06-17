export function CardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <div className="h-48 shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-20 rounded-full shimmer" />
          <div className="h-4 w-16 rounded shimmer" />
        </div>
        <div className="h-5 w-3/4 rounded shimmer" />
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded shimmer" />
          <div className="h-3 w-5/6 rounded shimmer" />
        </div>
        <div className="flex justify-between pt-1">
          <div className="h-3 w-24 rounded shimmer" />
          <div className="h-3 w-16 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}
