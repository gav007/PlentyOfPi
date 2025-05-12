
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OptionsProps {
  options: string[];
  selectedOption: string | null;
  correctOption: string | null; // Revealed after submission
  onSelect: (option: string) => void;
  disabled: boolean;
}

export default function Options({ options, selectedOption, correctOption, onSelect, disabled }: OptionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground mb-1">Choose the correct output:</h3>
      {options.map((option, index) => {
        const isSelected = selectedOption === option;
        const isCorrect = correctOption === option;
        const isSubmittedAndSelected = correctOption !== null && isSelected;

        return (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "w-full justify-start text-left h-auto py-3 px-4 font-mono text-sm",
              "hover:bg-accent/80",
              disabled && "cursor-not-allowed opacity-70",
              isSelected && !correctOption && "ring-2 ring-primary bg-primary/10", // Highlight selection before submission
              isSubmittedAndSelected && isCorrect && "bg-green-500/20 border-green-500 text-green-700 hover:bg-green-500/30 ring-2 ring-green-500",
              isSubmittedAndSelected && !isCorrect && "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30 ring-2 ring-destructive",
              correctOption && isCorrect && !isSelected && "border-green-500 text-green-700" // Highlight correct if not selected
            )}
            onClick={() => onSelect(option)}
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
