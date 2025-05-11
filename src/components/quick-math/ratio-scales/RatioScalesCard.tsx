
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BalanceScale from './BalanceScale';
import WeightPalette from './WeightPalette';
import ResultDisplay from './ResultDisplay';
import { sumArray, gcd } from '@/lib/mathUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, RefreshCw } from 'lucide-react';

export interface Weight {
  id: string;
  value: number;
}

const INITIAL_PALETTE_WEIGHTS: number[] = [1, 2, 3, 5, 10];

export default function RatioScalesCard() {
  const [leftWeights, setLeftWeights] = useState<Weight[]>([]);
  const [rightWeights, setRightWeights] = useState<Weight[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddWeight = (side: 'left' | 'right', value: number) => {
    const newWeight: Weight = { id: crypto.randomUUID(), value };
    if (side === 'left') {
      setLeftWeights(prev => [...prev, newWeight]);
    } else {
      setRightWeights(prev => [...prev, newWeight]);
    }
    setMessage(null);
  };

  const handleRemoveWeight = (side: 'left' | 'right', id: string) => {
    if (side === 'left') {
      setLeftWeights(prev => prev.filter(w => w.id !== id));
    } else {
      setRightWeights(prev => prev.filter(w => w.id !== id));
    }
    setMessage(null);
  };

  const resetScales = useCallback(() => {
    setLeftWeights([]);
    setRightWeights([]);
    setMessage(null);
  }, []);

  const sumLeft = sumArray(leftWeights.map(w => w.value));
  const sumRight = sumArray(rightWeights.map(w => w.value));
  
  let commonDivisor = 1;
  if (sumLeft !== 0 || sumRight !== 0) { // Avoid gcd(0,0)
    commonDivisor = gcd(sumLeft, sumRight);
    if (commonDivisor === 0 && (sumLeft !== 0 || sumRight !== 0)) commonDivisor = 1; // if one is 0, gcd might be the non-zero, but for ratio, keep it simple
    else if (commonDivisor === 0 && sumLeft === 0 && sumRight === 0) commonDivisor = 1; // for 0:0 case
  }


  const simplifiedLeft = sumLeft === 0 && sumRight === 0 ? 0 : sumLeft / commonDivisor;
  const simplifiedRight = sumLeft === 0 && sumRight === 0 ? 0 : sumRight / commonDivisor;

  const isBalanced = sumLeft === sumRight && sumLeft !== 0; // Balanced if sums are equal and not zero

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Scale className="w-8 h-8" /> Ratio Scales
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Add weights to the scales to explore ratios and balance. Click a weight to add it to a pan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <WeightPalette weights={INITIAL_PALETTE_WEIGHTS} onAddWeight={handleAddWeight} />

        {message && <Alert><AlertDescription>{message}</AlertDescription></Alert>}

        <BalanceScale
          leftWeights={leftWeights}
          rightWeights={rightWeights}
          onRemoveWeight={handleRemoveWeight}
          sumLeft={sumLeft}
          sumRight={sumRight}
        />
        
        <ResultDisplay
          sumLeft={sumLeft}
          sumRight={sumRight}
          simplifiedLeft={simplifiedLeft}
          simplifiedRight={simplifiedRight}
          isBalanced={isBalanced}
        />

        <div className="flex justify-center pt-6 border-t">
          <Button onClick={resetScales} variant="outline">
            <RefreshCw className="mr-2 h-5 w-5" /> Reset Scales
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
