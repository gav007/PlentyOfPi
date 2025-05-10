'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  gameMode: boolean;
  targetDecimal: number | null;
  score: number;
  timeLeft: number;
  feedbackMessage: string | null;
  isCorrect: boolean | null;
  onCheckAnswer: () => void;
  onNextChallenge: () => void;
  isChallengeActive: boolean;
}

export default function GameControls({
  gameMode,
  targetDecimal,
  score,
  timeLeft,
  feedbackMessage,
  isCorrect,
  onCheckAnswer,
  onNextChallenge,
  isChallengeActive,
}: GameControlsProps) {
  if (!gameMode) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-2xl text-primary">Game Mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {targetDecimal !== null && (
          <div className="text-center p-3 bg-secondary rounded-md">
            <CardDescription className="text-sm sm:text-base">Your Target Decimal:</CardDescription>
            <p className="text-3xl sm:text-4xl font-bold text-primary">{targetDecimal}</p>
          </div>
        )}

        <div className="flex justify-around text-center">
          <div>
            <CardDescription className="text-sm sm:text-base">Score</CardDescription>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">{score}</p>
          </div>
          <div>
            <CardDescription className="text-sm sm:text-base">Time Left</CardDescription>
            <p className={cn(
                "text-xl sm:text-2xl font-semibold",
                timeLeft <= 10 && timeLeft > 0 ? "text-destructive animate-pulse" : "text-foreground"
              )}
            >
              {timeLeft > 0 ? `${timeLeft}s` : "Time's up!"}
            </p>
          </div>
        </div>

        {feedbackMessage && (
          <Alert variant={isCorrect === null ? "default" : isCorrect ? "default" : "destructive"} className={cn(isCorrect ? "border-green-500" : "")} >
             {isCorrect !== null && (
              <AlertTitle className={cn(isCorrect ? "text-green-700" : "text-destructive")}>
                {isCorrect ? "Correct!" : "Incorrect!"}
              </AlertTitle>
            )}
            <AlertDescription className={cn(isCorrect ? "text-green-600" : "")}>{feedbackMessage}</AlertDescription>
          </Alert>
        )}

        {isChallengeActive ? (
          <Button onClick={onCheckAnswer} className="w-full" disabled={timeLeft === 0}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={onNextChallenge} className="w-full">
            Next Challenge
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
