
'use client';

import { cn } from '@/lib/utils';

interface ArenaCanvasProps {
  // Props will depend on the specific visualization (e.g., array data, graph data)
  className?: string;
  children?: React.ReactNode; // For simple message or static content
}

export default function ArenaCanvas({ className, children }: ArenaCanvasProps) {
  // This component will be responsible for rendering the visual representation
  // of the algorithm (e.g., bars for sorting, nodes for graphs).
  // It might use SVG or HTML5 Canvas.

  return (
    <div
      className={cn(
        "min-h-[200px] md:min-h-[300px] w-full bg-secondary/30 border border-dashed border-secondary rounded-lg flex items-center justify-center p-4 shadow-inner",
        className
      )}
      role="img" // Or "application" if interactive
      aria-label="Algorithm visualization area"
    >
      {children || <p className="text-muted-foreground text-sm">Visualization Canvas Placeholder</p>}
    </div>
  );
}
