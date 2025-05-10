'use client';

import { Button } from '@/components/ui/button';
import { HEX_DIGITS } from '@/lib/hexUtils';
import { cn } from '@/lib/utils';

interface HexDigitGridProps {
  onDigitSelect: (digit: string) => void;
  selectedHighNibble: string | null;
  selectedLowNibble: string | null;
  disabled: boolean;
}

export default function HexDigitGrid({
  onDigitSelect,
  selectedHighNibble,
  selectedLowNibble,
  disabled,
}: HexDigitGridProps) {
  const isHighNibbleNext = selectedHighNibble === null;
  const isLowNibbleNext = selectedHighNibble !== null && selectedLowNibble === null;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 my-6 max-w-xs mx-auto" role="grid">
      {HEX_DIGITS.map((digit) => {
        const isSelectedForHigh = selectedHighNibble === digit;
        const isSelectedForLow = selectedLowNibble === digit && selectedHighNibble !== digit; // ensure not double counted if high === low
        
        return (
          <Button
            key={digit}
            variant="outline"
            className={cn(
              "aspect-square h-auto text-xl sm:text-2xl font-mono rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 ease-in-out",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelectedForHigh && "bg-primary/70 text-primary-foreground ring-2 ring-primary ring-offset-2 shadow-lg scale-105",
              isSelectedForLow && "bg-primary/50 text-primary-foreground ring-2 ring-primary ring-offset-2 shadow-lg scale-105",
              disabled && "opacity-60 cursor-not-allowed hover:bg-card",
              !disabled && !isSelectedForHigh && !isSelectedForLow && "hover:bg-accent/50"
            )}
            onClick={() => onDigitSelect(digit)}
            disabled={disabled}
            aria-label={`Select hex digit ${digit}${isHighNibbleNext ? ' for high nibble' : isLowNibbleNext ? ' for low nibble' : ''}`}
            aria-pressed={isSelectedForHigh || isSelectedForLow}
            role="gridcell"
          >
            {digit}
          </Button>
        );
      })}
    </div>
  );
}
