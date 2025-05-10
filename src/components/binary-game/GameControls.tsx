
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

  return (
    <div className="w-full max-w-md mx-auto mt-2 space-y-4">
      {hasFeedback && (
        <Alert
          variant={isGameOver ? 'default' : (isCorrect === null ? 'default' : isCorrect ? 'default' : 'destructive')}
          className={cn(
            isGameOver ? 'border-primary bg-primary/10 text-primary-foreground' : // Neutral prominent style for game over
            isCorrect === true ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' : 
            isCorrect === false ? 'border-destructive bg-destructive/10 text-destructive' : 
            '' 
          )}
        >
          {isGameOver && feedbackMessage && (
             <AlertTitle className="text-primary font-semibold">Game Over!</AlertTitle>
           )}
          {!isGameOver && isCorrect !== null && ( 
            <AlertTitle className={cn(
                isCorrect ? 'text-green-700 dark:text-green-400 font-semibold' : 'text-destructive font-semibold'
                )}>
              {isCorrect ? 'Correct!' : "Incorrect / Time's Up!"}
            </AlertTitle>
          )}
          <AlertDescription className={cn(isGameOver ? "text-foreground" : "")}>
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
