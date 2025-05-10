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
  // Ensure the array has the correct length for display
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
      className="flex flex-wrap justify-center items-center border-t border-border pt-3" // Added border-t, pt-3 for spacing
      role="group"
      aria-label={`${bitCount}-bit binary input switches`}
    >
      {currentBits.map((bit, index) => {
        // 'index' here is the visual index from MSB (left) to LSB (right)
        // if bits array is [MSB, ..., LSB]
        // The bit label should be (bitCount - 1 - index)
        const bitPositionLabel = bitCount - 1 - index;
        return (
          <Button
            key={index}
            variant="outline" // Base variant, overridden by custom classes
            onClick={() => onToggleBit(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-pressed={bit === 1}
            aria-label={`Toggle bit ${bitPositionLabel}, current value ${bit === 1 ? 'ON' : 'OFF'}`}
            tabIndex={0}
            disabled={disabled}
            className={cn(
              'w-8 h-6 flex items-center justify-center rounded font-bold text-xs shadow-md mx-1 transition-all duration-150 ease-in-out',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', // Standard focus ring
              bit === 1 
                ? 'bg-yellow-300 text-black hover:bg-yellow-300/90 dark:bg-yellow-500 dark:text-black dark:hover:bg-yellow-500/90' 
                : 'bg-card text-foreground hover:bg-muted/80 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            )}
          >
            {bit === 1 ? 'ON' : 'OFF'}
          </Button>
        );
      })}
    </div>
  );
}
