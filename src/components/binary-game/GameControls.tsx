
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  feedbackMessage: string | null;
  isCorrect: boolean | null;
  onCheckAnswer: () => void;
  isChallengeActive: boolean;
  timeLeft: number;
  isGameOver: boolean;
  onRestartGame: () => void;
}

export default function GameControls({
  feedbackMessage,
  isCorrect,
  onCheckAnswer,
  isChallengeActive,
  timeLeft,
  isGameOver,
  onRestartGame,
}: GameControlsProps) {

  const hasFeedback = feedbackMessage !== null;

  const alertVariant = (isCorrect === false && !isGameOver) ? 'destructive' : 'default';

  const alertCustomClasses = cn(
    isGameOver ? 'border-primary bg-primary/10 text-primary-foreground' :
    isCorrect === true ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' :
    isCorrect === false ? 'border-destructive bg-destructive/10 text-destructive' : // This enhances the 'destructive' variant
    ''
  );

  const feedbackTitleClassName = cn(
    'font-semibold',
    isCorrect ? 'text-green-700 dark:text-green-400' : 'text-destructive'
  );

  const feedbackDescriptionClassName = cn(isGameOver ? "text-foreground" : "");

  return (
    <div className="w-full max-w-md mx-auto mt-2 space-y-4">
      {hasFeedback && (
        <Alert
          variant={alertVariant}
          className={alertCustomClasses}
        >
          {isGameOver && feedbackMessage && (
             <AlertTitle className="text-primary font-semibold">Game Over!</AlertTitle>
           )}
          {!isGameOver && isCorrect !== null && (
            <AlertTitle className={feedbackTitleClassName}>
              {isCorrect ? 'Correct!' : "Incorrect / Time's Up!"}
            </AlertTitle>
          )}
          <AlertDescription className={feedbackDescriptionClassName}>
            {feedbackMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        {isGameOver ? (
          <Button onClick={onRestartGame} className="w-full">
            Play Again
          </Button>
        ) : isChallengeActive ? (
          <Button onClick={onCheckAnswer} className="w-full" disabled={timeLeft === 0}>
            Submit Answer
          </Button>
        ) : null /* No button when auto-advancing or waiting for next turn */}
      </div>
    </div>
  );
}

