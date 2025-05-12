
'use client';

import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react'; // Using Wand2 for "examples" or "magic"

interface ExampleFunctionsProps {
  onExampleSelect: (expression: string) => void;
}

const examples = [
  { label: "Linear", value: "2*x + 1" },
  { label: "Quadratic", value: "x^2 - 3*x + 2" },
  { label: "Cubic", value: "0.5*x^3 - 2*x^2 + x - 1"},
  { label: "Sine Wave", value: "sin(x)" },
  { label: "Cosine Wave", value: "cos(x)" },
  { label: "Tangent", value: "tan(x)"},
  { label: "Exponential", value: "2^x" },
  { label: "Logarithmic (ln)", value: "ln(x)"},
  { label: "Square Root", value: "sqrt(x)"},
  { label: "Absolute Value", value: "abs(x)"},
  { label: "Circle (Implicit - Note: Plotter might need y= form or parametric)", value: "sqrt(4-x^2)"}, // Example of how to plot top half
  { label: "Rational", value: "1/x"}
];

export default function ExampleFunctions({ onExampleSelect }: ExampleFunctionsProps) {
  return (
    <div className="p-3 bg-muted/20 rounded-md shadow">
      <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
        <Wand2 className="w-4 h-4" /> Example Functions
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {examples.map((ex) => (
          <Button
            key={ex.label}
            variant="outline"
            size="sm"
            className="text-xs h-auto py-1.5 px-2 whitespace-normal text-left justify-start hover:bg-accent/50"
            onClick={() => onExampleSelect(ex.value)}
            title={`Plot: ${ex.value}`}
          >
            {ex.label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">Click to add an example expression to the list.</p>
    </div>
  );
}
