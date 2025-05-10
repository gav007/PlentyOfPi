import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface BitSwitchRowProps {
  bits: number[];
  onToggleBit: (index: number) => void;
  bitCount: number;
  disabled?: boolean;
}

export default function BitSwitchRow({ bits, onToggleBit, bitCount, disabled = false }: BitSwitchRowProps) {
  const currentBits = [...bits];
  while (currentBits.length < bitCount) {
    currentBits.unshift(0);
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
          variant="outline" // Base variant, will be overridden by custom classes
          onClick={() => onToggleBit(index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          aria-pressed={bit === 1}
          aria-label={`Toggle bit ${bitCount - 1 - index}, current value ${bit === 1 ? 'ON' : 'OFF'}`}
          tabIndex={0}
          disabled={disabled}
          className={cn(
            'w-14 h-8 flex items-center justify-center rounded-md font-mono text-xs sm:text-sm', // Rectangular switch style
            bit === 1 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            'shadow-md hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-primary focus:ring-offset-2'
          )}
        >
          {bit === 1 ? 'ON' : 'OFF'}
        </Button>
      ))}
    </div>
  );
}
