
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

const INITIAL_DOMAIN_OPTIONS: DomainOptions = {
  xMin: '-10', xMax: '10', yMin: 'auto', yMax: 'auto',
};

export default function CalculusPlaygroundCard() {
  const [functionStr, setFunctionStr] = React.useState<string>('x^2');
  const [xValue, setXValue] = React.useState<number>(1);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [domainOptions, setDomainOptions] = React.useState<DomainOptions>(INITIAL_DOMAIN_OPTIONS);

  const compiledFunc = React.useMemo(() => {
    try {
      let processedFuncStr = functionStr.replace(/\barctan\b/g, 'atan');
      const node = math.parse(processedFuncStr);
      setErrorMessage(null); // Clear parsing error if successful
      return node.compile();
    } catch (e) {
      setErrorMessage(e instanceof Error ? `Invalid function syntax: ${e.message}. Ensure valid syntax (e.g., use 'atan' for arctan, '*' for multiplication).` : 'Invalid function input.');
      return null;
    }
  }, [functionStr]);

  const evaluateAt = React.useCallback((x: number): number => {
    if (!compiledFunc) return NaN;
    try {
      const result = compiledFunc.evaluate({ x, e: Math.E });
      if (typeof result === 'object' && result.isComplex) {
        // console.warn(`Complex result for f(${x}): ${result}`);
        return NaN;
      }
      return (typeof result === 'number' && isFinite(result)) ? result : NaN;
    } catch (error) {
      console.error(`Error evaluating function '${functionStr}' at x=${x}:`, error);
      return NaN;
    }
  }, [compiledFunc, functionStr]);

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
  
  React.useEffect(() => {
    const allNull = plotData.every(p => p.y === null);
    const noPlottableMessage = "The function resulted in no plottable points in the current x-domain. Try adjusting the x-axis scale or check for mathematical issues (e.g., log of zero, division by zero).";

    if (allNull && compiledFunc && (!errorMessage || !errorMessage.includes("Invalid function syntax"))) { // Only show if not already a parsing error
      setErrorMessage(prevError => {
        if (prevError && prevError.includes("Invalid function syntax")) { // If parsing error exists, append
            return prevError.includes(noPlottableMessage) ? prevError : `${prevError} Additionally, ${noPlottableMessage.toLowerCase()}`;
        }
        return noPlottableMessage; // Set as new error
      });
    } else if (!allNull && errorMessage && errorMessage.includes(noPlottableMessage)) {
      // If plotData becomes valid, clear only the "no plottable points" message
      setErrorMessage(prevError => {
          if (prevError) {
            let newError = prevError.replace(noPlottableMessage, "").replace("Additionally, ", "").trim();
            return newError.length > 0 ? newError : null;
          }
          return null;
      });
    }
  }, [plotData, compiledFunc, errorMessage, setErrorMessage]);


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
    if (!plotData || plotData.length === 0 || !showArea) {
      return [];
    }
    const data = plotData.map((p) => ({
      x: p.x,
      y: (p.y !== null && isFinite(p.y) && p.x >= Math.min(0, xValue) && p.x <= Math.max(0, xValue)) ? p.y : 0,
    }));
    return data;
  }, [plotData, xValue, showArea]);


  const handleXValueChangeByClick = (newX: number) => {
    const clampedX = Math.max(effectiveDomain.xMin, Math.min(effectiveDomain.xMax, newX));
    setXValue(clampedX);
  };

  const handleDomainChangeFromInteraction = React.useCallback((newDomainConfig: Partial<DomainOptions>) => {
    setDomainOptions(prev => {
      const updated = { ...prev, ...newDomainConfig };
      
      const numXMin = parseFloat(updated.xMin);
      const numXMax = parseFloat(updated.xMax);
      if (!isNaN(numXMin) && !isNaN(numXMax) && numXMin >= numXMax) {
          // console.warn("Attempted to set invalid x-domain from interaction:", updated);
          return prev; 
      }

      const yMinVal = updated.yMin.toString().toLowerCase() === 'auto' ? 'auto' : parseFloat(updated.yMin.toString());
      const yMaxVal = updated.yMax.toString().toLowerCase() === 'auto' ? 'auto' : parseFloat(updated.yMax.toString());

      if (typeof yMinVal === 'number' && typeof yMaxVal === 'number' && yMinVal >= yMaxVal) {
          // console.warn("Attempted to set invalid y-domain from interaction:", updated);
          return prev;
      }
      return updated;
    });
  }, [setDomainOptions]);
  
  const resetDomainOptions = () => {
    setDomainOptions(INITIAL_DOMAIN_OPTIONS);
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
          onResetDomainOptions={resetDomainOptions}
        />

        {errorMessage && (
          <Alert variant={errorMessage.includes("Invalid function syntax") ? "destructive" : "warning"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{errorMessage.includes("Invalid function syntax") ? "Function Error" : "Plotting Issue"}</AlertTitle>
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
          onDomainChange={handleDomainChangeFromInteraction}
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
