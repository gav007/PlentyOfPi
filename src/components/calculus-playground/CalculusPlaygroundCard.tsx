
'use client';

import * as React from 'react';
import * as math from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import FunctionInput, { type DomainOptions } from './FunctionInput';
import PlotDisplay from './PlotDisplay';
import SliderControl from './SliderControl';
import ResultPanel from './ResultPanel';
import TogglePanel from './TogglePanel';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
      if (isNaN(f_x_i) || !isFinite(f_x_i)) return NaN;
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

  const [domainOptions, setDomainOptions] = React.useState<DomainOptions>({
    xMin: '-10', xMax: '10', yMin: 'auto', yMax: 'auto',
  });

  // Parsed domain values, with fallbacks
  const currentDomain = React.useMemo(() => {
    const xMin = parseFloat(domainOptions.xMin);
    const xMax = parseFloat(domainOptions.xMax);
    const yMin = domainOptions.yMin.toLowerCase() === 'auto' ? 'auto' : parseFloat(domainOptions.yMin);
    const yMax = domainOptions.yMax.toLowerCase() === 'auto' ? 'auto' : parseFloat(domainOptions.yMax);
    return {
      xMin: isNaN(xMin) ? -10 : xMin,
      xMax: isNaN(xMax) ? 10 : xMax,
      yMin: isNaN(Number(yMin)) ? 'auto' : yMin as number, // Type assertion after isNaN check
      yMax: isNaN(Number(yMax)) ? 'auto' : yMax as number, // Type assertion after isNaN check
    };
  }, [domainOptions]);
  
  // Ensure xValue is within currentDomain.xMin and currentDomain.xMax
  React.useEffect(() => {
    if (xValue < currentDomain.xMin) {
      setXValue(currentDomain.xMin);
    } else if (xValue > currentDomain.xMax) {
      setXValue(currentDomain.xMax);
    }
  }, [currentDomain.xMin, currentDomain.xMax, xValue]);


  const [showFullDerivativeCurve, setShowFullDerivativeCurve] = React.useState<boolean>(false); // Default to hidden
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
    const step = (currentDomain.xMax - currentDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = currentDomain.xMin + i * step;
      const y = evaluateAt(x);
      points.push({ x, y: isNaN(y) || !isFinite(y) ? null : y });
    }
    return points;
  }, [evaluateAt, compiledFunc, currentDomain.xMin, currentDomain.xMax]);

  const derivativePlotData = React.useMemo(() => {
    if (!compiledFunc || !showFullDerivativeCurve) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (currentDomain.xMax - currentDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = currentDomain.xMin + i * step;
      const yPrime = numericalDerivative(evaluateAt, x);
      points.push({ x, y: isNaN(yPrime) || !isFinite(yPrime) ? null : yPrime });
    }
    return points;
  }, [evaluateAt, compiledFunc, showFullDerivativeCurve, currentDomain.xMin, currentDomain.xMax]);

  const handleXValueChangeByClick = (newX: number) => {
    setXValue(newX);
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>Interactive Calculus Tool</CardTitle>
        <CardDescription>Enter a function of 'x', set graph scale, and explore its properties.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FunctionInput
          functionStr={functionStr}
          onFunctionStrChange={setFunctionStr}
          domainOptions={domainOptions}
          onDomainOptionsChange={setDomainOptions}
        />

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <PlotDisplay
          plotData={plotData}
          derivativePlotData={derivativePlotData} // Pass full derivative data
          xValue={xValue}
          fxValue={fx}
          fpxValue={fpx}
          showTangent={showTangent}
          showArea={showArea}
          showFullDerivativeCurve={showFullDerivativeCurve} // Control visibility of f'(x) curve
          domain={currentDomain}
          onXValueChangeByClick={handleXValueChangeByClick}
        />
        
        <SliderControl
          value={xValue}
          onValueChange={setXValue}
          min={currentDomain.xMin}
          max={currentDomain.xMax}
          step={(currentDomain.xMax - currentDomain.xMin) / 200} // Dynamic step
        />
        
        <ResultPanel xValue={xValue} fxValue={fx} fpxValue={fpx} integralValue={integralVal} />
        
        <TogglePanel
          showFullDerivativeCurve={showFullDerivativeCurve}
          onShowFullDerivativeCurveChange={setShowFullDerivativeCurve}
          showTangent={showTangent}
          onShowTangentChange={setShowTangent}
          showArea={showArea}
          onShowAreaChange={setShowArea}
        />
      </CardContent>
    </Card>
  );
}
