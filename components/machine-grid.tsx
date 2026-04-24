'use client';

import { MachineCard } from './machine-card';
import { Machine } from '@/types/machine';

interface MachineGridProps {
  machines: Machine[];
}

export function MachineGrid({ machines }: MachineGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
      {machines.map((machine, index) => (
        <MachineCard
          key={machine.id}
          machine={machine}
          priority={index === 0}
        />
      ))}
    </div>
  );
}