import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function MachineSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 w-full bg-muted" />
      
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="h-6 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>

        <div className="space-y-2 mb-3">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>

        <div className="flex gap-1 mb-3">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-16" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full">
          <div className="h-8 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function MachineSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MachineSkeleton key={i} />
      ))}
    </div>
  );
}
