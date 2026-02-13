'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIsFavorited, useToggleFavorite } from '@/hooks/use-favorites';
import { authService } from '@/services/machine-api';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  machineId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ machineId, className, size = 'md' }: FavoriteButtonProps) {
  const router = useRouter();
  const isFavorited = useIsFavorited(machineId);
  const { toggle, isLoading } = useToggleFavorite();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    toggle(machineId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'rounded-full bg-white/90 backdrop-blur-sm',
        'flex items-center justify-center',
        'hover:bg-white transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all',
          isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
        )}
      />
    </button>
  );
}
