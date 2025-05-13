
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HowToUseGraphingProps {
  // Props can be added if instructions need to be dynamic
}

const instructions = `
- **Enter Functions:** Type math expressions in the input fields (e.g., <code>x^2</code>, <code>sin(x)</code>, <code>2*x + 1</code>).
- **Multiple Graphs:** Click "Add Expression" to plot multiple functions. Each gets a unique color.
- **Operators & Functions:**
  - Use <code>+ - * / ^</code> for basic operations.
  - Supported functions: <code>sin() cos() tan() log() exp() sqrt() abs()</code>.
  - Use <code>pi</code> for π and <code>e</code> for Euler's number.
- **Virtual Keypad:** Use the on-screen keypad for special symbols and functions.
- **Interacting with the Graph:**
  - **Pan:** Click and drag the graph to move the view.
  - **Zoom:** Use your mouse wheel or pinch gestures (on touch devices) to zoom in and out.
  - **Controls:** Use the zoom and reset buttons above the graph for quick adjustments.
- **Graph Settings:** Click the settings icon (⚙️) to manually set X and Y axis bounds and toggle the grid.
- **Visibility & Color:** Use the eye icon (👁️) next to each function to toggle its visibility. Click the colored swatch to change its graph color.
`;

export default function HowToUseGraphing({}: HowToUseGraphingProps) {
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
        aria-controls="graphing-instructions-panel"
      >
        <span className="flex items-center gap-1.5 sm:gap-2 text-primary">
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          How to Use Graphify
        </span>
        {show ? (
          <ChevronUp className="h-4 w-4 sm:h-5 sm:h-5 text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 sm:h-5 sm:h-5 text-primary" />
        )}
      </Button>
      {show && (
        <div
          id="graphing-instructions-panel"
          className="p-3 sm:p-4 border-t border-border bg-muted/20"
        >
          <div
            className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-1"
            dangerouslySetInnerHTML={{ __html: instructions.replace(/\n/g, '<br />').replace(/<code>(.*?)<\/code>/g, '<code class="bg-muted/50 text-primary px-1 py-0.5 rounded-sm font-mono">$1</code>') }}
          />
        </div>
      )}
    </div>
  );
}
