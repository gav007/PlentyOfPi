import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BitSwitchRowProps {
  bits: number[];
  onToggleBit: (index: number) => void;
  bitCount: number;
  disabled?: boolean;
}

export default function BitSwitchRow({ bits, onToggleBit, bitCount, disabled = false }: BitSwitchRowProps) {
  // Ensure bits array matches bitCount for rendering
  const currentBits = [...bits];
  while (currentBits.length < bitCount) {
    currentBits.unshift(0); // Or decide how to handle mismatch
  }
  if (currentBits.length > bitCount) {
    currentBits.splice(0, currentBits.length - bitCount);
  }

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggleBit(index);
    }
  };

  return (
    <div
      className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mb-6"
      role="group"
      aria-label={`${bitCount}-bit binary input switches`}
    >
      {currentBits.map((bit, index) => (
        <Button
          key={index}
          variant="outline"
          size="icon"
          onClick={() => onToggleBit(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          aria-pressed={bit === 1}
          aria-label={`Toggle bit ${bitCount - 1 - index}, current value ${bit}. Represents ${Math.pow(2, bitCount - 1 - index)}.`}
          tabIndex={0}
          disabled={disabled}
          className={cn(
            'h-10 w-10 sm:h-12 sm:w-12 rounded-full transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2',
            bit === 1 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/80',
            'shadow-md hover:scale-105 active:scale-95'
          )}
        >
          {bitCount - 1 - index}
        </Button>
      ))}
    </div>
  );
}
