'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Send, RotateCcw } from 'lucide-react';

interface GameControlsHexProps {
  onSubmit: () => void;
  onNextRound: () => void;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  feedbackMessage: string | null;
  correctAnswerHex?: string;
  canSubmit: boolean;
}

export default function GameControlsHex({
  onSubmit,
  onNextRound,
  isSubmitted,
  isCorrect,
  feedbackMessage,
  correctAnswerHex,
  canSubmit,
}: GameControlsHexProps) {
  
  const alertVariant = isCorrect === false ? 'destructive' : 'default';
  const alertCustomClasses = cn(
    isCorrect === true ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' :
    isCorrect === false ? 'border-destructive bg-destructive/10 text-destructive' : ''
  );

  const feedbackIcon = isCorrect === true ? <CheckCircle className="h-5 w-5" /> : 
                       isCorrect === false ? <XCircle className="h-5 w-5" /> : null;
  
  const feedbackTitleText = isCorrect === true ? "Correct!" :
                            isCorrect === false ? "Incorrect!" : null;

  const feedbackTitleColor = isCorrect === true ? "text-green-700 dark:text-green-400" : 
                             isCorrect === false ? "text-destructive" : "";

  return (
    <div className="w-full max-w-md mx-auto mt-6 space-y-4">
      {feedbackMessage && isSubmitted && (
        <Alert variant={alertVariant} className={cn("text-center", alertCustomClasses)}>
          {feedbackIcon && (
            <div className="flex items-center justify-center gap-2 mb-1">
              {feedbackIcon}
              <AlertTitle className={cn(feedbackTitleColor, "font-semibold")}>
                {feedbackTitleText}
              </AlertTitle>
            </div>
          )}
          <AlertDescription>
            {feedbackMessage}
            {isCorrect === false && correctAnswerHex && (
              <span className="block mt-1">Correct answer: <strong className="font-mono">{correctAnswerHex}</strong></span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center gap-3">
        {!isSubmitted ? (
          <Button 
            onClick={onSubmit} 
            className="w-full sm:w-auto px-8 py-3 text-lg" 
            disabled={!canSubmit}
            size="lg"
          >
            <Send className="mr-2 h-5 w-5" />
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={onNextRound} 
            className="w-full sm:w-auto px-8 py-3 text-lg"
            variant="outline"
            size="lg"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Next Round
          </Button>
        )}
         <Button 
            onClick={onNextRound} 
            variant="link" 
            className={cn("text-sm", isSubmitted ? 'hidden' : '')} // Hide if already submitted to prevent confusion
            disabled={isSubmitted} // Also disable to be safe
        >
            Skip / New Number
        </Button>
      </div>
    </div>
  );
}
