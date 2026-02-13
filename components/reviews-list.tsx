import { useMachineReviews } from '@/hooks/use-reviews';
import { StarRating } from '@/components/star-rating';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewsListProps {
  machineId: string;
}

export function ReviewsList({ machineId }: ReviewsListProps) {
  const { data: reviews = [], isLoading } = useMachineReviews(machineId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Ainda não há avaliações para esta máquina</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">
                  {review.reviewer?.name || 'Usuário'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground mt-2">
                {review.comment}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
