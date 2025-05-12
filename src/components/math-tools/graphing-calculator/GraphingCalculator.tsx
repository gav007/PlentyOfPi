
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HowToUseToggle from '@/components/ui/HowToUseToggle';
import ExpressionInputPanel from './ExpressionInputPanel';
import GraphCanvas from './GraphCanvas';
import VirtualKeypad from './VirtualKeypad';
import ExampleFunctions from './ExampleFunctions';
import type { Expression } from '@/types/graphing';
import * as math from 'mathjs';
import { LineChart } from 'lucide-react';

const INITIAL_DOMAIN = { xMin: -10, xMax: 10 };
const INITIAL_RANGE = { yMin: -10, yMax: 10 }; // Can also be 'auto'

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function GraphingCalculator() {
  const [expressions, setExpressions] = React.useState<Expression[]>([
    { id: crypto.randomUUID(), value: 'x^2', color: generateRandomColor(), error: null, isVisible: true },
  ]);
  const [activeInputId, setActiveInputId] = React.useState<string | null>(expressions[0]?.id || null);
  const [graphDomain, setGraphDomain] = React.useState(INITIAL_DOMAIN);
  const [graphRange, setGraphRange] = React.useState<{yMin: number | 'auto', yMax: number | 'auto'}>(INITIAL_RANGE);

  const plotData = React.useMemo(() => {
    return expressions
    .filter(expr => expr.isVisible && !expr.error && expr.value.trim() !== '')
    .map(expr => {
      const points: { x: number; y: number | null }[] = [];
      try {
        const compiledExpr = math.compile(expr.value);
        const step = (graphDomain.xMax - graphDomain.xMin) / 200; // 200 points for smoothness
        for (let x = graphDomain.xMin; x <= graphDomain.xMax; x += step) {
          // Round x to avoid floating point issues in evaluation if necessary, though mathjs usually handles it
          const roundedX = parseFloat(x.toFixed(4)); 
          let yVal: number | null = null;
          try {
             yVal = compiledExpr.evaluate({ x: roundedX });
             if (typeof yVal !== 'number' || !isFinite(yVal)) {
                yVal = null; // Treat non-finite results as breaks in the graph
             }
          } catch (evalError) {
            // Error during evaluation for specific x (e.g. log(0))
            yVal = null;
          }
          points.push({ x: roundedX, y: yVal });
        }
      } catch (compileError) {
        // This error should ideally be caught during input validation
        // console.error(`Error compiling expression "${expr.value}":`, compileError);
        // Returning empty points for this expression if compilation fails
      }
      return { ...expr, points };
    });
  }, [expressions, graphDomain]);

  const handleExpressionChange = (id: string, newValue: string) => {
    setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === id) {
          let error: string | null = null;
          if (newValue.trim() !== '') {
            try {
              math.compile(newValue); // Validate syntax
            } catch (e) {
              error = e instanceof Error ? e.message : "Invalid expression";
            }
          }
          return { ...expr, value: newValue, error };
        }
        return expr;
      })
    );
  };

  const addExpression = () => {
    const newId = crypto.randomUUID();
    setExpressions(prev => [
      ...prev,
      { id: newId, value: '', color: generateRandomColor(), error: null, isVisible: true },
    ]);
    setActiveInputId(newId);
  };

  const removeExpression = (id: string) => {
    setExpressions(prev => prev.filter(expr => expr.id !== id));
    if (activeInputId === id) {
      setActiveInputId(expressions.length > 1 ? expressions.find(e => e.id !== id)?.id || null : null);
    }
  };

  const toggleExpressionVisibility = (id: string) => {
    setExpressions(prev => 
      prev.map(expr => expr.id === id ? {...expr, isVisible: !expr.isVisible} : expr)
    );
  };

  const handleKeypadInput = (key: string) => {
    if (!activeInputId) return;
    setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === activeInputId) {
          // Simple append logic, can be made smarter (e.g., for functions like sin())
          let newValue = expr.value;
          if (key === 'sqrt(' || key === 'sin(' || key === 'cos(' || key === 'tan(' || key === 'ln(' || key === 'log10(') {
            newValue += key;
          } else if (key === 'x^y') {
             newValue += '^';
          } else if (key === '1/x') {
            newValue += '1/'; // User might want 1/ (something)
          }
           else {
            newValue += key;
          }
          // Re-validate after adding key
          let error: string | null = null;
           if (newValue.trim() !== '') {
            try {
              math.compile(newValue);
            } catch (e) {
              error = e instanceof Error ? e.message : "Invalid expression";
            }
          }
          return { ...expr, value: newValue, error };
        }
        return expr;
      })
    );
  };

  const handleExampleSelect = (exampleValue: string) => {
    const newId = crypto.randomUUID();
    let error: string | null = null;
    try {
      math.compile(exampleValue);
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid expression";
    }
    setExpressions(prev => [
      ...prev,
      { id: newId, value: exampleValue, color: generateRandomColor(), error, isVisible: true },
    ]);
    setActiveInputId(newId);
  };
  
  const instructions = `
    Enter mathematical expressions like "x^2", "sin(x)", or "2*x + 1".
    - Use "^" for powers (e.g., x^3).
    - Supported functions: sin(), cos(), tan(), ln(), log10(), sqrt().
    - Use "pi" for π and "e" for Euler's number.
    - Click "+" to add multiple functions. Each will have a unique color on the graph.
    - Use the virtual keypad for common symbols or type directly.
    - Adjust X/Y Min/Max to change the graph's view. Use "auto" for Y-axis to scale automatically.
    - Drag on the graph to pan, and use the mouse wheel (or pinch on touch devices) to zoom.
  `;

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <LineChart className="w-8 h-8" />
          Advanced Graphing Calculator
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Plot multiple functions, explore graphs, and visualize equations in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <HowToUseToggle instructions={instructions} title="How to Use the Graphing Calculator" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <ExpressionInputPanel
              expressions={expressions}
              onExpressionChange={handleExpressionChange}
              onAddExpression={addExpression}
              onRemoveExpression={removeExpression}
              onToggleVisibility={toggleExpressionVisibility}
              activeInputId={activeInputId}
              onSetActiveInputId={setActiveInputId}
            />
            <ExampleFunctions onExampleSelect={handleExampleSelect} />
            <VirtualKeypad onKeypadInput={handleKeypadInput} />
          </div>

          <div className="lg:col-span-2">
            <GraphCanvas
              plotData={plotData}
              domain={graphDomain}
              range={graphRange}
              onDomainChange={setGraphDomain}
              onRangeChange={setGraphRange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
