
'use client';

import { Button } from '@/components/ui/button';
import type { FractionValue } from '@/types/fractionDuel';
import { FractionDisplay } from './FractionExpression'; // Re-use for consistent display

interface AnswerOptionsProps {
  choices: FractionValue[];
  onSelect: (answer: FractionValue) => void;
  disabled: boolean;
}

export default function AnswerOptions({ choices, onSelect, disabled }: AnswerOptionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 my-6">
      {choices.map((choice, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-3 sm:p-4 shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 ease-in-out bg-card flex flex-col items-center justify-center text-lg"
          onClick={() => onSelect(choice)}
          disabled={disabled}
          aria-label={`Select answer ${choice.num}/${choice.den}`}
        >
          <FractionDisplay fraction={choice} isResult={true} />
        </Button>
      ))}
    </div>
  );
}
