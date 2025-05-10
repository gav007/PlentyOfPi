
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
          variant={isCorrect === null ? 'default' : isCorrect ? 'default' : 'destructive'}
          className={cn(
            isCorrect === true ? 'border-green-500 bg-green-500/10 text-green-700' : 
            isCorrect === false ? 'border-destructive bg-destructive/10 text-destructive' : 
            '' // Neutral if isCorrect is null (e.g. initial game over message)
          )}
        >
          {isCorrect !== null && !isGameOver && ( // Don't show Correct/Incorrect title for final game over message
            <AlertTitle className={cn(isCorrect ? 'text-green-700' : 'text-destructive')}>
              {isCorrect ? 'Correct!' : "Incorrect!"}
            </AlertTitle>
          )}
           {isGameOver && feedbackMessage && ( // Special title for game over
             <AlertTitle className="text-primary">Game Over!</AlertTitle>
           )}
          <AlertDescription>
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
