
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackJsProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
}

export default function FeedbackJs({ isCorrect, correctAnswer, explanation }: FeedbackJsProps) {
  return (
    <Alert
      variant={isCorrect ? 'default' : 'destructive'}
      className={cn(
        isCorrect 
          ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400" 
          : "bg-destructive/10 border-destructive/50 text-destructive"
      )}
    >
      <div className="flex items-center gap-2">
        {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        <AlertTitle className="font-semibold">
          {isCorrect ? "Correct!" : "Incorrect!"}
        </AlertTitle>
      </div>
      <AlertDescription className="mt-1 pl-7 text-xs">
        {!isCorrect && (
          <p className="mb-1">The correct output was: <strong className="font-mono">{correctAnswer}</strong></p>
        )}
        {explanation && <p>{explanation}</p>}
      </AlertDescription>
    </Alert>
  );
}
