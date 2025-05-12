
'use client';

import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ComplexityDisplayProps {
  complexity: string; 
  type: 'Time' | 'Space';
}

const ComplexityVisual: React.FC<{ complexity: string, type: string }> = ({ complexity, type }) => {
  let pathData = "";
  let textLabel = complexity;
  let curveColor = "hsl(var(--primary))"; // Default color

  // More distinct curves
  if (complexity === "O(n²)") {
    pathData = "M5,95 Q50,50 95,5"; // Steeper quadratic
    curveColor = "hsl(var(--destructive))";
  } else if (complexity === "O(n log n)") {
    pathData = "M5,95 Q50,65 95,25"; // Slightly less steep than n^2
    curveColor = "hsl(var(--chart-2))";
  } else if (complexity === "O(n)") {
    pathData = "M5,95 L95,5"; // Linear
    curveColor = "hsl(var(--chart-1))";
  } else if (complexity === "O(log n)") {
    pathData = "M5,95 Q70,30 95,20"; // Flatter logarithmic
    curveColor = "hsl(var(--chart-3))";
  } else if (complexity === "O(1)") {
    pathData = "M5,50 L95,50"; // Constant
    curveColor = "hsl(var(--chart-4))";
    textLabel = "O(1)"; // Ensure O(1) is displayed if that's the input
  } else {
    // Fallback for unhandled complexities - just show text
    return <p className="text-xs font-mono text-muted-foreground">{textLabel}</p>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center w-16 h-16 bg-background p-1 rounded-md border border-border shadow-sm transition-all hover:shadow-md">
            <svg width="40" height="24" viewBox="0 0 100 100" className="mb-0.5">
              {/* Optional grid lines for context */}
              {/* <line x1="0" y1="100" x2="100" y2="100" stroke="hsl(var(--border))" strokeWidth="2"/>
              <line x1="0" y1="0" x2="0" y2="100" stroke="hsl(var(--border))" strokeWidth="2"/> */}
              <path d={pathData} stroke={curveColor} strokeWidth="8" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="text-[0.65rem] font-mono text-foreground truncate" title={complexity}>{textLabel}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{type} Complexity: {complexity}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


const ComplexityDisplay: React.FC<ComplexityDisplayProps> = ({ complexity, type }) => {
  return (
    <div className="flex flex-col items-center text-xs">
      <span className="font-semibold text-muted-foreground mb-1">{type}</span>
      <ComplexityVisual complexity={complexity} type={type} />
    </div>
  );
};

export default ComplexityDisplay;
