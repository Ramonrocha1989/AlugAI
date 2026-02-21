import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function MachineSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%]" />
      
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2">
          <div className="h-5 sm:h-6 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-3/4 mb-2" />
          <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
        </div>

        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-full" />
          <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-2/3" />
        </div>

        <div className="flex gap-1 mb-3">
          <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-16" />
          <div className="h-6 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-16" />
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <div className="w-full">
          <div className="h-7 sm:h-8 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-1/3 mb-2" />
          <div className="h-4 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer bg-[length:200%_100%] rounded w-1/2" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function MachineSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MachineSkeleton key={i} />
      ))}
    </div>
  );
}
