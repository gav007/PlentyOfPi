
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExampleExpressionsProps {
  onSelectExample: (expression: string) => void;
}

const examples = [
  { label: "Parabola", value: "x^2" },
  { label: "Sine Wave", value: "sin(x)" },
  { label: "Cubic", value: "x^3 - 2*x + 1" },
  { label: "Reciprocal", value: "1/x" },
  { label: "Gaussian", value: "e^(-x^2)" },
  { label: "Logarithmic", value: "log10(x)" },
  { label: "Tangent", value: "tan(x)" },
  { label: "Absolute Value", value: "abs(x-2)" },
  { label: "SQRT", value: "sqrt(x)"},
];

export default function ExampleExpressions({ onSelectExample }: ExampleExpressionsProps) {
  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-base text-center font-semibold text-muted-foreground">Example Functions</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {examples.map(ex => (
            <Button
              key={ex.value}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 bg-card hover:bg-accent/80"
              onClick={() => onSelectExample(ex.value)}
              title={`Use: ${ex.value}`}
            >
              {ex.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

