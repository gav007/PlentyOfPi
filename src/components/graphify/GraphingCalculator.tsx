// src/components/graphify/GraphingCalculator.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Expression } from '@/types/graphify'; // Assuming this type exists
import ExpressionInputPanel from './ExpressionInputPanel';
import GraphCanvas from './GraphCanvas';
import VirtualKeypad from './VirtualKeypad';
import ExampleFunctions from './ExampleFunctions';
import HowToUseToggle from '@/components/ui/HowToUseToggle';
import DebugModeToggle from '@/components/debug/DebugModeToggle';
import PerformanceOverlay from '@/components/debug/PerformanceOverlay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import * as math from 'mathjs';

const INITIAL_EXPRESSIONS: Expression[] = [
  { id: crypto.randomUUID(), value: 'x^2', color: '#3B82F6', isVisible: true, error: null },
];

const MAX_EXPRESSIONS = 10;

export default function GraphingCalculator() {
  const [expressions, setExpressions] = useState<Expression[]>(INITIAL_EXPRESSIONS);
  const [activeInputId, setActiveInputId] = useState<string | null>(INITIAL_EXPRESSIONS[0]?.id || null);
  const [viewSettings, setViewSettings] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({}); // Placeholder


  const validateAndParseExpression = useCallback((value: string): { compiled: math.MathNode | null, error: string | null } => {
    if (!value.trim()) {
      return { compiled: null, error: null };
    }
    try {
      const node = math.parse(value);
      // Further validation could be done here if needed, e.g. checking for allowed functions/variables
      return { compiled: node, error: null };
    } catch (e) {
      return { compiled: null, error: e instanceof Error ? e.message : "Invalid expression" };
    }
  }, []);


  const handleExpressionChange = useCallback((id: string, newValue: string) => {
    setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === id) {
          const { error } = validateAndParseExpression(newValue);
          return { ...expr, value: newValue, error: error };
        }
        return expr;
      })
    );
  }, [validateAndParseExpression]);

  const handleAddExpression = useCallback(() => {
    if (expressions.length >= MAX_EXPRESSIONS) {
        setGlobalError(`Maximum of ${MAX_EXPRESSIONS} functions reached.`);
        setTimeout(() => setGlobalError(null), 3000);
        return;
    }
    const newId = crypto.randomUUID();
    // Simple color cycling for new expressions
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];
    const newColor = colors[expressions.length % colors.length];
    setExpressions(prev => [...prev, { id: newId, value: '', color: newColor, isVisible: true, error: null }]);
    setActiveInputId(newId);
  }, [expressions.length]);

  const handleDeleteExpression = useCallback((id: string) => {
    setExpressions(prev => prev.filter(expr => expr.id !== id));
    if (activeInputId === id) {
      setActiveInputId(expressions.length > 1 ? expressions.find(e => e.id !== id)?.id || null : null);
    }
  }, [activeInputId, expressions]);

  const handleToggleVisibility = useCallback((id: string) => {
    setExpressions(prev => prev.map(expr => expr.id === id ? { ...expr, isVisible: !expr.isVisible } : expr));
  }, []);
  
  const handleColorChange = useCallback((id: string, newColor: string) => {
    setExpressions(prev => prev.map(expr => expr.id === id ? { ...expr, color: newColor } : expr));
  }, []);

  const handleKeypadInput = useCallback((key: string) => {
    if (!activeInputId) return;
    setExpressions(prev =>
      prev.map(expr => {
        if (expr.id === activeInputId) {
          let newValue = expr.value;
          // Basic keypad logic, can be enhanced (e.g., cursor position)
          if (key === 'sqrt(') newValue += 'sqrt(';
          else if (key === '^') newValue += '^';
          else if (key === 'π') newValue += 'pi';
          else if (key === '1/x') newValue = `1/(${newValue || 'x'})`;
          else if (['sin(', 'cos(', 'tan(', 'ln('].includes(key)) newValue += key;
          else newValue += key;
          
          const { error } = validateAndParseExpression(newValue);
          return { ...expr, value: newValue, error };
        }
        return expr;
      })
    );
  }, [activeInputId, validateAndParseExpression]);

  const handleExampleLoad = useCallback((exampleValue: string) => {
    let targetId = activeInputId;
    // If no active input or current active input has content, try to find an empty one or add new
    const currentActiveExpr = expressions.find(e => e.id === activeInputId);
    if (!currentActiveExpr || currentActiveExpr.value.trim() !== '') {
        const emptyExpr = expressions.find(e => e.value.trim() === '');
        if (emptyExpr) {
            targetId = emptyExpr.id;
        } else if (expressions.length < MAX_EXPRESSIONS) {
            const newId = crypto.randomUUID();
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];
            const newColor = colors[expressions.length % colors.length];
            const newExpr = { id: newId, value: exampleValue, color: newColor, isVisible: true, error: null };
            setExpressions(prev => [...prev, newExpr]);
            setActiveInputId(newId);
            return; // Exit early as state update is async
        } else {
             setGlobalError(`Maximum of ${MAX_EXPRESSIONS} functions reached. Clear one to load example.`);
             setTimeout(() => setGlobalError(null), 3000);
             return;
        }
    }
    
    if (targetId) {
      setExpressions(prev =>
        prev.map(expr => {
          if (expr.id === targetId) {
            const { error } = validateAndParseExpression(exampleValue);
            return { ...expr, value: exampleValue, isVisible: true, error: error };
          }
          return expr;
        })
      );
      setActiveInputId(targetId); // Ensure it's active
    }
  }, [activeInputId, expressions, validateAndParseExpression]);

  const graphInstructions = `
    Enter math expressions (e.g., y = x^2, f(x) = sin(x)).
    Use the keypad for symbols like π, √, or functions like sin, cos.
    Click '+' to add multiple functions.
    Toggle visibility with the eye icon. Change color with the color swatch.
    Use mouse/touch to pan and zoom the graph.
    Adjust X/Y axis bounds for custom scaling.
  `;
  
  // Performance effect placeholder
  useEffect(() => {
    if (isDebugMode) {
      const intervalId = setInterval(() => {
        // Simulate performance metric update
        setPerformanceMetrics({
          renderTime: Math.random() * 10 + 5, // Simulate 5-15ms render time
          fps: Math.random() * 10 + 50,      // Simulate 50-60 FPS
        });
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setPerformanceMetrics({});
    }
  }, [isDebugMode]);


  return (
    <div className="p-4 md:p-6 space-y-6 flex flex-col h-full">
       {globalError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}
      <HowToUseToggle instructions={graphInstructions} title="How to Use Graphify" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
        <div className="lg:col-span-1 space-y-4 flex flex-col min-h-0">
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
        </div>
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <GraphCanvas
            expressions={expressions.filter(e => e.isVisible && !e.error)}
            viewSettings={viewSettings}
            onViewSettingsChange={setViewSettings}
            isDebugMode={isDebugMode}
          />
        </div>
      </div>
      <DebugModeToggle onToggle={setIsDebugMode} initialDebugMode={isDebugMode}/>
      {isDebugMode && <PerformanceOverlay metrics={performanceMetrics} />}
    </div>
  );
}
