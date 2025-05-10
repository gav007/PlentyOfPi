
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AnglePrompt from './AnglePrompt';
import GameControlsUnitCircle from './GameControlsUnitCircle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Trophy, Repeat, Info, FlagCheckered, HelpCircle } from 'lucide-react'; // Added FlagCheckered for game over, HelpCircle for turn

interface UnitCircleGamePanelProps {
  targetAngleRad: number;
  onLockIn: () => void;
  correctCount: number;
  maxTurns: number;
  turn: number;
  feedbackMessage: string | null;
  isCorrect: boolean | null;
  isGameInteractionLocked: boolean;
  isGameOver: boolean;
}

export default function UnitCircleGamePanel({
  targetAngleRad,
  onLockIn,
  correctCount,
  maxTurns,
  turn,
  feedbackMessage,
  isCorrect,
  isGameInteractionLocked,
  isGameOver,
}: UnitCircleGamePanelProps) {
  
  const alertVariant = isCorrect === false && !isGameOver ? 'destructive' : 'default';
  const alertCustomClasses = cn(
    isGameOver ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400' :
    isCorrect === true ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' :
    isCorrect === false ? 'border-destructive bg-destructive/10 text-destructive' :
    'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400' 
  );
  
  const feedbackIcon = isGameOver ? <FlagCheckered className="h-5 w-5" /> :
                       isCorrect === true ? <CheckCircle className="h-5 w-5" /> : 
                       isCorrect === false ? <XCircle className="h-5 w-5" /> : 
                       <Info className="h-5 w-5" />;

  const feedbackTitleText = isGameOver ? "Game Over!" :
                            isCorrect === true ? "Correct!" :
                            isCorrect === false ? "Incorrect!" :
                            "Status";
  
  const feedbackTitleColor = isGameOver ? "text-purple-700 dark:text-purple-400" :
                             isCorrect === true ? "text-green-700 dark:text-green-400" : 
                             isCorrect === false ? "text-destructive" : 
                             "text-blue-700 dark:text-blue-400";


  return (
    <Card className="shadow-lg mt-6 md:mt-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Game Challenge
        </CardTitle>
        <CardDescription>
          {isGameOver ? "Game has ended. See your results below." : `Match the target angle on the circle. Turn ${turn}/${maxTurns}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isGameOver && <AnglePrompt targetAngleRad={targetAngleRad} /> }

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-muted/30 rounded-lg shadow-sm">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4"/> SCORE
            </span>
            <span className="font-mono text-lg sm:text-xl text-primary">
              {correctCount} / {maxTurns}
            </span>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg shadow-sm">
            <span className="font-semibold text-muted-foreground block text-xs sm:text-sm flex items-center justify-center gap-1">
              <HelpCircle className="w-4 h-4"/> TURN
            </span>
            <span className="font-mono text-lg sm:text-xl text-primary">
              {isGameOver ? `Ended` : `${Math.min(turn, maxTurns)} / ${maxTurns}`}
            </span>
          </div>
        </div>
        
        {!isGameOver && (
            <GameControlsUnitCircle onLockIn={onLockIn} isGameInteractionLocked={isGameInteractionLocked} />
        )}

        {feedbackMessage && (
          <Alert variant={alertVariant} className={cn("mt-4", alertCustomClasses)}>
            <div className="flex items-center gap-2">
              {feedbackIcon}
              <AlertTitle className={cn(feedbackTitleColor, "font-semibold")}>
                {feedbackTitleText}
              </AlertTitle>
            </div>
            <AlertDescription className="pl-7">
              {feedbackMessage}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
