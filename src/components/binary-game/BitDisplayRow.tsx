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
      className="flex justify-center items-center gap-1 sm:gap-2 mb-4"
      role="group"
      aria-label={`Current ${bitCount}-bit binary value`}
    >
      {displayBits.map((bit, index) => (
        <div
          key={index}
          role="img"
          aria-label={bit === 1 ? `Bit ${bitCount - 1 - index} on` : `Bit ${bitCount - 1 - index} off`}
          className={cn(
            'h-6 w-6 sm:h-8 sm:w-8 rounded-full transition-all duration-200 ease-in-out border-2',
            bit === 1 ? 'bg-green-500 border-green-700' : 'bg-gray-300 border-gray-500',
            'shadow-md'
          )}
        />
      ))}
    </div>
  );
}
