'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/machine-api';
import { useUserReviews } from '@/hooks/use-reviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ReviewsPage() {
  const router = useRouter();
  const user = authService.getCurrentUser();
  const { data, isLoading } = useUserReviews(user?.id || '');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [router, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const stats = data?.stats;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Estatísticas de Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats && stats.totalReviews > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.averageRating.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Média</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Nenhuma estatística disponível</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avaliações Recebidas</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhuma avaliação ainda</p>
              <p className="text-sm">As avaliações das suas máquinas aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.reviewer?.name || 'Usuário'}</span>
                      </div>
                      {review.machine && (
                        <p className="text-sm text-muted-foreground">
                          Máquina: {review.machine.name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
