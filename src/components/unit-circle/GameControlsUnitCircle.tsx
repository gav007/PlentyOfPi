
'use client';

import { Button } from '@/components/ui/button';
import { Send, RotateCcw } from 'lucide-react'; // Added RotateCcw for Play Again

interface GameControlsUnitCircleProps {
  onLockIn: () => void;
  isGameInteractionLocked: boolean;
  isGameOver: boolean; // New prop
  onRestartGame: () => void; // New prop
}

export default function GameControlsUnitCircle({ 
  onLockIn, 
  isGameInteractionLocked,
  isGameOver,
  onRestartGame
}: GameControlsUnitCircleProps) {
  return (
    <div className="mt-4 flex justify-center">
      {isGameOver ? (
        <Button
          onClick={onRestartGame}
          size="lg"
          className="w-full max-w-xs"
          variant="outline"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Play Again
        </Button>
      ) : (
        <Button
          onClick={onLockIn}
          disabled={isGameInteractionLocked}
          size="lg"
          className="w-full max-w-xs"
        >
          <Send className="mr-2 h-5 w-5" />
          Lock In Guess
        </Button>
      )}
    </div>
  );
}
