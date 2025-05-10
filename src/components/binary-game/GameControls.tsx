// No 'use client' needed if it's just presenting props from parent
// import { 'use client'; } // Keep if there are client-side interactions within this component itself.

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  feedbackMessage: string | null;
  isCorrect: boolean | null;
  onCheckAnswer: () => void;
  onNextChallenge: () => void;
  isChallengeActive: boolean;
  timeLeft: number; // Needed to disable submit button
}

export default function GameControls({
  feedbackMessage,
  isCorrect,
  onCheckAnswer,
  onNextChallenge,
  isChallengeActive,
  timeLeft,
}: GameControlsProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-2 space-y-4">
      {feedbackMessage && (
        <Alert
          variant={isCorrect === null ? 'default' : isCorrect ? 'default' : 'destructive'}
          className={cn(isCorrect === true ? 'border-green-500 bg-green-500/10' : isCorrect === false ? 'border-destructive bg-destructive/10' : '')}
        >
          {isCorrect !== null && (
            <AlertTitle className={cn(isCorrect ? 'text-green-700' : 'text-destructive')}>
              {isCorrect ? 'Correct!' : "Incorrect!"}
            </AlertTitle>
          )}
          <AlertDescription className={cn(isCorrect ? 'text-green-600' : '')}>
            {feedbackMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        {isChallengeActive ? (
          <Button onClick={onCheckAnswer} className="w-full" disabled={timeLeft === 0}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={onNextChallenge} className="w-full">
            Next Challenge
          </Button>
        )}
      </div>
    </div>
  );
}
