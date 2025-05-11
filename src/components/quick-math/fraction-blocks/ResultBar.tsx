
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Fraction } from './FractionBlocksCard';
import { ArrowRight } from 'lucide-react';

interface ResultBarProps {
  num: number;
  den: number;
  originalBlocks: Fraction[]; // To show the sum expression
}

export default function ResultBar({ num, den, originalBlocks }: ResultBarProps) {
  
  const sumExpression = originalBlocks.map(b => `${b.num}/${b.den}`).join(' + ');

  return (
    <Card className="mt-6 border-primary bg-primary/5">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xl text-center text-primary-foreground">Sum Result</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {originalBlocks.length > 0 && (
             <p className="text-sm text-muted-foreground mb-2">
                {sumExpression} =
             </p>
        )}
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center bg-background p-3 rounded-lg shadow-inner border border-border">
            <span className="text-4xl font-bold text-primary">{num}</span>
            {den !== 1 && ( // Only show denominator if it's not 1
              <>
                <hr className="w-16 border-t-2 border-primary my-1" />
                <span className="text-4xl font-bold text-primary">{den}</span>
              </>
            )}
          </div>
        </div>
         {den === 1 && num !== null && (
             <p className="text-lg text-muted-foreground mt-2">
                (equals {num})
             </p>
        )}
      </CardContent>
    </Card>
  );
}
