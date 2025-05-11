
'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RockGridProps {
  tiles: number[];
  chipped: Set<number>;
  onRockClick: (tile: number) => void;
  selectedDivisor: number | null;
  primesChecked: boolean;
  revealedPrimes: Set<number>;
}

export default function RockGrid({
  tiles,
  chipped,
  onRockClick,
  selectedDivisor,
  primesChecked,
  revealedPrimes,
}: RockGridProps) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 border border-muted rounded-lg bg-muted/20">
      {tiles.map((tile) => {
        const isChipped = chipped.has(tile);
        const isRevealedPrime = primesChecked && revealedPrimes.has(tile);
        const isRevealedComposite = primesChecked && !revealedPrimes.has(tile);
        
        let tileClass = "bg-card hover:bg-accent/50 text-foreground";
        let ariaLabel = `Rock number ${tile}.`;

        if (isChipped) {
          tileClass = "bg-muted text-muted-foreground line-through opacity-70 hover:bg-muted";
          ariaLabel = `Rock number ${tile}, chipped as composite.`;
        }
        if (primesChecked) {
          if (isRevealedPrime) {
            tileClass = "bg-green-500 text-white font-bold ring-2 ring-green-300 ring-offset-1";
            ariaLabel = `Rock number ${tile}, confirmed prime.`;
          } else if (isRevealedComposite && !isChipped) { // Highlight composites missed by user
            tileClass = "bg-red-200 text-red-700 border-2 border-red-400";
             ariaLabel = `Rock number ${tile}, is composite (was not chipped).`;
          } else if (isRevealedComposite && isChipped) { // Correctly chipped composite
             tileClass = "bg-muted text-muted-foreground line-through opacity-70";
             ariaLabel = `Rock number ${tile}, correctly chipped as composite.`;
          }
        }
        
        return (
          <Button
            key={tile}
            variant="outline"
            className={cn(
              "aspect-square h-auto text-sm sm:text-base font-semibold rounded-md shadow-sm transition-all duration-150 ease-in-out",
              tileClass,
              primesChecked && "cursor-default" // Don't allow hover effects if checked
            )}
            onClick={() => onRockClick(tile)}
            disabled={primesChecked && !isRevealedPrime} // Allow clicking revealed primes for potential interaction, disable others
            aria-label={ariaLabel}
            aria-pressed={isChipped}
          >
            {tile}
          </Button>
        );
      })}
    </div>
  );
}
