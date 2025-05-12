
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming Button is used, or a simple <button>
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HowToUseToggleProps {
  instructions: string;
}

export default function HowToUseToggle({ instructions }: HowToUseToggleProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-3">
      <Button
        variant="link"
        onClick={() => setShow(!show)}
        className="text-sm text-primary hover:text-primary/80 underline px-0 h-auto"
        aria-expanded={show}
        aria-controls="instructions-panel"
      >
        {show ? (
          <>
            Hide Instructions <ChevronUp className="ml-1 h-4 w-4" />
          </>
        ) : (
          <>
            How to Use <ChevronDown className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
      {show && (
        <div
          id="instructions-panel"
          className="mt-2 p-3 rounded-md bg-accent/20 text-accent-foreground/80 shadow text-sm prose prose-sm dark:prose-invert max-w-none"
        >
          <p>{instructions}</p>
        </div>
      )}
    </div>
  );
}
