
'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import ExpressionInputPanel from '@/components/graphing-calculator/ExpressionInputPanel';
import GraphCanvas from '@/components/graphing-calculator/GraphCanvas';
import KeyboardPad from '@/components/graphing-calculator/KeyboardPad';
import HowToUseToggle from '@/components/ui/HowToUseToggle'; // Re-using existing generic toggle
import type { Expression, PlotData } from '@/types/graphing';
import { parseExpression, generatePlotData } from '@/lib/graphingUtils';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Metadata can't be 'use client', so it's typically defined in a non-client component or layout.
// For this page, we'll assume metadata is handled by the parent layout or this page is simple enough.
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
  'hsl(var(--destructive))', // Example of using a theme color
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
    expressions.forEach(expr => {
      if (!expr.visible || !expr.value.trim()) {
        // If not visible or empty, ensure no plot data is generated for it
        // Or, keep its old plot data but filter it out in GraphCanvas based on visibility
        return;
      }
      try {
        const parsedFunc = parseExpression(expr.value);
        if (parsedFunc) {
          const data = generatePlotData(parsedFunc, domain.xMin, domain.xMax);
          newPlotData.push({ id: expr.id, data, color: expr.color, name: expr.value });
        }
        // Clear previous error for this expression if parsing is now successful
        if (expr.error) {
          setExpressions(prev => prev.map(e => e.id === expr.id ? { ...e, error: null } : e));
        }
      } catch (error) {
        console.error(`Error parsing expression "${expr.value}":`, error);
        setExpressions(prev => prev.map(e => e.id === expr.id ? { ...e, error: error instanceof Error ? error.message : 'Invalid expression' } : e));
        // Remove plot data for this errored expression or handle in GraphCanvas
      }
    });
    setPlotData(newPlotData);
  }, [expressions, domain]);

  const handleExpressionChange = (id: string, value: string) => {
    setExpressions(prev =>
      prev.map(expr => (expr.id === id ? { ...expr, value, error: null } : expr))
    );
  };
  
  const handleToggleVisibility = (id: string) => {
    setExpressions(prev =>
      prev.map(expr => (expr.id === id ? { ...expr, visible: !expr.visible } : expr))
    );
  };

  const handleAddExpression = () => {
    const nextColorIndex = expressions.length % AVAILABLE_COLORS.length;
    setExpressions(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        value: '',
        color: AVAILABLE_COLORS[nextColorIndex],
        error: null,
        visible: true,
      },
    ]);
  };

  const handleRemoveExpression = (id: string) => {
    setExpressions(prev => prev.filter(expr => expr.id !== id));
    if (activeInputId === id) {
      setActiveInputId(expressions.length > 1 ? expressions.find(e => e.id !== id)?.id || null : null);
    }
  };

  const handleKeyboardInput = (char: string) => {
    if (!activeInputId) return;
    setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === activeInputId) {
          // Basic insertion, for a real editor, cursor position would be needed
          return { ...expr, value: expr.value + char, error: null };
        }
        return expr;
      })
    );
  };
  
  const handleDomainChange = (newDomain: { xMin: number, xMax: number }) => {
    if (newDomain.xMin < newDomain.xMax) {
      setDomain(newDomain);
    } else {
      // Handle error or invalid input, e.g. show a toast
      console.warn("Invalid domain: xMin must be less than xMax.");
    }
  };

  const handleRangeChange = (newRange: { yMin: number | 'auto', yMax: number | 'auto' }) => {
     if (typeof newRange.yMin === 'number' && typeof newRange.yMax === 'number' && newRange.yMin >= newRange.yMax) {
        console.warn("Invalid range: yMin must be less than yMax if both are numbers.");
        return;
    }
    setRange(newRange);
  };


  const instructions = `
    Enter mathematical expressions in the input fields (e.g., x^2, sin(x), 2*x + 5).
    Use the keyboard pad for special characters and functions.
    Click the colored square to toggle an expression's visibility on the graph.
    Click '+' to add a new expression, '🗑️' to remove one.
    Adjust graph view using X/Y Min/Max inputs (Plotly graph supports zoom/pan).
    Supported: standard operators (+, -, *, /, ^), functions (sin, cos, tan, ln, log, sqrt, abs), constants (pi, e).
  `;

  return (
    <div className="container mx-auto px-2 py-8 md:px-4">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Advanced Graphing Calculator
          </CardTitle>
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
