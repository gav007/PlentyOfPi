
'use client';

import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const Divide = dynamic(() => import('lucide-react').then(m => m.Divide), { ssr: false });
const Minus = dynamic(() => import('lucide-react').then(m => m.Minus), { ssr: false });
const Plus = dynamic(() => import('lucide-react').then(m => m.Plus), { ssr: false });
const MultiplyIcon = dynamic(() => import('lucide-react').then(m => m.XIcon), { ssr: false });
const Percent = dynamic(() => import('lucide-react').then(m => m.Percent), { ssr: false });
const Superscript = dynamic(() => import('lucide-react').then(m => m.Superscript), { ssr: false });
const Pi = dynamic(() => import('lucide-react').then(m => m.Pi), { ssr: false });
const SquareRootIcon = dynamic(() => import('lucide-react').then(m => m.SquareRootIcon), { ssr: false });

interface VirtualKeypadProps {
  onKeypadInput: (key: string) => void;
}

const keypadLayout = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', '.', 'π', '+'],
  ['x', '^', '(', ')'],
  ['sin(', 'cos(', 'tan(', 'log('],
  ['sqrt(', 'abs(', 'e', '%'], // Using 'e' for Euler's number
];


export default function VirtualKeypad({ onKeypadInput }: VirtualKeypadProps) {
  const getIconForKey = (key: string) => {
    switch (key) {
      case '/': return <Divide className="w-4 h-4 sm:w-5 sm:h-5"/>;
      case '*': return <MultiplyIcon className="w-4 h-4 sm:w-5 sm:h-5"/>;
      case '-': return <Minus className="w-4 h-4 sm:w-5 sm:h-5"/>;
      case '+': return <Plus className="w-4 h-4 sm:w-5 sm:h-5"/>;
      case '^': return <Superscript className="w-4 h-4 sm:w-5 sm:h-5"/>;
      case 'π': return <Pi className="w-4 h-4 sm:w-5 sm:h-5"/>;
      case 'sqrt(': return <SquareRootIcon className="w-4 h-4 sm:w-5 sm:h-5"/>; // Changed to SquareRootIcon
      case '%': return <Percent className="w-4 h-4 sm:w-5 sm:h-5"/>;
      default: return key;
    }
  };


  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-1.5 p-2 sm:p-3 border rounded-lg bg-muted/30 shadow-sm">
      {keypadLayout.flat().map((key) => (
        <Button
          key={key}
          variant="outline"
          className="text-xs sm:text-sm md:text-base font-medium h-9 sm:h-10 md:h-11 focus-visible:ring-1 focus-visible:ring-offset-0 bg-background hover:bg-accent/70"
          onClick={() => onKeypadInput(key)}
          aria-label={`Input ${key === 'sqrt(' ? 'square root function' : key}`}
        >
          {getIconForKey(key)}
        </Button>
      ))}
    </div>
  );
}
