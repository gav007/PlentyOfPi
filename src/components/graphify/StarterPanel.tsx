
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const sampleEquations: { label: string; expression: string }[] = [
  { label: "y = x", expression: "x" },
  { label: "y = x^2", expression: "x^2" },
  { label: "y = sin(x)", expression: "sin(x)" },
  { label: "y = cos(x)", expression: "cos(x)" },
  { label: "y = tan(x)", expression: "tan(x)" },
  { label: "y = e^x", expression: "exp(x)" }, // Use exp(x) for e^x in math.js / function-plot
  { label: "y = ln(x)", expression: "log(x)" }, // math.js uses log() for natural log by default
  { label: "y = |x|", expression: "abs(x)" },
  { label: "y = 1/x", expression: "1/x" },
  { label: "y = sqrt(x)", expression: "sqrt(x)" },
];

interface StarterPanelProps {
  onAddSample: (expression: string) => void;
}

export default function StarterPanel({ onAddSample }: StarterPanelProps) {
  return (
    <Card className="shadow-md flex-shrink-0">
      <CardHeader className="py-3 px-4">
        <CardTitle className="flex items-center text-base sm:text-lg">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary" />
          Sample Equations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-2">
          {sampleEquations.map((eq) => (
            <Button
              key={eq.label}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 px-2 whitespace-nowrap text-left justify-start hover:bg-accent/50 focus-visible:ring-1 focus-visible:ring-offset-0"
              onClick={() => onAddSample(eq.expression)}
              title={`Add to graph: ${eq.label}`}
            >
              {eq.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 sm:mt-3">Click to add an example to your graph.</p>
      </CardContent>
    </Card>
  );
}
