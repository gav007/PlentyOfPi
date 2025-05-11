
'use client';

import type { FractionExpressionDef, FractionValue } from '@/types/fractionDuel';
import { cn } from '@/lib/utils';

interface FractionDisplayProps {
  fraction: FractionValue;
  isResult?: boolean;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({ fraction, isResult = false }) => {
  return (
    <div className={cn(
      "inline-flex flex-col items-center mx-1 p-2 rounded-md bg-muted/50 border border-border shadow-sm",
      isResult ? "min-w-[70px]" : "min-w-[60px]"
    )}>
      <span className={cn("font-bold text-primary", isResult ? "text-2xl" : "text-xl")}>{fraction.num}</span>
      {fraction.den !== 1 && (
        <>
          <hr className={cn("w-10/12 border-t-2 my-0.5", isResult ? "border-primary" : "border-foreground")} />
          <span className={cn("font-bold text-primary", isResult ? "text-2xl" : "text-xl")}>{fraction.den}</span>
        </>
      )}
       {fraction.den === 1 && (
         <span className={cn("text-xs text-muted-foreground mt-0.5", isResult ? "invisible h-0" : "")}>(whole)</span>
       )}
    </div>
  );
};


interface FractionExpressionProps {
  expression: FractionExpressionDef;
}

export default function FractionExpression({ expression }: FractionExpressionProps) {
  return (
    <div className="my-6 text-center p-4 border border-dashed border-primary/50 rounded-lg bg-primary/10 shadow-md">
      <p className="text-md font-medium text-primary-foreground mb-3">
        Solve the expression:
      </p>
      <div className="flex items-center justify-center text-2xl font-semibold">
        {expression.fractions.map((frac, index) => (
          <React.Fragment key={index}>
            <FractionDisplay fraction={frac} />
            {index < expression.fractions.length - 1 && (
              <span className="mx-2 text-primary">{expression.operator}</span>
            )}
          </React.Fragment>
        ))}
        <span className="mx-2 text-primary">=</span>
        <span className="text-3xl font-bold text-primary">?</span>
      </div>
    </div>
  );
}
