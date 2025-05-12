
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface HowToUseToggleProps {
  instructions: string;
  title?: string; // Optional title
}

export default function HowToUseToggle({ instructions, title = "How to Use" }: HowToUseToggleProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-3 border rounded-lg bg-card shadow-sm">
      <Button
        variant="ghost"
        onClick={() => setShow(!show)}
        className="w-full text-sm text-primary hover:text-primary/80 justify-between px-4 py-3 h-auto font-medium"
        aria-expanded={show}
        aria-controls="instructions-panel"
      >
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          {title}
        </span>
        {show ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </Button>
      {show && (
        <div
          id="instructions-panel"
          className="p-4 border-t text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none leading-relaxed"
        >
          {/* Using dangerouslySetInnerHTML for simple newlines, ensure instructions are safe */}
          <div dangerouslySetInnerHTML={{ __html: instructions.replace(/\n/g, '<br />') }} />
        </div>
      )}
    </div>
  );
}
