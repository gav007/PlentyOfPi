
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface ExampleFunctionsProps {
  onExampleLoad: (expression: string) => void;
}

const examples = [
  { label: "Linear", expression: "2x + 1" },
  { label: "Quadratic", expression: "x^2 - 3x + 2" },
  { label: "Cubic", expression: "x^3 - x" },
  { label: "Sine Wave", expression: "sin(x)" },
  { label: "Cosine Wave", expression: "cos(x)" },
  { label: "Tangent", expression: "tan(x)" },
  { label: "Exponential", expression: "2^x" },
  { label: "Logarithm", expression: "log(x)" }, // math.js log is natural log
  { label: "Absolute Value", expression: "abs(x)" },
  { label: "Reciprocal", expression: "1/x" },
  { label: "Square Root", expression: "sqrt(x)" },
  { label: "Circle", expression: "sqrt(4-x^2)" }, // Top half of circle x^2+y^2=4
];

export default function ExampleFunctions({ onExampleLoad }: ExampleFunctionsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Example Functions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
          {examples.map((ex) => (
            <Button
              key={ex.label}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 px-2 whitespace-normal text-left justify-start hover:bg-accent/50 focus-visible:ring-1 focus-visible:ring-offset-0"
              onClick={() => onExampleLoad(ex.expression)}
              title={`Load: y = ${ex.expression}`}
            >
              {ex.label}
            </Button>
          ))}
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-2 sm:mt-3">
          Click to load an example into an empty input or the active one.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
