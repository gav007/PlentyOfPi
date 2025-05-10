'use client';

import { cn } from '@/lib/utils';

interface HexSelectionProps {
  highNibble: string | null;
  lowNibble: string | null;
  currentDecimalValue: number | null;
}

export default function HexSelection({ highNibble, lowNibble, currentDecimalValue }: HexSelectionProps) {
  const displayHigh = highNibble ?? '_';
  const displayLow = lowNibble ?? '_';

  return (
    <div className="my-6 text-center p-4 bg-muted/30 rounded-lg shadow">
      <p className="text-sm font-semibold text-muted-foreground mb-2">YOUR HEX SELECTION:</p>
      <div className="flex items-center justify-center space-x-2">
        <span className="font-mono text-5xl sm:text-6xl text-primary bg-background/50 px-3 py-1 rounded-md shadow-inner min-w-[3ch] text-center">
          {displayHigh}
        </span>
        <span className="font-mono text-5xl sm:text-6xl text-primary bg-background/50 px-3 py-1 rounded-md shadow-inner min-w-[3ch] text-center">
          {displayLow}
        </span>
      </div>
      {currentDecimalValue !== null && (
        <p className="text-sm text-muted-foreground mt-3">
          (Decimal: {currentDecimalValue})
        </p>
      )}
    </div>
  );
}
