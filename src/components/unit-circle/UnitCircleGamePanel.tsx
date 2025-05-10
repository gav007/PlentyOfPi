
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AnglePrompt from './AnglePrompt';
import GameControlsUnitCircle from './GameControlsUnitCircle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Trophy, Repeat, Info } from 'lucide-react';

interface UnitCircleGamePanelProps {
  targetAngleRad: number;
  onLockIn: () => void;
  score: number;
  streak: number;
  feedbackMessage: string | null;
  isCorrect: boolean | null;
  isGameInteractionLocked: boolean;
}

export default function UnitCircleGamePanel({
  targetAngleRad,
  onLockIn,
  score,
  streak,
  feedbackMessage,
  isCorrect,
  isGameInteractionLocked,
}: UnitCircleGamePanelProps) {
  
  const alertVariant = isCorrect === false ? 'destructive' : 'default';
  const alertCustomClasses = cn(
    isCorrect === true ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' :
    isCorrect === false ? 'border-destructive bg-destructive/10 text-destructive' :
    'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400' // Neutral/informative if no feedback yet
  );
  const feedbackIcon = isCorrect === true ? <CheckCircle className="h-5 w-5" /> : isCorrect === false ? <XCircle className="h-5 w-5" /> : <Info className="h-5 w-5" />;


  return (
    <Card className="shadow-lg mt-6 md:mt-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Game Challenge
        </CardTitle>
        <CardDescription>Match the target angle on the circle.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnglePrompt targetAngleRad={targetAngleRad} />

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-muted/30 rounded-lg shadow-sm">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4"/> SCORE
            </span>
            <span className="font-mono text-lg sm:text-xl text-primary">
              {score}
            </span>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg shadow-sm">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm flex items-center justify-center gap-1">
              <Repeat className="w-4 h-4"/> STREAK
            </span>
            <span className="font-mono text-lg sm:text-xl text-primary">
              {streak}
            </span>
          </div>
        </div>
        
        <GameControlsUnitCircle onLockIn={onLockIn} isGameInteractionLocked={isGameInteractionLocked} />

        {feedbackMessage && (
          <Alert variant={alertVariant} className={cn("mt-4", alertCustomClasses)}>
            <div className="flex items-center gap-2">
              {feedbackIcon}
              <AlertTitle className={cn(isCorrect === true ? "text-green-700 dark:text-green-400" : isCorrect === false ? "text-destructive" : "text-blue-700 dark:text-blue-400", "font-semibold")}>
                {isCorrect === true ? 'Correct!' : isCorrect === false ? 'Incorrect!' : 'Status'}
              </AlertTitle>
            </div>
            <AlertDescription className="pl-7"> {/* Align with title after icon */}
              {feedbackMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
