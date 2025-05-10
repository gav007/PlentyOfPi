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

  const getBitPowerLabels = (count: number) =>
    Array.from({ length: count }, (_, i) => 2 ** (count - 1 - i));

  const bitPowerLabels = getBitPowerLabels(bitCount);
  
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex justify-center items-start mb-1"
        role="group"
        aria-label={`Bit power labels for ${bitCount}-bit binary value`}
      >
        {bitPowerLabels.map((label, index) => (
          <div key={index} className="w-8 flex flex-col items-center mx-1">
            <div className="text-xs text-muted-foreground h-4 flex items-center justify-center font-semibold" aria-hidden="true">
              {label}
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex justify-center items-start" 
        role="group"
        aria-label={`Current ${bitCount}-bit binary value`}
      >
        {displayBits.map((bit, index) => {
          const bitPosition = bitCount - 1 - index; 
          return (
            <div key={index} className="w-8 flex flex-col items-center mx-1">
              {/* Bit light itself */}
              <div
                role="img"
                aria-label={bit === 1 ? `Bit representing ${bitPowerLabels[index]} is ON` : `Bit representing ${bitPowerLabels[index]} is OFF`}
                className={cn(
                  'h-6 w-6 rounded-full transition-all duration-200 ease-in-out shadow-md',
                  bit === 1 ? 'bg-yellow-400 shadow-[0_0_5px_rgba(253,224,71,0.7)]' : 'bg-gray-300 dark:bg-gray-600',
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

