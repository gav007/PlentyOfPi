'use client';

import type { Weight } from './RatioScalesCard';
import { Button } from '@/components/ui/button';
import { MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BalanceScaleProps {
  leftWeights: Weight[];
  rightWeights: Weight[];
  onRemoveWeight: (side: 'left' | 'right', id: string) => void;
  sumLeft: number;
  sumRight: number;
}

const WeightBox: React.FC<{ weight: Weight; onRemove: () => void }> = ({ weight, onRemove }) => (
  <div className="relative group bg-primary/10 border border-primary/30 p-2 rounded-md text-center shadow">
    <span className="text-lg font-semibold text-primary-foreground">{weight.value}</span>
    <Button
      variant="ghost"
      size="icon"
      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-card hover:bg-destructive text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={onRemove}
      aria-label={`Remove weight ${weight.value}`}
    >
      <MinusCircle className="w-3.5 h-3.5" />
    </Button>
  </div>
);

export default function BalanceScale({ leftWeights, rightWeights, onRemoveWeight, sumLeft, sumRight }: BalanceScaleProps) {
  const tiltFactor = 5; // Max degrees of tilt
  let rotation = 0;
  if (sumLeft > sumRight) {
    rotation = -Math.min(tiltFactor, (sumLeft - sumRight) / Math.max(1,sumRight) * tiltFactor /2 ); // Tilt left
  } else if (sumRight > sumLeft) {
    rotation = Math.min(tiltFactor, (sumRight - sumLeft) / Math.max(1,sumLeft) * tiltFactor / 2); // Tilt right
  }
  
  const basePanHeight = "min-h-[120px]"; 

  return (
    <div className="flex flex-col items-center select-none">
      {/* Scale Beam */}
      <div
        className="w-full max-w-md h-3 bg-muted rounded-full shadow-inner mb-[-6px] z-10 transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      ></div>
      
      {/* Fulcrum */}
      <div className="w-0 h-0 
        border-l-[20px] border-l-transparent
        border-r-[20px] border-r-transparent
        border-b-[30px] border-b-primary shadow-md"> {/* Changed border-b-muted-foreground to border-b-primary */}
      </div>

      <div className="flex justify-around w-full max-w-lg mt-2">
        {/* Left Pan */}
        <div className={cn("w-2/5 p-3 border-2 border-dashed border-secondary rounded-lg bg-secondary/20 flex flex-col items-center", basePanHeight)}>
          <h4 className="text-sm font-semibold text-secondary-foreground mb-2">LEFT PAN (Total: {sumLeft})</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {leftWeights.length === 0 && <p className="text-xs text-muted-foreground">Empty</p>}
            {leftWeights.map(w => <WeightBox key={w.id} weight={w} onRemove={() => onRemoveWeight('left', w.id)} />)}
          </div>
        </div>

        {/* Right Pan */}
        <div className={cn("w-2/5 p-3 border-2 border-dashed border-secondary rounded-lg bg-secondary/20 flex flex-col items-center", basePanHeight)}>
          <h4 className="text-sm font-semibold text-secondary-foreground mb-2">RIGHT PAN (Total: {sumRight})</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {rightWeights.length === 0 && <p className="text-xs text-muted-foreground">Empty</p>}
            {rightWeights.map(w => <WeightBox key={w.id} weight={w} onRemove={() => onRemoveWeight('right', w.id)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
