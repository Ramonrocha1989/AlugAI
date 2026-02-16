'use client';

import { useMachines } from '@/hooks/use-machines';
import { useUserReviews, useUserRating } from '@/hooks/use-reviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MachineCard } from '@/components/machine-card';
import { RatingBadge } from '@/components/rating-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Star, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProfileClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const userId = params.id;

  const { data: allMachines, isLoading: loadingMachines } = useMachines({});
  const { data: reviews, isLoading: loadingReviews } = useUserReviews(userId);
  const { data: rating } = useUserRating(userId);

  const userMachines = allMachines?.filter(m => m.ownerId === userId) || [];

  const user = userMachines[0]?.owner;

  if (loadingMachines) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <RatingBadge userId={userId} />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>

              {rating && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Avaliação Média</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{rating.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rating.totalReviews} {rating.totalReviews === 1 ? 'avaliação' : 'avaliações'}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">
                    {userMachines.length} {userMachines.length === 1 ? 'anúncio' : 'anúncios'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {reviews && reviews.reviews && reviews.reviews.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Avaliações Recebidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingReviews ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  reviews.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
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
                      <p className="text-sm">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Por {review.reviewer?.name || 'Anônimo'}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Anúncios</CardTitle>
            </CardHeader>
            <CardContent>
              {userMachines.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum anúncio publicado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userMachines.map((machine) => (
                    <MachineCard key={machine.id} machine={machine} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
