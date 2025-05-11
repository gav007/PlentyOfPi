
'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { FractionValue, FractionExpressionDef } from '@/types/fractionDuel';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { FractionDisplay } from './FractionExpression';

interface GameFeedbackProps {
  isCorrect: boolean | null;
  correctAnswer: FractionValue;
  playerExpression: FractionExpressionDef; // To show what was asked
  selectedAnswer: FractionValue | null;
  onNext: () => void;
}

export default function GameFeedback({
  isCorrect,
  correctAnswer,
  // playerExpression, // Could be used to show the original question again
  selectedAnswer,
  onNext,
}: GameFeedbackProps) {
  const alertVariant = isCorrect === false ? 'destructive' : 'default';
  const alertCustomClasses = cn(
    isCorrect === true ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' :
    isCorrect === false ? 'border-destructive bg-destructive/10 text-destructive' : ''
  );

  const feedbackIcon = isCorrect === true ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />;
  const feedbackTitleText = isCorrect === true ? "Correct!" : "Incorrect!";
  const feedbackTitleColor = isCorrect === true ? "text-green-700 dark:text-green-400" : "text-destructive";

  return (
    <div className="w-full max-w-md mx-auto mt-6 space-y-4">
      <Alert variant={alertVariant} className={cn("text-center", alertCustomClasses)}>
        <div className="flex items-center justify-center gap-2 mb-1">
          {feedbackIcon}
          <AlertTitle className={cn(feedbackTitleColor, "font-semibold")}>
            {feedbackTitleText}
          </AlertTitle>
        </div>
        <AlertDescription className="space-y-2">
          {selectedAnswer && isCorrect === false && (
            <p>You selected: <FractionDisplay fraction={selectedAnswer} isResult /></p>
          )}
          <p>The correct answer was: <FractionDisplay fraction={correctAnswer} isResult /></p>
        </AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button onClick={onNext} size="lg">
          Next Question <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
