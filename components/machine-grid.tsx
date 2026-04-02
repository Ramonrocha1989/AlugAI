'use client';

import { useState, useEffect, useCallback } from 'react';
import { MachineCard } from './machine-card';
import { Machine } from '@/types/machine';

interface MachineGridProps {
  machines: Machine[];
}

export function MachineGrid({ machines }: MachineGridProps) {
  const [cardHeights, setCardHeights] = useState<number[]>([]);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(true);

  // Callback para receber altura de cada card
  const handleHeightChange = useCallback((index: number, height: number) => {
    setCardHeights(prev => {
      const newHeights = [...prev];
      newHeights[index] = height;
      return newHeights;
    });
  }, []);

  // Calcular altura máxima quando todas as alturas estiverem disponíveis
  useEffect(() => {
    if (cardHeights.length === machines.length && cardHeights.every(h => h > 0)) {
      const max = Math.max(...cardHeights);
      setMaxHeight(max);
      setIsCalculating(false);
    }
  }, [cardHeights, machines.length]);

  // Reset quando machines mudam
  useEffect(() => {
    setCardHeights([]);
    setMaxHeight(0);
    setIsCalculating(true);
  }, [machines]);

  return (
    <div className="machine-card-container">
      {machines.map((machine, index) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          onHeightChange={isCalculating ? (height) => handleHeightChange(index, height) : undefined}
          targetHeight={!isCalculating ? maxHeight : undefined}
        />
      ))}
    </div>
  );
}