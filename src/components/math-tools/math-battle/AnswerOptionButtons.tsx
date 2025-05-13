
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnswerOptionButtonsProps {
  options: number[];
  onSelectOption: (option: number) => void;
  disabled: boolean;
  correctAnswer: number | null; // Revealed after submission
  selectedAnswer: number | null;
}

export default function AnswerOptionButtons({
  options,
  onSelectOption,
  disabled,
  correctAnswer,
  selectedAnswer,
}: AnswerOptionButtonsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const isCorrect = correctAnswer === option;
        
        let buttonClass = "bg-card hover:bg-accent/70 border-input";

        if (disabled && correctAnswer !== null) { // After submission
          if (isCorrect) {
            buttonClass = "bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/30 ring-2 ring-green-500";
          } else if (isSelected && !isCorrect) {
            buttonClass = "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30 ring-2 ring-destructive";
          } else {
            buttonClass = "opacity-60"; // Non-selected, incorrect options get dimmed
          }
        } else if (isSelected) { // Before submission, selected
            buttonClass = "ring-2 ring-primary bg-primary/10 border-primary hover:bg-primary/20";
        }


        return (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "w-full justify-center text-center h-auto py-4 px-2 text-lg sm:text-xl font-semibold min-h-[4rem] shadow-sm transition-all duration-150 ease-in-out",
              buttonClass,
              disabled && "cursor-not-allowed"
            )}
            onClick={() => onSelectOption(option)}
            disabled={disabled}
            aria-pressed={isSelected}
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
}
