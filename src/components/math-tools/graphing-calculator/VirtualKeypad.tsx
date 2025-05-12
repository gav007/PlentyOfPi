
'use client';

import { Button } from '@/components/ui/button';
import { Divide, Minus, Plus, XIcon as MultiplyIcon, Percent, Superscript, SquareRoot, Pi } from 'lucide-react'; // Use XIcon as MultiplyIcon

interface VirtualKeypadProps {
  onKeypadInput: (key: string) => void;
}

const keypadLayout = [
  // Row 1: Numbers + Basic Ops
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
  // Row 2: Variables, Functions, Special Chars
  ['x', '(', ')', '^'],
  ['sin(', 'cos(', 'tan(', 'sqrt('],
  ['ln(', 'log10(', 'pi', 'e'],
  // ['1/x', '%', 'ANS', 'CLR'] // More advanced features can be added
];


// Map symbols to Lucide icons or text
const symbolMap: Record<string, React.ReactNode | string> = {
  '/': <Divide className="w-5 h-5" />,
  '*': <MultiplyIcon className="w-5 h-5" />, // Use XIcon
  '-': <Minus className="w-5 h-5" />,
  '+': <Plus className="w-5 h-5" />,
  '%': <Percent className="w-5 h-5" />,
  '^': <Superscript className="w-5 h-5" />,
  'sqrt(': <SquareRoot className="w-5 h-5" />,
  'pi': <Pi className="w-5 h-5" />,
  // Text for others
  'x^y': 'xʸ', // Custom representation for power
  '1/x': '¹/ₓ',
};


export default function VirtualKeypad({ onKeypadInput }: VirtualKeypadProps) {
  const handleButtonClick = (key: string) => {
    onKeypadInput(key);
  };

  return (
    <div className="grid grid-cols-4 gap-1 p-2 bg-muted/30 rounded-md shadow">
      {keypadLayout.flat().map((key) => {
        let displayContent: React.ReactNode = key;
        let ariaLabel = `Input ${key}`;

        if (key in symbolMap) {
          displayContent = symbolMap[key];
        } else if (key.endsWith('(')) {
          ariaLabel = `Input function ${key.slice(0, -1)}`;
        }


        // Special styling for operators or functions
        const isOperator = ['/', '*', '-', '+', '=', '^'].includes(key);
        const isFunction = key.endsWith('(') || ['pi', 'e', 'x'].includes(key);
        const isUtility = ['ANS', 'CLR'].includes(key); // Example for future utilities

        return (
          <Button
            key={key}
            variant={isOperator || isFunction ? "secondary" : "outline"}
            className={`
              text-sm sm:text-base h-10 sm:h-12 flex items-center justify-center 
              font-mono shadow-sm hover:shadow-md active:scale-95 transition-all
              ${isOperator ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}
              ${isFunction ? 'bg-accent/20 text-accent-foreground hover:bg-accent/30' : ''}
              ${isUtility ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : ''}
              ${key === '=' ? 'col-span-1 bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            `}
            onClick={() => handleButtonClick(key)}
            aria-label={ariaLabel}
          >
            {displayContent}
          </Button>
        );
      })}
    </div>
  );
}
