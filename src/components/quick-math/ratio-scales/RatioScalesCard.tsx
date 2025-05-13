
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BalanceScale from './BalanceScale';
import WeightPalette from './WeightPalette';
import ResultDisplay from './ResultDisplay';
import GameInfoPanel from './GameInfoPanel';
import { sumArray, gcd } from '@/lib/mathUtils';
import { Scale, RefreshCw } from 'lucide-react';

export interface Weight {
  id: string;
  value: number;
}

export interface Ratio {
  left: number;
  right: number;
}

export type GameStatus = 'playing' | 'balanced' | 'gameOver';

const INITIAL_PALETTE_WEIGHTS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Expanded palette
const MAX_ATTEMPTS_GAME = 10; // Renamed from MAX_ATTEMPTS to avoid confusion

function generateTargetRatio(attempt = 0): Ratio {
  const MAX_GENERATION_ATTEMPTS = 10;
  if (attempt > MAX_GENERATION_ATTEMPTS) {
    // Fallback to a simple ratio if generation gets stuck
    const rVal = () => Math.floor(Math.random() * 3) + 1; // 1 to 3
    let fbLeft = rVal();
    let fbRight = rVal();
    while (fbLeft === fbRight && fbLeft !==1) fbRight = rVal(); // try to make them different if not 1:1
    const fbCommon = gcd(fbLeft, fbRight);
    return { left: fbLeft / fbCommon, right: fbRight / fbCommon };
  }

  let leftBase = Math.floor(Math.random() * 11) + 2; // Generates 2 to 12
  let rightBase = Math.floor(Math.random() * 11) + 2; // Generates 2 to 12

  // Ensure they are not initially the same to encourage more diverse simplified ratios
  while (leftBase === rightBase) {
    rightBase = Math.floor(Math.random() * 11) + 2;
  }

  const commonDivisor = gcd(leftBase, rightBase);
  const simplifiedLeft = leftBase / commonDivisor;
  const simplifiedRight = rightBase / commonDivisor;

  const sumSimplified = simplifiedLeft + simplifiedRight;

  // Reroll if the ratio is too simple (e.g. 1:2, 2:1, 1:3, 3:1) too often, but allow 1:1.
  // This aims for target ratios like 3:2, 4:3, 5:2 etc. more frequently.
  if (sumSimplified < 4 && !(simplifiedLeft === 1 && simplifiedRight === 1)) {
    // If sum is less than 4 (e.g., 1:2 (sum=3) or 2:1 (sum=3)) and it's not 1:1, reroll.
    return generateTargetRatio(attempt + 1);
  }
  // Further condition: if one side is 1 and the sum is small (like 1:3, 1:4), give a chance to reroll.
  if ((simplifiedLeft === 1 || simplifiedRight === 1) && sumSimplified < 6 && !(simplifiedLeft === 1 && simplifiedRight === 1)) {
    if (Math.random() < 0.6) { // 60% chance to reroll "simple-ish" ratios
      return generateTargetRatio(attempt + 1);
    }
  }

  return { left: simplifiedLeft, right: simplifiedRight };
}

export default function RatioScalesCard() {
  const [leftWeights, setLeftWeights] = useState<Weight[]>([]);
  const [rightWeights, setRightWeights] = useState<Weight[]>([]);
  
  const [targetRatio, setTargetRatio] = useState<Ratio>({ left: 1, right: 1 });
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS_GAME);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

  const sumLeft = sumArray(leftWeights.map(w => w.value));
  const sumRight = sumArray(rightWeights.map(w => w.value));
  
  let commonDivisor = 1;
  if (sumLeft !== 0 || sumRight !== 0) { // Ensure not dividing by zero if both sums are zero
    commonDivisor = gcd(sumLeft, sumRight);
    if (commonDivisor === 0) commonDivisor = 1; // Should not happen if sums are non-zero, but safety.
  } else { // Both sums are 0
    commonDivisor = 1; // Ratio is 0:0, simplified is 0:0
  }
  
  const simplifiedLeft = sumLeft === 0 && sumRight === 0 ? 0 : sumLeft / commonDivisor;
  const simplifiedRight = sumLeft === 0 && sumRight === 0 ? 0 : sumRight / commonDivisor;
  const isCurrentlyBalancedVisually = sumLeft === sumRight && sumLeft !== 0; // For visual tilt only

  const checkGameStatus = useCallback(() => {
    if (gameStatus !== 'playing') return;

    const currentRatioMatchesTarget = 
      simplifiedLeft === targetRatio.left && 
      simplifiedRight === targetRatio.right &&
      (sumLeft > 0 || sumRight > 0 || (targetRatio.left === 0 && targetRatio.right === 0));

    if (currentRatioMatchesTarget) {
      setGameStatus('balanced');
    } else if (attemptsLeft <= 0) {
      setGameStatus('gameOver');
    }
  }, [simplifiedLeft, simplifiedRight, targetRatio, attemptsLeft, sumLeft, sumRight, gameStatus]);

  useEffect(() => {
    checkGameStatus();
  }, [sumLeft, sumRight, attemptsLeft, checkGameStatus]);


  const startGame = useCallback(() => {
    setTargetRatio(generateTargetRatio());
    setLeftWeights([]);
    setRightWeights([]);
    setAttemptsLeft(MAX_ATTEMPTS_GAME);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleAddWeight = (side: 'left' | 'right', value: number) => {
    if (gameStatus !== 'playing' || attemptsLeft <= 0) return;

    const newWeight: Weight = { id: crypto.randomUUID(), value };
    if (side === 'left') {
      setLeftWeights(prev => [...prev, newWeight]);
    } else {
      setRightWeights(prev => [...prev, newWeight]);
    }
    setAttemptsLeft(prev => prev - 1);
  };

  const handleRemoveWeight = (side: 'left' | 'right', id: string) => {
    if (gameStatus !== 'playing') return;

    if (side === 'left') {
      setLeftWeights(prev => prev.filter(w => w.id !== id));
    } else {
      setRightWeights(prev => prev.filter(w => w.id !== id));
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Scale className="w-8 h-8" /> Ratio Scales Challenge
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Balance the scales to match the target ratio within {MAX_ATTEMPTS_GAME} weight placements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <GameInfoPanel 
            targetRatio={targetRatio} 
            attemptsLeft={attemptsLeft} 
            gameStatus={gameStatus}
        />

        <WeightPalette 
            weights={INITIAL_PALETTE_WEIGHTS} 
            onAddWeight={handleAddWeight} 
            disabled={gameStatus !== 'playing' || attemptsLeft <= 0}
        />

        <BalanceScale
          leftWeights={leftWeights}
          rightWeights={rightWeights}
          onRemoveWeight={handleRemoveWeight}
          sumLeft={sumLeft}
          sumRight={sumRight}
          disabled={gameStatus !== 'playing'}
        />
        
        <ResultDisplay
          sumLeft={sumLeft}
          sumRight={sumRight}
          simplifiedLeft={simplifiedLeft}
          simplifiedRight={simplifiedRight}
          isBalanced={isCurrentlyBalancedVisually}
          gameStatus={gameStatus}
          targetRatio={targetRatio}
        />

        <div className="flex justify-center pt-6 border-t">
          <Button onClick={startGame} variant="outline">
            <RefreshCw className="mr-2 h-5 w-5" /> New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
