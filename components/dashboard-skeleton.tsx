'use client';

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-10 w-64 bg-muted rounded mb-2" />
          <div className="h-5 w-48 bg-muted rounded" />
        </div>
        <div className="h-11 w-44 bg-muted rounded" />
      </div>

      {/* Plan card */}
      <div className="h-40 bg-muted rounded-lg mb-6" />

      {/* Analytics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-lg" />
        ))}
      </div>

      {/* Machine grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-[580px] bg-muted rounded-lg" />
            <div className="h-40 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
