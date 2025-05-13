// src/components/debug/EquationTestHarness.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import * as math from 'mathjs';
import type { Expression } from '@/types/graphify'; // Assuming type exists
import GraphCanvas from '@/components/graphify/GraphCanvas'; // Reuse your graph canvas

const defaultTestEquations = [
  "1/0", // Division by zero
  "log(-1)", // Log of negative number
  "sqrt(-4)", // Square root of negative (complex result)
  "sin(x)/x", // Potential issue at x=0
  "tan(pi/2)", // Vertical asymptote
  "x^x", // Complex behavior
  "1/(x-2)", // Asymptote
  "floor(x) + ceil(x)", // Step functions
  "nonExistentFunction(x)", // Should throw parsing error
  "x + y", // Multi-variable (if not supported by main grapher)
  "1e1000", // Very large number (Infinity)
  "1e-1000", // Very small number (close to 0)
];

export default function EquationTestHarness() {
  const [expressionInput, setExpressionInput] = useState<string>('1/x');
  const [parsedExpression, setParsedExpression] = useState<Expression | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<string>('');
  const [plotPoints, setPlotPoints] = useState<Array<{x: number, y: number | null }>>([]);
  const [viewSettings, setViewSettings] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });

  useEffect(() => {
    handleTestExpression();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expressionInput]); // Auto-test on input change

  const handleTestExpression = () => {
    setEvaluationResult('');
    setPlotPoints([]);
    if (!expressionInput.trim()) {
      setParsedExpression(null);
      return;
    }

    let compiledNode: math.MathNode | null = null;
    let parseError: string | null = null;

    try {
      compiledNode = math.parse(expressionInput);
      // Simulate the Expression object structure
      setParsedExpression({
        id: 'test-expr',
        value: expressionInput,
        color: '#FF5733', // Fixed color for test harness
        isVisible: true,
        error: null,
      });
    } catch (e) {
      parseError = e instanceof Error ? e.message : "Invalid expression syntax";
      setParsedExpression({
        id: 'test-expr',
        value: expressionInput,
        color: '#FF5733',
        isVisible: true,
        error: parseError,
      });
      setEvaluationResult(`Parse Error: ${parseError}`);
      return;
    }

    // Test evaluation at a few points
    let evalOutput = `Expression: ${expressionInput}\nParsed: ${compiledNode ? compiledNode.toString() : 'Error'}\n\nEvaluations:\n`;
    const testPoints = [-2, -1, 0, 1, 2];
    if (compiledNode) {
      const compiledFunc = compiledNode.compile();
      testPoints.forEach(x => {
        try {
          const y = compiledFunc.evaluate({ x });
          evalOutput += `  f(${x}) = ${typeof y === 'number' && !isNaN(y) ? y.toFixed(4) : String(y)}\n`;
        } catch (evalErr) {
          evalOutput += `  f(${x}) = Error: ${evalErr instanceof Error ? evalErr.message : String(evalErr)}\n`;
        }
      });

      // Generate plot points for the canvas
      const points = [];
      const step = (viewSettings.xMax - viewSettings.xMin) / 200; // 200 points
      for (let i = 0; i <= 200; i++) {
        const xVal = viewSettings.xMin + i * step;
        try {
          const yVal = compiledFunc.evaluate({ x: xVal });
          points.push({ x: xVal, y: (typeof yVal === 'number' && isFinite(yVal)) ? yVal : null });
        } catch {
          points.push({ x: xVal, y: null });
        }
      }
      setPlotPoints(points);
    }
    setEvaluationResult(evalOutput);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Equation Input</CardTitle>
          <CardDescription>
            Enter an equation to parse, evaluate at sample points, and plot.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <Label htmlFor="test-expression-input">Equation (e.g., 1/x, log(-1))</Label>
              <Input
                id="test-expression-input"
                value={expressionInput}
                onChange={(e) => setExpressionInput(e.target.value)}
                placeholder="Enter math expression"
              />
            </div>
            <Button onClick={handleTestExpression}>Test Expression</Button>
          </div>
          <div>
            <Label>Quick Test Equations:</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {defaultTestEquations.map(eq => (
                <Button key={eq} variant="outline" size="sm" onClick={() => setExpressionInput(eq)}>
                  {eq}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluation &amp; Plot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="evaluation-output">Evaluation Output:</Label>
            <Textarea
              id="evaluation-output"
              value={evaluationResult}
              readOnly
              rows={8}
              className="font-mono text-xs bg-muted/50"
            />
          </div>
          {parsedExpression && (
            <div className="h-[400px] border rounded-md p-2 bg-background">
              <GraphCanvas
                expressions={[parsedExpression]} // Pass as array
                viewSettings={viewSettings}
                onViewSettingsChange={setViewSettings}
                isDebugMode={true} // Enable debug features if any
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
