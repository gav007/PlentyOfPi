
'use client';

import * as React from 'react';
// import type { Metadata } from 'next'; // Metadata handled by parent or layout
import ExpressionInputPanel from '@/components/graphing-calculator/ExpressionInputPanel';
import GraphCanvas from '@/components/graphing-calculator/GraphCanvas';
import KeyboardPad from '@/components/graphing-calculator/KeyboardPad';
import ExampleExpressions from '@/components/graphing-calculator/ExampleExpressions'; // New component
import HowToUseToggle from '@/components/ui/HowToUseToggle';
import type { Expression, PlotData } from '@/types/graphing';
import { parseExpression, generatePlotData } from '@/lib/graphingUtils';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Added CardDescription

// Metadata can't be 'use client', so it's typically defined in a non-client component or layout.
// export const metadata: Metadata = {
//   title: 'Advanced Graphing Calculator | Plenty of π',
//   description: 'Plot multiple complex functions, explore graphs interactively with a Desmos-like experience.',
// };

const INITIAL_EXPRESSIONS: Expression[] = [
  { id: crypto.randomUUID(), value: 'x^2', color: 'hsl(var(--chart-1))', error: null, visible: true },
  { id: crypto.randomUUID(), value: 'sin(x)', color: 'hsl(var(--chart-2))', error: null, visible: true },
];

const AVAILABLE_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--destructive))',
];

export default function GraphingCalculatorPage() {
  const [expressions, setExpressions] = React.useState<Expression[]>(INITIAL_EXPRESSIONS);
  const [activeInputId, setActiveInputId] = React.useState<string | null>(
    INITIAL_EXPRESSIONS.length > 0 ? INITIAL_EXPRESSIONS[0].id : null
  );
  const [plotData, setPlotData] = React.useState<PlotData[]>([]);
  const [domain, setDomain] = React.useState<{ xMin: number; xMax: number }>({ xMin: -10, xMax: 10 });
  const [range, setRange] = React.useState<{ yMin: number | 'auto'; yMax: number | 'auto' }>({ yMin: 'auto', yMax: 'auto' });

  React.useEffect(() => {
    const newPlotData: PlotData[] = [];
    let hasErrors = false;
    const updatedExpressions = expressions.map(expr => {
      let currentError = null;
      if (!expr.visible || !expr.value.trim()) {
        if (expr.error) return { ...expr, error: null }; // Clear error if not visible or empty
        return expr;
      }
      try {
        const parsedFunc = parseExpression(expr.value);
        if (parsedFunc) {
          const data = generatePlotData(parsedFunc, domain.xMin, domain.xMax);
          newPlotData.push({ id: expr.id, data, color: expr.color, name: expr.value });
        } else if (expr.value.trim()){ // If func is null but value is not empty, it implies parsing failed silently or returned null for an empty string.
           currentError = "Invalid expression (empty or unparseable).";
        }
      } catch (error: any) {
        console.error(`Error processing expression "${expr.value}":`, error);
        currentError = error.message || 'Invalid expression syntax.';
        hasErrors = true;
      }
      return { ...expr, error: currentError };
    });

    setPlotData(newPlotData);
    if (hasErrors || expressions.some((e, i) => e.error !== updatedExpressions[i].error)) {
      setExpressions(updatedExpressions);
    }
  }, [expressions, domain]);

  const handleExpressionChange = React.useCallback((id: string, value: string) => {
    setExpressions(prev =>
      prev.map(expr => (expr.id === id ? { ...expr, value, error: null } : expr)) // Reset error on change
    );
  }, []);
  
  const handleToggleVisibility = React.useCallback((id: string) => {
    setExpressions(prev =>
      prev.map(expr => (expr.id === id ? { ...expr, visible: !expr.visible } : expr))
    );
  }, []);

  const handleAddExpression = React.useCallback(() => {
    const nextColorIndex = expressions.length % AVAILABLE_COLORS.length;
    const newId = crypto.randomUUID();
    setExpressions(prev => [
      ...prev,
      {
        id: newId,
        value: '',
        color: AVAILABLE_COLORS[nextColorIndex],
        error: null,
        visible: true,
      },
    ]);
    setActiveInputId(newId);
  }, [expressions.length]);

  const handleRemoveExpression = React.useCallback((id: string) => {
    setExpressions(prev => {
      const newExpressions = prev.filter(expr => expr.id !== id);
      if (activeInputId === id) {
        setActiveInputId(newExpressions.length > 0 ? newExpressions[0].id : null);
      }
      return newExpressions;
    });
  }, [activeInputId]);

  const handleKeyboardInput = React.useCallback((char: string) => {
    if (!activeInputId) {
      if (expressions.length === 0) {
        handleAddExpression(); // If no expressions and no active input, create one
        // We need to wait for the state update to set the activeInputId then append char
        // This is a bit tricky with immediate state. A useEffect could handle appending char post-creation.
        // For simplicity now, let's assume user will click into the new field or we set it active and it'll catch next input.
        return;
      }
      // If there are expressions but none active, make the first one active.
      setActiveInputId(expressions[0].id);
      // Append char to this newly activated input (if it's now set)
      // Needs careful handling of state updates, potentially using a ref for the input value or delaying char append.
      // Current simple approach: just activate. Next key press will go into it.
      return;
    }
    setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === activeInputId) {
          // A more sophisticated approach would involve cursor position
          return { ...expr, value: expr.value + char, error: null };
        }
        return expr;
      })
    );
  }, [activeInputId, expressions, handleAddExpression]);
  
  const handleDomainChange = React.useCallback((newDomain: { xMin: number, xMax: number }) => {
    if (newDomain.xMin < newDomain.xMax) {
      setDomain(newDomain);
    } else {
      console.warn("Invalid domain: xMin must be less than xMax.");
    }
  }, []);

  const handleRangeChange = React.useCallback((newRange: { yMin: number | 'auto', yMax: number | 'auto' }) => {
     if (typeof newRange.yMin === 'number' && typeof newRange.yMax === 'number' && newRange.yMin >= newRange.yMax) {
        console.warn("Invalid range: yMin must be less than yMax if both are numbers.");
        return;
    }
    setRange(newRange);
  }, []);

  const handleSelectExample = React.useCallback((exampleValue: string) => {
    if (activeInputId) {
        // If an input is active, set its value to the example
        setExpressions(prev => 
            prev.map(expr => expr.id === activeInputId ? {...expr, value: exampleValue, error: null } : expr)
        );
    } else {
        // If no input is active, find the first empty expression or add a new one
        const firstEmptyIndex = expressions.findIndex(expr => !expr.value.trim());
        if (firstEmptyIndex !== -1) {
            const targetId = expressions[firstEmptyIndex].id;
            setExpressions(prev => 
                prev.map(expr => expr.id === targetId ? {...expr, value: exampleValue, error: null } : expr)
            );
            setActiveInputId(targetId);
        } else {
            // Add a new expression with the example
            const nextColorIndex = expressions.length % AVAILABLE_COLORS.length;
            const newId = crypto.randomUUID();
            setExpressions(prev => [
                ...prev,
                {
                    id: newId,
                    value: exampleValue,
                    color: AVAILABLE_COLORS[nextColorIndex],
                    error: null,
                    visible: true,
                },
            ]);
            setActiveInputId(newId);
        }
    }
  }, [activeInputId, expressions]);


  const instructions = `
    Enter mathematical expressions in the input fields (e.g., x^2, sin(x), 2*x + 5).
    Use the keyboard pad or examples for functions like sin, cos, log10, sqrt, abs, and constants like pi, e.
    Click the colored square to toggle an expression's visibility on the graph.
    Click '+' to add a new expression, '🗑️' to remove one.
    Adjust graph view using X/Y Min/Max inputs. The graph also supports zoom/pan.
    Supported: standard operators (+, -, *, /, ^), common functions (sin, cos, tan, ln, log10, exp, sqrt, abs), constants (pi, e).
  `;

  return (
    <div className="container mx-auto px-2 py-8 md:px-4">
      <Card className="shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-primary">
            Advanced Graphing Calculator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Plot multiple functions, explore graphs interactively. Example: try "x*sin(1/x)" for a challenge!
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Expressions</CardTitle>
                  <Button variant="ghost" size="icon" onClick={handleAddExpression} aria-label="Add new expression">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ExpressionInputPanel
                  expressions={expressions}
                  onExpressionChange={handleExpressionChange}
                  onRemoveExpression={handleRemoveExpression}
                  onToggleVisibility={handleToggleVisibility}
                  activeInputId={activeInputId}
                  setActiveInputId={setActiveInputId}
                />
              </CardContent>
            </Card>
            
            <KeyboardPad onInput={handleKeyboardInput} />
            <ExampleExpressions onSelectExample={handleSelectExample} />
            
          </div>

          <div className="space-y-6">
            <GraphCanvas 
              plotData={plotData} 
              expressions={expressions} 
              domain={domain}
              range={range}
              onDomainChange={handleDomainChange}
              onRangeChange={handleRangeChange}
            />
            <HowToUseToggle title="How to Use Graphing Calculator" instructions={instructions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

