
'use client';

import * as React from 'react';
import * as math from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import FunctionInput from './FunctionInput';
import PlotDisplay from './PlotDisplay';
import SliderControl from './SliderControl';
import ResultPanel from './ResultPanel';
import TogglePanel from './TogglePanel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const PLOT_DOMAIN_MIN = -10;
const PLOT_DOMAIN_MAX = 10;
const PLOT_POINTS = 200; // Number of points to plot for f(x) and f'(x)

// Numerical methods
function numericalDerivative(fn: (x: number) => number, x: number, h: number = 0.0001): number {
  if (h === 0) return NaN;
  try {
    const f_x_plus_h = fn(x + h);
    const f_x_minus_h = fn(x - h);
    if (isNaN(f_x_plus_h) || isNaN(f_x_minus_h) || !isFinite(f_x_plus_h) || !isFinite(f_x_minus_h)) return NaN;
    return (f_x_plus_h - f_x_minus_h) / (2 * h);
  } catch {
    return NaN;
  }
}

function trapezoidalRule(fn: (x: number) => number, a: number, b: number, n: number = 100): number {
  if (n <= 0) return NaN;
  if (a === b) return 0;
  const h = (b - a) / n;
  let sum = 0;
  try {
    const fa = fn(a);
    const fb = fn(b);
    if (isNaN(fa) || !isFinite(fa) || isNaN(fb) || !isFinite(fb)) return NaN;

    sum += fa / 2.0;
    sum += fb / 2.0;
    for (let i = 1; i < n; i++) {
      const x_i = a + i * h;
      const f_x_i = fn(x_i);
      if (isNaN(f_x_i) || !isFinite(f_x_i)) return NaN; // Stop if function is undefined or infinite at any point
      sum += f_x_i;
    }
    return sum * h;
  } catch {
    return NaN;
  }
}

export default function CalculusPlaygroundCard() {
  const [functionStr, setFunctionStr] = React.useState<string>('x^2');
  const [xValue, setXValue] = React.useState<number>(1);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [showDerivative, setShowDerivative] = React.useState<boolean>(false);
  const [showTangent, setShowTangent] = React.useState<boolean>(true);
  const [showArea, setShowArea] = React.useState<boolean>(true);

  const compiledFunc = React.useMemo(() => {
    try {
      const node = math.parse(functionStr);
      setErrorMessage(null);
      return node.compile();
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(`Invalid function: ${e.message}`);
      } else {
        setErrorMessage('Invalid function input.');
      }
      return null;
    }
  }, [functionStr]);

  const evaluateAt = React.useCallback((x: number): number => {
    if (!compiledFunc) return NaN;
    try {
      const result = compiledFunc.evaluate({ x });
      if (typeof result === 'number' && isFinite(result)) {
        return result;
      }
      // Handle mathjs Complex numbers or other types if necessary, for now, expect number
      return NaN;
    } catch {
      return NaN;
    }
  }, [compiledFunc]);

  const fx = React.useMemo(() => evaluateAt(xValue), [evaluateAt, xValue]);
  const fpx = React.useMemo(() => numericalDerivative(evaluateAt, xValue), [evaluateAt, xValue]);
  const integralVal = React.useMemo(() => trapezoidalRule(evaluateAt, 0, xValue), [evaluateAt, xValue]);

  const plotData = React.useMemo(() => {
    if (!compiledFunc) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (PLOT_DOMAIN_MAX - PLOT_DOMAIN_MIN) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = PLOT_DOMAIN_MIN + i * step;
      const y = evaluateAt(x);
      points.push({ x, y: isNaN(y) || !isFinite(y) ? null : y });
    }
    return points;
  }, [evaluateAt, compiledFunc]); // evaluateAt depends on compiledFunc

  const derivativePlotData = React.useMemo(() => {
    if (!compiledFunc || !showDerivative) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (PLOT_DOMAIN_MAX - PLOT_DOMAIN_MIN) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = PLOT_DOMAIN_MIN + i * step;
      const yPrime = numericalDerivative(evaluateAt, x);
      points.push({ x, y: isNaN(yPrime) || !isFinite(yPrime) ? null : yPrime });
    }
    return points;
  }, [evaluateAt, compiledFunc, showDerivative]);

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>Interactive Calculus Tool</CardTitle>
        <CardDescription>Enter a function of 'x' and explore its properties.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FunctionInput functionStr={functionStr} onFunctionStrChange={setFunctionStr} />

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <PlotDisplay
          plotData={plotData}
          derivativePlotData={showDerivative ? derivativePlotData : []}
          xValue={xValue}
          fxValue={fx}
          fpxValue={fpx}
          showTangent={showTangent}
          showArea={showArea}
          domainMin={PLOT_DOMAIN_MIN}
          domainMax={PLOT_DOMAIN_MAX}
        />
        
        <SliderControl
          value={xValue}
          onValueChange={setXValue}
          min={PLOT_DOMAIN_MIN}
          max={PLOT_DOMAIN_MAX}
          step={0.05}
        />
        
        <ResultPanel xValue={xValue} fxValue={fx} fpxValue={fpx} integralValue={integralVal} />
        
        <TogglePanel
          showDerivative={showDerivative}
          onShowDerivativeChange={setShowDerivative}
          showTangent={showTangent}
          onShowTangentChange={setShowTangent}
          showArea={showArea}
          onShowAreaChange={setShowArea}
        />
      </CardContent>
    </Card>
  );
}
