
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
      if (isNaN(f_x_i) || !isFinite(f_x_i)) return NaN; // Check if point is evaluable
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
  const parsedDomain = React.useMemo(() => {
    const xMin = parseFloat(domainOptions.xMin);
    const xMax = parseFloat(domainOptions.xMax);
    const yMinRaw = domainOptions.yMin.toLowerCase();
    const yMaxRaw = domainOptions.yMax.toLowerCase();

    let yMinProcessed: number | 'auto';
    let yMaxProcessed: number | 'auto';

    if (yMinRaw === 'auto') {
      yMinProcessed = 'auto';
    } else {
      const parsed = parseFloat(yMinRaw);
      yMinProcessed = isNaN(parsed) ? 'auto' : parsed;
    }

    if (yMaxRaw === 'auto') {
      yMaxProcessed = 'auto';
    } else {
      const parsed = parseFloat(yMaxRaw);
      yMaxProcessed = isNaN(parsed) ? 'auto' : parsed;
    }
    
    let finalXMin = isNaN(xMin) ? -10 : xMin;
    let finalXMax = isNaN(xMax) ? 10 : xMax;

    if (finalXMin >= finalXMax) {
        finalXMin = -10;
        finalXMax = 10;
    }
    
    if (typeof yMinProcessed === 'number' && typeof yMaxProcessed === 'number' && yMinProcessed >= yMaxProcessed) {
        yMinProcessed = 'auto'; 
        yMaxProcessed = 'auto';
    }

    return {
      xMin: finalXMin,
      xMax: finalXMax,
      yMin: yMinProcessed,
      yMax: yMaxProcessed,
    };
  }, [domainOptions]);
  
  React.useEffect(() => {
    // Clamp xValue to be within the new xDomain from parsedDomain
    // This ensures the slider and calculations respect the updated graph boundaries
    if (xValue < parsedDomain.xMin) {
      setXValue(parsedDomain.xMin);
    } else if (xValue > parsedDomain.xMax) {
      setXValue(parsedDomain.xMax);
    }
  }, [parsedDomain.xMin, parsedDomain.xMax, xValue]); // Only re-run if domain or xValue changes


  const [showFullDerivativeCurve, setShowFullDerivativeCurve] = React.useState<boolean>(false);
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
    if (!compiledFunc || parsedDomain.xMin >= parsedDomain.xMax) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (parsedDomain.xMax - parsedDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = parsedDomain.xMin + i * step;
      const y = evaluateAt(x);
      points.push({ x, y: isNaN(y) || !isFinite(y) ? null : y });
    }
    return points;
  }, [evaluateAt, compiledFunc, parsedDomain.xMin, parsedDomain.xMax]);
  
  const effectiveDomain = React.useMemo(() => {
    let yMinResolved: number | 'auto' = parsedDomain.yMin;
    let yMaxResolved: number | 'auto' = parsedDomain.yMax;

    if (parsedDomain.yMin === 'auto' || parsedDomain.yMax === 'auto') {
      if (plotData.length > 0) {
        const yValues = plotData.map(p => p.y).filter(y => y !== null && isFinite(y)) as number[];
        
        if (yValues.length > 0) {
            const dataMinY = Math.min(...yValues);
            const dataMaxY = Math.max(...yValues);
            const range = dataMaxY - dataMinY;
            const padding = range === 0 ? 1 : range * 0.1; 

            if (parsedDomain.yMin === 'auto') {
                yMinResolved = Math.min(0, dataMinY - padding); 
            }
            if (parsedDomain.yMax === 'auto') {
                yMaxResolved = Math.max(0, dataMaxY + padding); 
            }
            
            if (yMinResolved === 0 && yMaxResolved === 0 && dataMinY === 0 && dataMaxY === 0) {
                 yMinResolved = -1;
                 yMaxResolved = 1;
            } else if (typeof yMinResolved === 'number' && typeof yMaxResolved === 'number' && yMinResolved >= yMaxResolved) {
                 yMinResolved = Math.min(yMinResolved, yMaxResolved - 0.5); 
                 yMaxResolved = Math.max(yMaxResolved, yMinResolved + 0.5);
                 if (yMinResolved === yMaxResolved) { 
                    yMinResolved -= 0.5;
                    yMaxResolved += 0.5;
                 }
            }
        } else { 
            if (parsedDomain.yMin === 'auto') yMinResolved = -10;
            if (parsedDomain.yMax === 'auto') yMaxResolved = 10;
        }
      } else { 
          if (parsedDomain.yMin === 'auto') yMinResolved = -10;
          if (parsedDomain.yMax === 'auto') yMaxResolved = 10;
      }
    }
    if (typeof yMinResolved === 'number' && typeof yMaxResolved === 'number' && yMinResolved >= yMaxResolved) {
        const mid = (yMinResolved + yMaxResolved) / 2 || 0; // ensure mid is a number
        yMinResolved = mid - 5; 
        yMaxResolved = mid + 5;
        if (yMinResolved === yMaxResolved) { 
             yMinResolved -= 0.5; yMaxResolved += 0.5; 
        }
    }

    return {
        xMin: parsedDomain.xMin,
        xMax: parsedDomain.xMax,
        yMin: yMinResolved,
        yMax: yMaxResolved,
    };
  }, [parsedDomain, plotData]);


  const derivativePlotData = React.useMemo(() => {
    if (!compiledFunc || !showFullDerivativeCurve || effectiveDomain.xMin >= effectiveDomain.xMax) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (effectiveDomain.xMax - effectiveDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = effectiveDomain.xMin + i * step;
      const yPrime = numericalDerivative(evaluateAt, x);
      points.push({ x, y: isNaN(yPrime) || !isFinite(yPrime) ? null : yPrime });
    }
    return points;
  }, [evaluateAt, compiledFunc, showFullDerivativeCurve, effectiveDomain.xMin, effectiveDomain.xMax]);

  const areaData = React.useMemo(() => {
    if (!showArea || !compiledFunc || effectiveDomain.xMin >= effectiveDomain.xMax || Math.abs(xValue) < 1e-9) {
      return []; // No area if toggle off, bad function, invalid domain, or xValue is effectively zero
    }

    const pointsForIntegrationSegment: { x: number; y: number }[] = [];

    // 1. Add point at x=0
    const yAtZero = evaluateAt(0);
    if (0 >= effectiveDomain.xMin && 0 <= effectiveDomain.xMax && yAtZero !== null && isFinite(yAtZero)) {
      pointsForIntegrationSegment.push({ x: 0, y: yAtZero });
    }

    // 2. Add points from plotData strictly between 0 and xValue
    plotData.forEach(p => {
      if (p.y !== null && isFinite(p.y)) {
        // Check if p.x is strictly between 0 and xValue, and also within the visible domain
        const strictlyBetween = (xValue > 0 && p.x > 0 && p.x < xValue) || (xValue < 0 && p.x < 0 && p.x > xValue);
        const withinVisibleDomain = p.x >= effectiveDomain.xMin && p.x <= effectiveDomain.xMax;
        if (strictlyBetween && withinVisibleDomain) {
          pointsForIntegrationSegment.push({ x: p.x, y: p.y });
        }
      }
    });

    // 3. Add point at x=xValue
    const yAtXValue = evaluateAt(xValue);
    if (xValue >= effectiveDomain.xMin && xValue <= effectiveDomain.xMax && yAtXValue !== null && isFinite(yAtXValue)) {
      pointsForIntegrationSegment.push({ x: xValue, y: yAtXValue });
    }
    
    // 4. Sort points by x-coordinate
    pointsForIntegrationSegment.sort((a, b) => a.x - b.x);
    
    // 5. Remove duplicate x-points (can happen if 0 or xValue coincide with a plotData point)
    const uniqueXPoints = pointsForIntegrationSegment.filter((point, index, self) =>
      index === self.findIndex((p) => p.x === point.x)
    );

    // Recharts Area component needs at least two distinct points to draw an area.
    if (uniqueXPoints.length < 2) return [];

    return uniqueXPoints;

  }, [showArea, evaluateAt, compiledFunc, xValue, plotData, effectiveDomain.xMin, effectiveDomain.xMax]);


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
          areaData={areaData} // Pass the accurately computed areaData
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
          step={(effectiveDomain.xMax - effectiveDomain.xMin) / 200} 
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

