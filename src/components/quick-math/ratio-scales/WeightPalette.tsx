
'use client';

import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';

interface WeightPaletteProps {
  weights: number[];
  onAddWeight: (side: 'left' | 'right', value: number) => void;
}

export default function WeightPalette({ weights, onAddWeight }: WeightPaletteProps) {
  return (
    <div className="p-4 border border-dashed border-accent rounded-lg bg-accent/10">
      <h3 className="text-lg font-semibold text-center mb-3 text-accent-foreground">Weight Palette</h3>
      <p className="text-xs text-center mb-3 text-muted-foreground">Click a weight, then choose a pan to add it.</p>
      <div className="flex flex-wrap justify-center gap-3">
        {weights.map((weightValue, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className="bg-card border border-primary p-3 rounded-md text-center shadow-lg w-16 h-16 flex items-center justify-center hover:shadow-xl transition-shadow">
              <span className="text-2xl font-bold text-primary">{weightValue}</span>
            </div>
            <div className="flex gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddWeight('left', weightValue)}
                    className="text-xs px-2 py-1 h-auto bg-card hover:bg-muted"
                    aria-label={`Add weight ${weightValue} to left pan`}
                >
                    To Left
                </Button>
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddWeight('right', weightValue)}
                    className="text-xs px-2 py-1 h-auto bg-card hover:bg-muted"
                    aria-label={`Add weight ${weightValue} to right pan`}
                >
                    To Right
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

