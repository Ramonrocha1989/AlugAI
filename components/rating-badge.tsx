import { Star } from 'lucide-react';
import { useUserRating } from '@/hooks/use-reviews';
import { Badge } from '@/components/ui/badge';

interface RatingBadgeProps {
  userId: string;
  showCount?: boolean;
}

export function RatingBadge({ userId, showCount = true }: RatingBadgeProps) {
  const { data: rating } = useUserRating(userId);

  if (!rating || rating.totalReviews === 0) {
    return null;
  }

  // Só mostra se tiver pelo menos 3 avaliações
  if (rating.totalReviews < 3) {
    return null;
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      <span className="font-semibold">{rating.averageRating.toFixed(1)}</span>
      {showCount && (
        <span className="text-muted-foreground">({rating.totalReviews})</span>
      )}
    </Badge>
  );
}
