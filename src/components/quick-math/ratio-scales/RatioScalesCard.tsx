
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BalanceScale from './BalanceScale';
import WeightPalette from './WeightPalette';
import ResultDisplay from './ResultDisplay';
import GameInfoPanel from './GameInfoPanel';
import { sumArray, gcd } from '@/lib/mathUtils';
import { Scale, RefreshCw, Target as TargetIcon, History } from 'lucide-react'; // Added TargetIcon and History

export interface Weight {
  id: string;
  value: number;
}

export interface Ratio {
  left: number;
  right: number;
}

export type GameStatus = 'playing' | 'balanced' | 'gameOver';

const INITIAL_PALETTE_WEIGHTS: number[] = [1, 2, 3, 5, 10];
const MAX_ATTEMPTS = 10;

function generateTargetRatio(): Ratio {
  let left = Math.floor(Math.random() * 9) + 1;
  let right = Math.floor(Math.random() * 9) + 1;
  
  // Ensure left and right are not the same for more interesting ratios, unless it's specifically 1:1
  if (left === right) {
    // Allow 1:1, but reroll for other identical values to get diverse ratios
    if (left !== 1) { 
        right = Math.floor(Math.random() * 9) + 1;
        while (left === right && left !==1 ) { // ensure it's not same again if not 1:1
             right = Math.floor(Math.random() * 9) + 1;
        }
    }
  }

  const common = gcd(left, right);
  return { left: left / common, right: right / common };
}

export default function RatioScalesCard() {
  const [leftWeights, setLeftWeights] = useState<Weight[]>([]);
  const [rightWeights, setRightWeights] = useState<Weight[]>([]);
  
  const [targetRatio, setTargetRatio] = useState<Ratio>({ left: 1, right: 1 });
  const [attemptsLeft, setAttemptsLeft] = useState<number>(MAX_ATTEMPTS);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');

  const sumLeft = sumArray(leftWeights.map(w => w.value));
  const sumRight = sumArray(rightWeights.map(w => w.value));
  
  let commonDivisor = 1;
  if (sumLeft !== 0 || sumRight !== 0) {
    commonDivisor = gcd(sumLeft, sumRight);
    if (commonDivisor === 0 && (sumLeft !== 0 || sumRight !== 0)) commonDivisor = 1;
    else if (commonDivisor === 0 && sumLeft === 0 && sumRight === 0) commonDivisor = 1;
  }

  const simplifiedLeft = sumLeft === 0 && sumRight === 0 ? 0 : sumLeft / commonDivisor;
  const simplifiedRight = sumLeft === 0 && sumRight === 0 ? 0 : sumRight / commonDivisor;
  const isCurrentlyBalanced = sumLeft === sumRight && sumLeft !== 0;


  const checkGameStatus = useCallback(() => {
    if (gameStatus !== 'playing') return; // Don't re-evaluate if already balanced or game over

    const currentRatioMatchesTarget = 
      simplifiedLeft === targetRatio.left && 
      simplifiedRight === targetRatio.right &&
      (sumLeft > 0 || sumRight > 0 || (targetRatio.left === 0 && targetRatio.right === 0)); // handles 0:0 target if ever needed

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
    setAttemptsLeft(MAX_ATTEMPTS);
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    startGame(); // Initialize game on first load
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
    // checkGameStatus will be called by useEffect due to sumLeft/sumRight/attemptsLeft change
  };

  const handleRemoveWeight = (side: 'left' | 'right', id: string) => {
    if (gameStatus !== 'playing') return; // Allow removal even if attempts are 0, but not if game is over/balanced

    if (side === 'left') {
      setLeftWeights(prev => prev.filter(w => w.id !== id));
    } else {
      setRightWeights(prev => prev.filter(w => w.id !== id));
    }
    // Removing a weight does not cost an attempt or restore one
    // checkGameStatus will be called by useEffect due to sumLeft/sumRight change
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Scale className="w-8 h-8" /> Ratio Scales Challenge
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Balance the scales to match the target ratio within {MAX_ATTEMPTS} weight placements.
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
          isBalanced={isCurrentlyBalanced}
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
