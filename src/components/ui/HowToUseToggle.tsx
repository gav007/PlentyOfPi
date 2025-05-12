
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Still use ShadCN button for consistency
import { cn } from '@/lib/utils';

interface HowToUseToggleProps {
  instructions: string;
  title?: string; 
}

export default function HowToUseToggle({ instructions, title = "How to Use" }: HowToUseToggleProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4 border rounded-lg bg-card shadow-sm overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setShow(!show)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50",
          show ? "bg-muted/50" : ""
        )}
        aria-expanded={show}
        aria-controls="instructions-panel"
      >
        <span className="flex items-center gap-2 text-primary">
          <Info className="w-5 h-5" />
          {title}
        </span>
        {show ? (
          <ChevronUp className="h-5 w-5 text-primary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-primary" />
        )}
      </Button>
      {show && (
        <div
          id="instructions-panel"
          className="p-4 border-t border-border bg-muted/20"
        >
          <div 
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: instructions.replace(/\n/g, '<br />') }} 
          />
        </div>
      )}
    </div>
  );
}

