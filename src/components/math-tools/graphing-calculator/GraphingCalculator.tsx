
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

// Predefined colors for consistency and to avoid hydration issues with Math.random()
const PREDEFINED_COLORS = [
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#8B5CF6', // Violet
];
let colorIndex = 0;

const getNextColor = () => {
  const color = PREDEFINED_COLORS[colorIndex % PREDEFINED_COLORS.length];
  colorIndex++;
  return color;
};


const generateRandomColor = () => {
  // This function is now only used for expressions added AFTER initial load.
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function GraphingCalculator() {
  const [expressions, setExpressions] = React.useState<Expression[]>([
    { id: crypto.randomUUID(), value: 'x^2', color: PREDEFINED_COLORS[0], error: null, isVisible: true },
  ]);
  const [activeInputId, setActiveInputId] = React.useState<string | null>(expressions[0]?.id || null);
  const [graphDomain, setGraphDomain] = React.useState(INITIAL_DOMAIN);
  const [graphRange, setGraphRange] = React.useState<{yMin: number | 'auto', yMax: number | 'auto'}>(INITIAL_RANGE);

  // Reset colorIndex when component unmounts or expressions are reset, for more predictable coloring on re-entry
  React.useEffect(() => {
    colorIndex = 1; // Start from the second color for new additions if the first is static
    return () => {
      colorIndex = 0; // Reset for next full mount
    };
  }, []);


  const plotData = React.useMemo(() => {
    return expressions
    .filter(expr => expr.isVisible && expr.value.trim() !== '') // Don't filter by expr.error here, let graph show it
    .map(expr => {
      const points: { x: number; y: number | null }[] = [];
      if (expr.error) { // If there's a known compile error, don't try to plot
        return { ...expr, points: [] };
      }
      try {
        const cleanedValue = expr.value.trim() === '' ? '0' : expr.value; // Treat empty as y=0 if needed or handle
        const compiledExpr = math.compile(cleanedValue);
        const step = (graphDomain.xMax - graphDomain.xMin) / 200; 
        for (let x = graphDomain.xMin; x <= graphDomain.xMax; x += step) {
          const roundedX = parseFloat(x.toFixed(4)); 
          let yVal: number | null = null;
          try {
             yVal = compiledExpr.evaluate({ x: roundedX });
             if (typeof yVal !== 'number' || !isFinite(yVal) || isNaN(yVal)) { // More robust check
                yVal = null; 
             }
          } catch (evalError) {
            yVal = null;
          }
          points.push({ x: roundedX, y: yVal });
        }
      } catch (compileError) {
        // This error is now set during onExpressionChange, so plotData generation for this expr should be skipped or return empty
        // console.error(`Error compiling expression "${expr.value}" for plotting:`, compileError);
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
              math.compile(newValue); 
            } catch (e) {
              error = e instanceof Error ? e.message : "Invalid expression syntax";
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
      { id: newId, value: '', color: getNextColor(), error: null, isVisible: true },
    ]);
    setActiveInputId(newId);
  };

  const removeExpression = (id: string) => {
    setExpressions(prev => {
        const newExpressions = prev.filter(expr => expr.id !== id);
        if (newExpressions.length === 0) { // If all expressions are removed, add a default one
            const defaultId = crypto.randomUUID();
            setActiveInputId(defaultId);
            return [{ id: defaultId, value: '', color: getNextColor(), error: null, isVisible: true }];
        }
        if (activeInputId === id) {
            setActiveInputId(newExpressions[newExpressions.length - 1]?.id || null);
        }
        return newExpressions;
    });
  };

  const toggleExpressionVisibility = (id: string) => {
    setExpressions(prev => 
      prev.map(expr => expr.id === id ? {...expr, isVisible: !expr.isVisible} : expr)
    );
  };

  const handleKeypadInput = (key: string) => {
    if (!activeInputId) {
        // If no input is active, and there's only one expression, activate it.
        if (expressions.length === 1) {
            setActiveInputId(expressions[0].id);
            // Use a timeout to allow state to update before trying to append
            setTimeout(() => appendToActiveExpression(expressions[0].id, key), 0);
        }
        return;
    }
    appendToActiveExpression(activeInputId, key);
  };

  const appendToActiveExpression = (idToUpdate: string, key: string) => {
     setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === idToUpdate) {
          let newValue = expr.value;
          // Focus the input and try to insert at cursor position (complex, for now append)
          // For simplicity, just appending. Proper cursor insertion is more involved.
          if (key === 'sqrt(' || key === 'sin(' || key === 'cos(' || key === 'tan(' || key === 'ln(' || key === 'log10(') {
            newValue += key;
          } else if (key === 'x^y' || key === '^') { // Treat x^y as just ^
             newValue += '^';
          } else if (key === '1/x') {
            newValue += '1/'; 
          } else {
            newValue += key;
          }
          
          let error: string | null = null;
           if (newValue.trim() !== '') {
            try {
              math.compile(newValue);
            } catch (e) {
              error = e instanceof Error ? e.message : "Invalid expression syntax";
            }
          }
          return { ...expr, value: newValue, error };
        }
        return expr;
      })
    );
  }


  const handleExampleSelect = (exampleValue: string) => {
    // If there's an empty input field, use that. Otherwise, add a new one.
    const emptyExprIndex = expressions.findIndex(e => e.value.trim() === '' && !e.error);
    let error: string | null = null;
    try {
        math.compile(exampleValue);
    } catch(e) {
        error = e instanceof Error ? e.message : "Invalid example expression";
    }

    if (emptyExprIndex !== -1 && !error) {
        const targetId = expressions[emptyExprIndex].id;
        setExpressions(prev => 
            prev.map(expr => expr.id === targetId ? {...expr, value: exampleValue, error: null} : expr)
        );
        setActiveInputId(targetId);
    } else if (!error) {
        const newId = crypto.randomUUID();
        setExpressions(prev => [
        ...prev,
        { id: newId, value: exampleValue, color: getNextColor(), error: null, isVisible: true },
        ]);
        setActiveInputId(newId);
    } else {
        // Handle error with example expression if necessary (e.g. toast notification)
        console.error("Error in example function:", error);
    }
  };
  
  const instructions = `
    Enter mathematical expressions like "x^2", "sin(x)", or "2*x + 1".
    - Use "^" for powers (e.g., x^3).
    - Supported functions: sin(), cos(), tan(), ln(), log10(), sqrt(), abs().
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

