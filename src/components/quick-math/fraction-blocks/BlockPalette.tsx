
'use client';

import { Button } from '@/components/ui/button';
import type { Fraction } from './FractionBlocksCard'; // Use Omit for adding
import { PlusCircle } from 'lucide-react';

interface BlockPaletteProps {
  fractions: Omit<Fraction, 'id'>[];
  onAddBlock: (fraction: Omit<Fraction, 'id'>) => void;
}

export default function BlockPalette({ fractions, onAddBlock }: BlockPaletteProps) {
  return (
    <div className="p-4 border border-dashed border-accent rounded-lg bg-accent/10">
      <h3 className="text-lg font-semibold text-center mb-3 text-accent-foreground">Fraction Palette</h3>
      <p className="text-xs text-center mb-3 text-muted-foreground">Click a fraction to add it to the workspace below.</p>
      <div className="flex flex-wrap justify-center gap-3">
        {fractions.map((frac, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-0 shadow-sm hover:shadow-md transition-shadow bg-card"
            onClick={() => onAddBlock(frac)}
            aria-label={`Add fraction ${frac.num}/${frac.den} to workspace`}
          >
            <div className="flex flex-col items-center justify-center w-16 h-20">
              <span className="text-xl font-bold text-primary">{frac.num}</span>
              <hr className="w-10/12 border-t border-foreground my-0.5" />
              <span className="text-xl font-bold text-primary">{frac.den}</span>
            </div>
            <PlusCircle className="absolute top-1 right-1 w-3 h-3 text-muted-foreground group-hover:text-primary" />
          </Button>
        ))}
      </div>
    </div>
  );
}
