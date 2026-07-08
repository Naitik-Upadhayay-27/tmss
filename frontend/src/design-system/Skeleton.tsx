interface SkeletonProps { className?: string; }

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-tertiary rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function TicketRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-surface-border" aria-hidden="true">
      <Skeleton className="h-4 w-24 flex-shrink-0" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-7 w-7 rounded-full" />
    </div>
  );
}
