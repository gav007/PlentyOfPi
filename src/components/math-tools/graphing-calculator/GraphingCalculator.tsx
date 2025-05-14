
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FunctionDefinition, GraphViewSettings } from '@/types/graphify';
import ExpressionInputPanel from './ExpressionInputPanel';
import GraphCanvas from './GraphCanvas';
import VirtualKeypad from './VirtualKeypad';
import ExampleFunctions from './ExampleFunctions';
import HowToUseToggle from '@/components/ui/HowToUseToggle'; // Updated import
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, LineChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parse, compile } from 'mathjs';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
  '#8B5CF6', '#EF4444', '#6366F1', '#F97316',
  '#22D3EE', '#A3E635'
];
let colorIdx = 0; // This will be reset on each full page load / component remount.
                  // For true persistence across soft navigations if this component stays mounted,
                  // this might need to be a ref or part of a context/global state.

const getNextColorCycle = (): string => {
  const color = DEFAULT_COLORS[colorIdx % DEFAULT_COLORS.length];
  colorIdx = (colorIdx + 1); 
  // Removed reset to 0, will cycle through colors continuously.
  // If you prefer colors to repeat strictly from the beginning after 10,
  // you can add: if (colorIdx >= DEFAULT_COLORS.length) colorIdx = 0;
  // For now, it will just keep taking modulo of an increasing colorIdx.
  return color;
};


const MAX_EXPRESSIONS = 10;
const INITIAL_VIEW_SETTINGS: GraphViewSettings = { 
  xMin: -10, xMax: 10, yMin: -10, yMax: 10, grid: true, autoScaleY: true 
};

export default function GraphingCalculator() {
  const [expressions, setExpressions] = useState<FunctionDefinition[]>([
    { id: `graphify-expr-${Math.random().toString(36).substring(2, 9)}`, expression: 'x^2', color: getNextColorCycle(), isVisible: true, error: null },
  ]);
  const [activeInputId, setActiveInputId] = useState<string | null>(expressions[0]?.id || null);
  const [viewSettings, setViewSettings] = useState<GraphViewSettings>(INITIAL_VIEW_SETTINGS);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateExpression = useCallback((value: string): { error: string | null } => {
    if (!value.trim()) return { error: null };
    try {
      parse(value); 
      return { error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid expression";
      return { error: message.length > 60 ? message.substring(0, 60) + "..." : message };
    }
  }, []);

  const handleExpressionChange = useCallback((id: string, newValue: string) => {
    setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === id) {
          const { error } = validateExpression(newValue);
          return { ...expr, expression: newValue, error };
        }
        return expr;
      })
    );
  }, [validateExpression]);

  const handleAddExpression = useCallback(() => {
    if (expressions.length >= MAX_EXPRESSIONS) {
      setGlobalError(`Maximum of ${MAX_EXPRESSIONS} functions reached.`);
      setTimeout(() => setGlobalError(null), 3000);
      return;
    }
    const newId = `graphify-expr-${Math.random().toString(36).substring(2, 9)}`;
    const newExpr = { id: newId, expression: '', color: getNextColorCycle(), isVisible: true, error: null };
    setExpressions(prev => [...prev, newExpr]);
    setActiveInputId(newId);
  }, [expressions.length]);

  const handleDeleteExpression = useCallback((id: string) => {
    setExpressions(prev => {
      const filtered = prev.filter(expr => expr.id !== id);
      if (filtered.length === 0) { 
        const newId = `graphify-expr-${Math.random().toString(36).substring(2, 9)}`;
        setActiveInputId(newId);
        return [{ id: newId, expression: '', color: getNextColorCycle(), isVisible: true, error: null }];
      }
      if (activeInputId === id) {
        setActiveInputId(filtered[0]?.id || null);
      }
      return filtered;
    });
  }, [activeInputId]);

  const handleToggleVisibility = useCallback((id: string) => {
    setExpressions(prev => prev.map(expr => expr.id === id ? { ...expr, isVisible: !expr.isVisible } : expr));
  }, []);
  
  const handleColorChange = useCallback((id: string, newColor: string) => {
    setExpressions(prev => prev.map(expr => expr.id === id ? { ...expr, color: newColor } : expr));
  }, []);

  const handleKeypadInput = useCallback((key: string) => {
    if (!activeInputId) {
      const firstEmpty = expressions.find(e => e.expression.trim() === '');
      let targetIdToUpdate: string;

      if (firstEmpty) {
        targetIdToUpdate = firstEmpty.id;
      } else if (expressions.length < MAX_EXPRESSIONS) {
        const newId = `graphify-expr-${Math.random().toString(36).substring(2, 9)}`;
        const newExpr = { id: newId, expression: '', color: getNextColorCycle(), isVisible: true, error: null };
        setExpressions(prev => [...prev, newExpr]);
        setActiveInputId(newId); // Set active before updating its value
        targetIdToUpdate = newId;
      } else {
         toast({title:"No Active Input or Max Functions", description: "Click an expression field or add a new one.", variant:"destructive"});
         return;
      }
       // Now update the expression for targetIdToUpdate
        setExpressions(prev =>
        prev.map(expr => {
          if (expr.id === targetIdToUpdate) {
            const newValue = expr.expression + key;
            const { error } = validateExpression(newValue);
            return { ...expr, expression: newValue, error };
          }
          return expr;
        })
      );
      if(activeInputId !== targetIdToUpdate) setActiveInputId(targetIdToUpdate);


    } else { // activeInputId exists
        setExpressions(prev =>
        prev.map(expr => {
            if (expr.id === activeInputId) {
            const newValue = expr.expression + key;
            const { error } = validateExpression(newValue);
            return { ...expr, expression: newValue, error };
            }
            return expr;
        })
        );
    }
  }, [activeInputId, expressions, MAX_EXPRESSIONS, validateExpression, toast]);


  const handleExampleLoad = useCallback((exampleValue: string) => {
    let targetId = activeInputId;
    const currentActiveExpr = expressions.find(e => e.id === activeInputId);

    if (!currentActiveExpr || currentActiveExpr.expression.trim() !== '') {
        const emptyExpr = expressions.find(e => e.expression.trim() === '');
        if (emptyExpr) {
            targetId = emptyExpr.id;
        } else if (expressions.length < MAX_EXPRESSIONS) {
            const newId = `graphify-expr-${Math.random().toString(36).substring(2, 9)}`;
            const validation = validateExpression(exampleValue);
            const newExpr = { id: newId, expression: exampleValue, color: getNextColorCycle(), isVisible: true, error: validation.error };
            setExpressions(prev => [...prev, newExpr]);
            setActiveInputId(newId);
            return; 
        } else {
             setGlobalError(`Max ${MAX_EXPRESSIONS} functions. Clear one to load example.`);
             setTimeout(() => setGlobalError(null), 3000);
             return;
        }
    }
    
    if (targetId) {
      const validation = validateExpression(exampleValue);
      setExpressions(prev =>
        prev.map(expr => 
          expr.id === targetId 
          ? { ...expr, expression: exampleValue, isVisible: true, error: validation.error } 
          : expr
        )
      );
      if (!activeInputId || activeInputId !== targetId) setActiveInputId(targetId);
    }
  }, [activeInputId, expressions, MAX_EXPRESSIONS, validateExpression]);

  const graphingInstructions = `
- Enter math expressions (e.g., <code>y = x^2</code>, <code>f(x) = sin(x)</code>).
- Use the keypad for symbols like π, √, or functions like sin, cos.
- Click '+' to add multiple functions.
- Toggle visibility with the eye icon. Change color with the color swatch.
- Use mouse/touch to pan and zoom the graph.
- Adjust X/Y axis bounds for custom scaling in settings (⚙️ icon).
`;

  return (
    <div className="flex flex-col h-full bg-background">
      <Card className="m-2 sm:m-3 shadow-md flex-shrink-0">
         <CardHeader className="py-2.5 sm:py-3 px-3 sm:px-4 text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold text-primary flex items-center justify-center gap-1.5 sm:gap-2">
                <LineChart className="w-5 h-5 sm:w-6 sm:h-6"/> Graphing Calculator
            </CardTitle>
         </CardHeader>
      </Card>

       {globalError && (
        <Alert variant="destructive" className="mx-2 sm:mx-3 mb-2 text-xs p-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-xs">Error</AlertTitle>
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 px-2 sm:px-3 pb-2 sm:pb-3 min-h-0">
        <div className="lg:col-span-1 space-y-2 sm:space-y-3 flex flex-col min-h-0">
          <ExpressionInputPanel
            expressions={expressions}
            onExpressionChange={handleExpressionChange}
            onAddExpression={handleAddExpression}
            onDeleteExpression={handleDeleteExpression}
            onToggleVisibility={handleToggleVisibility}
            onColorChange={handleColorChange}
            activeInputId={activeInputId}
            setActiveInputId={setActiveInputId}
            maxExpressions={MAX_EXPRESSIONS}
          />
          <VirtualKeypad onKeypadInput={handleKeypadInput} />
          <ExampleFunctions onExampleLoad={handleExampleLoad} />
          <div className="mt-auto pt-1.5 sm:pt-2">
            <HowToUseToggle instructions={graphingInstructions} title="How to Use Calculator" />
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col min-h-0 h-full">
          <GraphCanvas
            expressions={expressions} 
            viewSettings={viewSettings}
            onViewSettingsChange={setViewSettings}
          />
        </div>
      </div>
    </div>
  );
}
