
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HowToUseToggleProps {
  instructions: string;
  title?: string; // Optional title
}

export default function HowToUseToggle({ instructions, title = "How to Use" }: HowToUseToggleProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-3 sm:mb-4 border rounded-lg bg-card shadow-sm overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => setShow(!show)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-muted/50",
          show ? "bg-muted/50" : ""
        )}
        aria-expanded={show}
        aria-controls="how-to-use-panel"
      >
        <span className="flex items-center gap-1.5 sm:gap-2 text-primary">
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          {title}
        </span>
        {show ? (
          <ChevronUp className="h-4 w-4 sm:h-5 sm:h-5 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 sm:h-5 sm:h-5 text-primary" />
        )}
      </Button>
      {show && (
        <div
          id="how-to-use-panel"
          className="p-3 sm:p-4 border-t border-border bg-muted/20"
        >
          <div
            className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-1"
            dangerouslySetInnerHTML={{ __html: instructions.replace(/\n(?!<br \/>)/g, '<br />').replace(/<code>(.*?)<\/code>/g, '<code class="bg-muted/50 text-primary px-1 py-0.5 rounded-sm font-mono">$1</code>') }}
          />
        </div>
      )}
    </div>
  );
}
