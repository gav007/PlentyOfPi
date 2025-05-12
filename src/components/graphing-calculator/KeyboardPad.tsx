
'use client';

import { Button } from '@/components/ui/button';

interface KeyboardPadProps {
  onInput: (char: string) => void;
}

const KEYBOARD_LAYOUT = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', 'π', '+'],
  ['x', '^', '(', ')'],
  ['sqrt(', 'sin(', 'cos(', 'tan('],
  ['ln(', 'log10(', 'e', 'abs('],
  // Add more functions or constants as needed: e.g. log2(, exp( for e^x
];

export default function KeyboardPad({ onInput }: KeyboardPadProps) {
  return (
    <div className="grid grid-cols-4 gap-1 p-2 border rounded-lg bg-background shadow-md">
      {KEYBOARD_LAYOUT.flat().map((key) => (
        <Button
          key={key}
          variant="outline"
          className="text-sm h-9 sm:h-10 aspect-auto p-1 font-medium hover:bg-accent focus-visible:ring-ring focus-visible:ring-1"
          onClick={() => onInput(key === 'π' ? 'pi' : key === 'e' ? 'e' : key)} // mathjs uses 'pi', 'e'
          aria-label={`Input ${key}`}
        >
          {key}
        </Button>
      ))}
    </div>
  );
}
