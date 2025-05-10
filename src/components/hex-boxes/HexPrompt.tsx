'use client';

import { Target } from 'lucide-react';

interface HexPromptProps {
  targetDecimal: number;
}

export default function HexPrompt({ targetDecimal }: HexPromptProps) {
  return (
    <div className="my-6 text-center p-4 border border-dashed border-primary/50 rounded-lg bg-primary/10 shadow-md">
      <p className="text-md font-medium text-primary-foreground mb-1 flex items-center justify-center gap-2">
        <Target className="w-5 h-5 text-primary" />
        CONVERT TO HEXADECIMAL:
      </p>
      <p className="text-4xl font-bold text-primary">
        {targetDecimal}
      </p>
    </div>
  );
}
