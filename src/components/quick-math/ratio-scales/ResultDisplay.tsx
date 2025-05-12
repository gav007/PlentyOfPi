
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GameStatus, Ratio } from './RatioScalesCard';

interface ResultDisplayProps {
  sumLeft: number;
  sumRight: number;
  simplifiedLeft: number;
  simplifiedRight: number;
  isBalanced: boolean; // Current visual balance
  gameStatus: GameStatus;
  targetRatio: Ratio;
}

export default function ResultDisplay({
  sumLeft,
  sumRight,
  simplifiedLeft,
  simplifiedRight,
  isBalanced,
  gameStatus,
  targetRatio,
}: ResultDisplayProps) {
  
  let titleIcon, titleText, titleColor, descriptionText;

  switch (gameStatus) {
    case 'balanced':
      titleIcon = <CheckCircle className="w-6 h-6"/>;
      titleText = "Balanced & Ratio Matched!";
      titleColor = "text-green-600";
      descriptionText = `You've successfully matched the target ratio of ${targetRatio.left}:${targetRatio.right}!`;
      break;
    case 'gameOver':
      titleIcon = <Flag className="w-6 h-6"/>;
      titleText = "Game Over!";
      titleColor = "text-destructive";
      descriptionText = `Out of attempts. The target ratio was ${targetRatio.left}:${targetRatio.right}. Current simplified ratio: ${simplifiedLeft}:${simplifiedRight}.`;
      break;
    default: // 'playing'
      titleIcon = <AlertTriangle className="w-6 h-6"/>;
      titleText = isBalanced ? "Balanced (Ratio Mismatch)" : "Unbalanced";
      titleColor = isBalanced ? "text-orange-500" : "text-foreground"; // Orange if balanced but not target ratio
      descriptionText = `Target ratio: ${targetRatio.left}:${targetRatio.right}. Keep trying!`;
      break;
  }
  
  return (
    <Card className={cn(
        "mt-6 text-center border-2",
        gameStatus === 'balanced' ? "border-green-500 bg-green-500/10" : 
        gameStatus === 'gameOver' ? "border-destructive bg-destructive/10" :
        isBalanced ? "border-orange-500 bg-orange-500/10" : "border-border bg-card"
    )}>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className={cn(
            "text-xl flex items-center justify-center gap-2",
            titleColor
        )}>
          {titleIcon}
          {titleText}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">{descriptionText}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
                <p className="text-sm text-muted-foreground">Current Weights</p>
                <p className="text-3xl font-bold">
                    <span className={cn(sumLeft > sumRight ? "text-primary" : "text-foreground")}>{sumLeft}</span>
                    <span className="text-muted-foreground mx-2">:</span>
                    <span className={cn(sumRight > sumLeft ? "text-primary" : "text-foreground")}>{sumRight}</span>
                </p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Current Simplified Ratio</p>
                <p className="text-3xl font-bold">
                    <span className={cn(simplifiedLeft > simplifiedRight && !isBalanced ? "text-accent-foreground" : "text-foreground")}>{simplifiedLeft}</span>
                    <span className="text-muted-foreground mx-2">:</span>
                    <span className={cn(simplifiedRight > simplifiedLeft && !isBalanced ? "text-accent-foreground" : "text-foreground")}>{simplifiedRight}</span>
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
