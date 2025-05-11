
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DivisorToolbarProps {
  divisors: number[];
  selectedDivisor: number | null;
  onSelectDivisor: (divisor: number) => void;
  disabled?: boolean;
}

export default function DivisorToolbar({
  divisors,
  selectedDivisor,
  onSelectDivisor,
  disabled = false,
}: DivisorToolbarProps) {
  if (!divisors || divisors.length === 0) {
    return <p className="text-center text-muted-foreground text-sm">No divisors available for this range.</p>;
  }
  return (
    <div className="p-3 bg-background border border-border rounded-lg shadow-sm">
      <p className="text-sm font-medium text-center mb-3 text-muted-foreground">
        Select a Divisor:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {divisors.map((divisor) => (
          <Button
            key={divisor}
            variant={selectedDivisor === divisor ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "min-w-[40px] transition-all",
              selectedDivisor === divisor && "ring-2 ring-primary ring-offset-2 shadow-md"
            )}
            onClick={() => onSelectDivisor(divisor)}
            disabled={disabled}
            aria-pressed={selectedDivisor === divisor}
            aria-label={`Select ${divisor} as divisor`}
          >
            {divisor}
          </Button>
        ))}
      </div>
    </div>
  );
}
