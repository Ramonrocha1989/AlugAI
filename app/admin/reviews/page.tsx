'use client';

import { useState } from 'react';
import { useAdminReviews, useDeleteReview } from '@/hooks/use-admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReviews({ page, limit: 20 });
  const deleteReview = useDeleteReview();

  const handleDelete = (id: string) => {
    if (confirm('Deletar esta avaliação?')) {
      deleteReview.mutate(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Moderar Avaliações</h1>
        <Link href="/admin">
          <Button variant="outline">Voltar ao Dashboard</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.reviews?.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="mb-2">{review.comment}</p>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>Avaliador:</strong> {review.reviewer?.name} ({review.reviewer?.email})
                        </p>
                        <p>
                          <strong>Avaliado:</strong> {review.reviewedUser?.name} ({review.reviewedUser?.email})
                        </p>
                        {review.machine && (
                          <p>
                            <strong>Máquina:</strong> {review.machine.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(review.id)}
                      disabled={deleteReview.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {page} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
