
'use client';

import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface GameControlsUnitCircleProps {
  onLockIn: () => void;
  isGameInteractionLocked: boolean;
}

export default function GameControlsUnitCircle({ onLockIn, isGameInteractionLocked }: GameControlsUnitCircleProps) {
  return (
    <div className="mt-4 flex justify-center">
      <Button
        onClick={onLockIn}
        disabled={isGameInteractionLocked}
        size="lg"
        className="w-full max-w-xs"
      >
        <Send className="mr-2 h-5 w-5" />
        Lock In Guess
      </Button>
    </div>
  );
}
