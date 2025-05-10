import { cn } from '@/lib/utils';

interface BitDisplayRowProps {
  bits: number[];
  bitCount: number;
}

export default function BitDisplayRow({ bits, bitCount }: BitDisplayRowProps) {
  const displayBits = [...bits];
  // Ensure the array has the correct length for display, padding with 0 if necessary
  while (displayBits.length < bitCount) {
    displayBits.unshift(0);
  }
  if (displayBits.length > bitCount) {
    displayBits.splice(0, displayBits.length - bitCount);
  }
  
  return (
    <div
      className="flex justify-center items-start" // items-start to align labels at top
      role="group"
      aria-label={`Current ${bitCount}-bit binary value`}
    >
      {displayBits.map((bit, index) => {
        const bitPosition = bitCount - 1 - index; // Calculate bit position number (e.g., 7, 6, ..., 0)
        return (
          <div key={index} className="w-8 flex flex-col items-center mx-1">
            <div className="text-xs text-muted-foreground mb-1 h-4 flex items-center justify-center" aria-hidden="true">
              {bitPosition}
            </div>
            <div
              role="img"
              aria-label={bit === 1 ? `Bit ${bitPosition} on` : `Bit ${bitPosition} off`}
              className={cn(
                'h-6 w-6 rounded-full transition-all duration-200 ease-in-out shadow-md',
                bit === 1 ? 'bg-yellow-400 shadow-[0_0_5px_rgba(253,224,71,0.7)]' : 'bg-gray-300 dark:bg-gray-600', // Using Tailwind yellow-400, adjusted glow color
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
