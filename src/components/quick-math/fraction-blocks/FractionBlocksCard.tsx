
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BlockPalette from './BlockPalette';
import Workspace from './Workspace';
import ResultBar from './ResultBar';
import { gcd, lcmArray, sumArray } from '@/lib/mathUtils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Puzzle, RefreshCw, Sigma } from 'lucide-react';

export interface Fraction {
  id: string; // Unique ID for key prop
  num: number;
  den: number;
}

const INITIAL_PALETTE_FRACTIONS: Omit<Fraction, 'id'>[] = [
  { num: 1, den: 2 }, { num: 1, den: 3 }, { num: 1, den: 4 },
  { num: 1, den: 5 }, { num: 1, den: 6 }, { num: 1, den: 8 },
  { num: 2, den: 3 }, { num: 3, den: 4 },
];

export default function FractionBlocksCard() {
  const [workspaceBlocks, setWorkspaceBlocks] = useState<Fraction[]>([]);
  const [result, setResult] = useState<{ num: number; den: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddBlockToWorkspace = (fraction: Omit<Fraction, 'id'>) => {
    if (workspaceBlocks.length >= 5) { // Limit number of blocks for simplicity
        setError("Maximum of 5 blocks allowed in workspace.");
        setTimeout(() => setError(null), 3000);
        return;
    }
    setWorkspaceBlocks(prev => [...prev, { ...fraction, id: crypto.randomUUID() }]);
    setResult(null); // Clear previous result when a new block is added
    setError(null);
  };

  const handleRemoveBlockFromWorkspace = (id: string) => {
    setWorkspaceBlocks(prev => prev.filter(block => block.id !== id));
    setResult(null);
  };

  const computeSum = useCallback(() => {
    if (workspaceBlocks.length === 0) {
      setError("Add some fraction blocks to the workspace first!");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (workspaceBlocks.some(b => b.den === 0)) {
        setError("Cannot compute sum with a zero denominator.");
        setTimeout(() => setError(null), 3000);
        return;
    }

    const denominators = workspaceBlocks.map(b => b.den);
    const commonDenominator = lcmArray(denominators);

    if (commonDenominator === 0) { // Should be caught by b.den === 0 check, but good to have
        setError("Error calculating common denominator (possibly due to zero denominator).");
        setTimeout(() => setError(null), 3000);
        return;
    }

    let sumNumerator = 0;
    workspaceBlocks.forEach(block => {
      sumNumerator += block.num * (commonDenominator / block.den);
    });

    const commonDivisor = gcd(sumNumerator, commonDenominator);
    setResult({
      num: sumNumerator / commonDivisor,
      den: commonDenominator / commonDivisor,
    });
    setError(null);
  }, [workspaceBlocks]);

  const resetWorkspace = () => {
    setWorkspaceBlocks([]);
    setResult(null);
    setError(null);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Puzzle className="w-8 h-8" /> Fraction Blocks
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Click blocks from the palette to add them to the workspace, then compute their sum.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <BlockPalette fractions={INITIAL_PALETTE_FRACTIONS} onAddBlock={handleAddBlockToWorkspace} />
        
        <Workspace blocks={workspaceBlocks} onRemoveBlock={handleRemoveBlockFromWorkspace} />

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && <ResultBar num={result.num} den={result.den} originalBlocks={workspaceBlocks} />}

        <div className="flex justify-center items-center space-x-4 pt-4 border-t">
          <Button onClick={computeSum} disabled={workspaceBlocks.length === 0}>
            <Sigma className="mr-2 h-5 w-5" /> Compute Sum
          </Button>
          <Button onClick={resetWorkspace} variant="outline">
            <RefreshCw className="mr-2 h-5 w-5" /> Reset Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
