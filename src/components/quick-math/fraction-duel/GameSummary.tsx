
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, RotateCcw, Zap } from 'lucide-react';

interface GameSummaryProps {
  score: number;
  totalTurns: number;
  highestStreak: number;
  onRestart: () => void;
}

export default function GameSummary({ score, totalTurns, highestStreak, onRestart }: GameSummaryProps) {
  const accuracy = totalTurns > 0 ? ((score / totalTurns) * 100).toFixed(0) : 0;

  let performanceMessage = "Good effort! Keep practicing to improve your fraction skills.";
  if (Number(accuracy) >= 90) {
    performanceMessage = "Excellent work! You're a Fraction Master!";
  } else if (Number(accuracy) >= 70) {
    performanceMessage = "Great job! You've got a solid understanding.";
  } else if (Number(accuracy) >= 50) {
    performanceMessage = "Nice try! A bit more practice and you'll ace it.";
  }

  return (
    <Card className="text-center border-primary bg-primary/5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary-foreground flex items-center justify-center gap-2">
          <Award className="w-7 h-7" /> Game Over!
        </CardTitle>
        <CardDescription className="text-muted-foreground">{performanceMessage}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-lg">
          <div className="p-3 bg-background/60 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">FINAL SCORE</p>
            <p className="font-bold text-primary">{score} / {totalTurns}</p>
          </div>
          <div className="p-3 bg-background/60 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">ACCURACY</p>
            <p className="font-bold text-primary">{accuracy}%</p>
          </div>
          <div className="p-3 bg-background/60 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-muted-foreground">HIGHEST STREAK</p>
            <p className="font-bold text-primary">{highestStreak} 🔥</p>
          </div>
        </div>
        <Button onClick={onRestart} size="lg" className="mt-4">
          <RotateCcw className="mr-2 h-5 w-5" /> Play Again
        </Button>
      </CardContent>
    </Card>
  );
}
