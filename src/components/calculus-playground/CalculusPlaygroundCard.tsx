
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

const PLOT_POINTS = 200; // Number of points to plot for f(x)

// Numerical methods
function numericalDerivative(fn: (x: number) => number, x: number, h: number = 0.0001): number {
  if (h === 0) return NaN;
  try {
    // Ensure x is finite before attempting calculations
    if (!isFinite(x)) return NaN;
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
  // Ensure a and b are finite
  if (!isFinite(a) || !isFinite(b)) return NaN;
  if (a === b) return 0;
  const h = (b - a) / n;
  let sum = 0;
  try {
    const fa = fn(a);
    const fb = fn(b);

    if (isNaN(fa) || !isFinite(fa) || isNaN(fb) || !isFinite(fb)) {
       return NaN;
    }

    sum += fa / 2.0;
    sum += fb / 2.0;
    for (let i = 1; i < n; i++) {
      const x_i = a + i * h;
      const f_x_i = fn(x_i);
      if (isNaN(f_x_i) || !isFinite(f_x_i)) {
         continue;
      }
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

  const parsedDomain = React.useMemo(() => {
    let xMin = parseFloat(domainOptions.xMin);
    let xMax = parseFloat(domainOptions.xMax);
    const yMinRaw = domainOptions.yMin.toLowerCase();
    const yMaxRaw = domainOptions.yMax.toLowerCase();

    if (isNaN(xMin) || isNaN(xMax) || xMin >= xMax) {
      xMin = -10;
      xMax = 10;
    }

    let yMinProcessed: number | 'auto' = yMinRaw === 'auto' ? 'auto' : parseFloat(yMinRaw);
    let yMaxProcessed: number | 'auto' = yMaxRaw === 'auto' ? 'auto' : parseFloat(yMaxRaw);

    if (typeof yMinProcessed === 'number' && isNaN(yMinProcessed)) yMinProcessed = 'auto';
    if (typeof yMaxProcessed === 'number' && isNaN(yMaxProcessed)) yMaxProcessed = 'auto';

    if (typeof yMinProcessed === 'number' && typeof yMaxProcessed === 'number' && yMinProcessed >= yMaxProcessed) {
      yMinProcessed = 'auto';
      yMaxProcessed = 'auto';
    }

    return { xMin, xMax, yMin: yMinProcessed, yMax: yMaxProcessed };
  }, [domainOptions]);

  React.useEffect(() => {
    if (xValue < parsedDomain.xMin) setXValue(parsedDomain.xMin);
    else if (xValue > parsedDomain.xMax) setXValue(parsedDomain.xMax);
  }, [parsedDomain.xMin, parsedDomain.xMax, xValue]);


  const [showFullDerivativeCurve, setShowFullDerivativeCurve] = React.useState<boolean>(false);
  const [showTangent, setShowTangent] = React.useState<boolean>(true);
  const [showArea, setShowArea] = React.useState<boolean>(true);

  const compiledFunc = React.useMemo(() => {
    try {
      // Pre-process function string for common mathjs compatibility
      // e.g. arctan -> atan, ensure 'e' is math.e if not contextually available
      let processedFuncStr = functionStr.replace(/\barctan\b/g, 'atan');
      // math.js typically handles 'e' as Euler's number in its parser context
      // No explicit replacement for 'e' or 'ln' (as log) needed if math.js standard functions are used.
      // 'abs' is standard.
      const node = math.parse(processedFuncStr);
      setErrorMessage(null);
      return node.compile();
    } catch (e) {
      setErrorMessage(e instanceof Error ? `Invalid function: ${e.message}. Ensure valid syntax (e.g., use 'atan' for arctan, '*' for multiplication).` : 'Invalid function input.');
      return null;
    }
  }, [functionStr]);

  const evaluateAt = React.useCallback((x: number): number => {
    if (!compiledFunc) return NaN;
    try {
       // Provide 'e' explicitly in scope if mathjs compile doesn't pick it up contextually for some expressions
      const result = compiledFunc.evaluate({ x, e: Math.E });
      // Check for complex numbers, which Recharts doesn't plot. Return NaN for them.
      if (typeof result === 'object' && result.isComplex) {
        return NaN;
      }
      return (typeof result === 'number' && isFinite(result)) ? result : NaN;
    } catch { return NaN; }
  }, [compiledFunc]);

  const fx = React.useMemo(() => evaluateAt(xValue), [evaluateAt, xValue]);
  const fpx = React.useMemo(() => numericalDerivative(evaluateAt, xValue), [evaluateAt, xValue]);
  const integralVal = React.useMemo(() => trapezoidalRule(evaluateAt, 0, xValue), [evaluateAt, xValue]);

  const plotData = React.useMemo(() => {
    if (!compiledFunc || parsedDomain.xMin >= parsedDomain.xMax) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (parsedDomain.xMax - parsedDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = parsedDomain.xMin + i * step;
      const yVal = evaluateAt(x);
      points.push({ x, y: isNaN(yVal) ? null : yVal });
    }
    return points;
  }, [evaluateAt, compiledFunc, parsedDomain.xMin, parsedDomain.xMax]);

  const effectiveDomain = React.useMemo(() => {
    let yMinResolved = parsedDomain.yMin;
    let yMaxResolved = parsedDomain.yMax;

    if (yMinResolved === 'auto' || yMaxResolved === 'auto') {
      const yValues = plotData.map(p => p.y).filter(y => y !== null && isFinite(y)) as number[];
      if (yValues.length > 0) {
        const dataMinY = Math.min(...yValues);
        const dataMaxY = Math.max(...yValues);
        const range = dataMaxY - dataMinY;
        const padding = range === 0 ? 1 : range * 0.15; 

        if (yMinResolved === 'auto') yMinResolved = dataMinY - padding;
        if (yMaxResolved === 'auto') yMaxResolved = dataMaxY + padding;

        if (typeof yMinResolved === 'number' && yMinResolved > dataMinY) yMinResolved = dataMinY - padding * 0.5;
        if (typeof yMaxResolved === 'number' && yMaxResolved < dataMaxY) yMaxResolved = dataMaxY + padding * 0.5;


        if (yMinResolved === 0 && yMaxResolved === 0 && dataMinY === 0 && dataMaxY === 0) {
            yMinResolved = -1; yMaxResolved = 1;
        } else if (typeof yMinResolved === 'number' && typeof yMaxResolved === 'number' && yMinResolved >= yMaxResolved) {
             yMinResolved = dataMinY - padding;
             yMaxResolved = dataMaxY + padding;
             if (yMinResolved >= yMaxResolved) { 
                 yMinResolved = (yMinResolved + yMaxResolved)/2 - 1;
                 yMaxResolved = yMinResolved + 2;
             }
        }
      } else {
        if (yMinResolved === 'auto') yMinResolved = -10;
        if (yMaxResolved === 'auto') yMaxResolved = 10;
      }
    }

    if (typeof yMinResolved === 'number' && typeof yMaxResolved === 'number' && yMinResolved >= yMaxResolved) {
        const mid = (yMinResolved + yMaxResolved) / 2 || 0;
        yMinResolved = mid - 5;
        yMaxResolved = mid + 5;
        if (yMinResolved === yMaxResolved) { yMinResolved -= 0.5; yMaxResolved += 0.5; }
    }
    
    // Ensure yMin and yMax are numbers for the plot display
    const finalYMin = typeof yMinResolved === 'string' ? -10 : yMinResolved;
    const finalYMax = typeof yMaxResolved === 'string' ? 10 : yMaxResolved;


    return { xMin: parsedDomain.xMin, xMax: parsedDomain.xMax, yMin: finalYMin, yMax: finalYMax };
  }, [parsedDomain, plotData]);


  const derivativePlotData = React.useMemo(() => {
    if (!compiledFunc || !showFullDerivativeCurve || effectiveDomain.xMin >= effectiveDomain.xMax) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (effectiveDomain.xMax - effectiveDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = effectiveDomain.xMin + i * step;
      const yPrime = numericalDerivative(evaluateAt, x);
      points.push({ x, y: isNaN(yPrime) ? null : yPrime });
    }
    return points;
  }, [evaluateAt, compiledFunc, showFullDerivativeCurve, effectiveDomain.xMin, effectiveDomain.xMax]);

  const areaDataForPlot = React.useMemo(() => {
    if (!plotData || plotData.length === 0 || !showArea) return [];
    return plotData.map((p) => ({
      x: p.x,
      y: (p.y !== null && isFinite(p.y) && p.x >= Math.min(0, xValue) && p.x <= Math.max(0, xValue)) ? p.y : 0,
    }));
  }, [plotData, xValue, showArea]);


  const handleXValueChangeByClick = (newX: number) => {
    const clampedX = Math.max(effectiveDomain.xMin, Math.min(effectiveDomain.xMax, newX));
    setXValue(clampedX);
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
          derivativePlotData={derivativePlotData}
          areaData={areaDataForPlot}
          xValue={xValue}
          fxValue={fx}
          fpxValue={fpx}
          showTangent={showTangent}
          showArea={showArea}
          showFullDerivativeCurve={showFullDerivativeCurve}
          domain={effectiveDomain}
          onXValueChangeByClick={handleXValueChangeByClick}
        />

        <SliderControl
          value={xValue}
          onValueChange={setXValue}
          min={effectiveDomain.xMin}
          max={effectiveDomain.xMax}
          step={(effectiveDomain.xMax - effectiveDomain.xMin) / PLOT_POINTS || 0.01}
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
