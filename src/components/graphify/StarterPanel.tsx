
'use client';

import type { FunctionDefinition } from '@/types/graphify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const sampleEquations: { label: string; expression: string }[] = [
  { label: "y = x", expression: "x" },
  { label: "y = x²", expression: "x^2" },
  { label: "y = sin(x)", expression: "sin(x)" },
  { label: "y = cos(x)", expression: "cos(x)" },
  { label: "y = tan(x)", expression: "tan(x)" },
  { label: "y = eˣ", expression: "exp(x)" },
  { label: "y = ln(x)", expression: "log(x)" }, // math.js uses log() for natural log by default
  { label: "y = |x|", expression: "abs(x)" },
  { label: "y = 1/x", expression: "1/x" },
  { label: "y = √x", expression: "sqrt(x)" },
];

interface StarterPanelProps {
  onAddSample: (expression: string) => void;
}

export default function StarterPanel({ onAddSample }: StarterPanelProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Lightbulb className="w-5 h-5 mr-2 text-primary" />
          Sample Equations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {sampleEquations.map((eq) => (
            <Button
              key={eq.label}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 px-2 whitespace-normal text-left justify-start hover:bg-accent/50"
              onClick={() => onAddSample(eq.expression)}
              title={`Add: y = ${eq.expression}`}
            >
              {eq.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Click to add an example to your graph.</p>
      </CardContent>
    </Card>
  );
}
