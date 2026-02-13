'use client';

import { useState } from 'react';
import { useCreateReview } from '@/hooks/use-reviews';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/star-rating';
import { X, Loader2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewedUserId: string;
  reviewedUserName: string;
  machineId?: string;
  machineName?: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  reviewedUserId,
  reviewedUserName,
  machineId,
  machineName,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createReview.mutateAsync({
        reviewedUserId,
        machineId,
        rating,
        comment: comment.trim() || undefined,
      });

      onClose();
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Avaliar Vendedor</h2>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Vendedor:</p>
          <p className="font-semibold">{reviewedUserName}</p>
          {machineName && (
            <>
              <p className="text-sm text-muted-foreground mt-2 mb-1">Máquina:</p>
              <p className="font-semibold">{machineName}</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sua avaliação
            </label>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Comentário (opcional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={createReview.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createReview.isPending}
            >
              {createReview.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Avaliação'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
