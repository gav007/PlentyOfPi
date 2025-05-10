
'use client';

import { Button } from '@/components/ui/button';
import { HEX_DIGITS } from '@/lib/hexUtils';
import { cn } from '@/lib/utils';

interface HexDigitGridProps {
  onDigitSelect: (digit: string) => void; // This should handle the logic for setting high/low or resetting
  selectedHighNibble: string | null;
  selectedLowNibble: string | null;
  disabled: boolean; // Grid can be disabled entirely e.g. after submission in challenge mode
}

export default function HexDigitGrid({
  onDigitSelect,
  selectedHighNibble,
  selectedLowNibble,
  disabled,
}: HexDigitGridProps) {
  
  // These are for ARIA labels to guide the user.
  const isHighNibbleNext = selectedHighNibble === null;
  const isLowNibbleNext = selectedHighNibble !== null && selectedLowNibble === null;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 my-6 max-w-xs mx-auto" role="grid">
      {HEX_DIGITS.map((digit) => {
        const isSelectedForHigh = selectedHighNibble === digit;
        // Only mark as selected for low if it's different from high, or if high is already set and it's the same.
        // The primary selection indication comes from selectedHighNibble and selectedLowNibble props.
        const isSelectedForLow = selectedLowNibble === digit;
        
        let effectiveSelectionClass = "";
        if (isSelectedForHigh && (selectedLowNibble === null || selectedHighNibble !== selectedLowNibble)) {
            effectiveSelectionClass = "bg-primary/70 text-primary-foreground ring-2 ring-primary ring-offset-2 shadow-lg scale-105";
        } else if (isSelectedForLow && selectedHighNibble !== null) {
             // Make low nibble slightly less prominent if it's selected after high nibble
            effectiveSelectionClass = "bg-primary/50 text-primary-foreground ring-2 ring-primary ring-offset-2 shadow-lg scale-105";
        }


        return (
          <Button
            key={digit}
            variant="outline"
            className={cn(
              "aspect-square h-auto text-xl sm:text-2xl font-mono rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 ease-in-out",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              effectiveSelectionClass,
              // If the grid itself is disabled (e.g. post-submission in challenge mode)
              disabled && "opacity-60 cursor-not-allowed hover:bg-card",
              // If the grid is active, apply hover only if not selected
              !disabled && !effectiveSelectionClass && "hover:bg-accent/50" 
            )}
            onClick={() => onDigitSelect(digit)}
            disabled={disabled} // Overall grid disabled state
            aria-label={`Select hex digit ${digit}${isHighNibbleNext ? ' for high nibble' : isLowNibbleNext ? ' for low nibble' : selectedHighNibble !== null && selectedLowNibble !== null ? ' (this will start a new selection)' : ''}`}
            aria-pressed={isSelectedForHigh || isSelectedForLow} // Might need refinement if one digit can be both
            role="gridcell"
          >
            {digit}
          </Button>
        );
      })}
    </div>
  );
}

