'use client';

import * as React from 'react';
import * as math from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import FunctionInput, { type DomainOptions, type FunctionInputType } from './FunctionInput';
import PlotDisplay from './PlotDisplay';
import SliderControl from './SliderControl';
import ResultPanel from './ResultPanel';
import TogglePanel from './TogglePanel';
import { AlertCircle } from 'lucide-react';
import { Alert as UIAlert, AlertDescription, AlertTitle as UIAlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PLOT_POINTS = 200;

function numericalDerivative(fn: (x: number) => number, x: number, h: number = 0.0001): number {
  if (h === 0) return NaN;
  try {
    if (!isFinite(x)) return NaN;
    const f_x_plus_h = fn(x + h);
    const f_x_minus_h = fn(x - h);
    if (isNaN(f_x_plus_h) || isNaN(f_x_minus_h) || !isFinite(f_x_plus_h) || !isFinite(f_x_minus_h)) return NaN;
    return (f_x_plus_h - f_x_minus_h) / (2 * h);
  } catch (error) {
    // console.error(`Numerical derivative error for x=${x}, h=${h}:`, error);
    return NaN;
  }
}

function trapezoidalRule(fn: (x: number) => number, a: number, b: number, n: number = 100): number {
  if (n <= 0 || isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) return NaN;
  if (a === b) return 0;
  
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const h = (upper - lower) / n;
  let sum = 0;

  try {
    const fa = fn(lower);
    const fb = fn(upper);

    if (isNaN(fa) || !isFinite(fa) || isNaN(fb) || !isFinite(fb)) {
       return NaN;
    }

    sum += fa / 2.0;
    sum += fb / 2.0;
    for (let i = 1; i < n; i++) {
      const x_i = lower + i * h;
      const f_x_i = fn(x_i);
      if (isNaN(f_x_i) || !isFinite(f_x_i)) {
         continue; 
      }
      sum += f_x_i;
    }
    const integralValue = sum * h;
    return a > b ? -integralValue : integralValue; 
  } catch (error) {
    // console.error(`Trapezoidal rule error for a=${a}, b=${b}, n=${n}:`, error);
    return NaN;
  }
}

const INITIAL_DOMAIN_OPTIONS: DomainOptions = {
  xMin: '-10', xMax: '10', yMin: 'auto', yMax: 'auto',
};

const PREDEFINED_COLORS = [
  'hsl(var(--primary))', 
  'hsl(var(--chart-2))', 
  'hsl(var(--chart-4))', 
  'hsl(var(--destructive))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-1))', 
  'hsl(var(--chart-3))', 
];

let colorIndex = 0;
const getNextColor = (): string => {
  const color = PREDEFINED_COLORS[colorIndex % PREDEFINED_COLORS.length];
  colorIndex = (colorIndex + 1);
  return color;
};

const INITIAL_FUNCTION_ID = "calculus-playground-initial-fn-0"; // Static ID

export default function CalculusPlaygroundCard() {
  const { toast } = useToast();
  const [functions, setFunctions] = React.useState<FunctionInputType[]>([
    { 
      id: INITIAL_FUNCTION_ID, 
      expression: 'x^2', 
      color: getNextColor(), 
      integralBounds: { a: '0', b: '2' },
      integralValue: undefined,
      error: null,
    }
  ]);
  const [xValue, setXValue] = React.useState<number>(1);
  const [domainOptions, setDomainOptions] = React.useState<DomainOptions>(INITIAL_DOMAIN_OPTIONS);
  const [globalErrorMessage, setGlobalErrorMessage] = React.useState<string | null>(null);


  const compiledFunctions = React.useMemo(() => {
    let hasAnyCompilationError = false;
    const results = functions.map(func => {
      try {
        if (!func.expression.trim()) {
          return { id: func.id, compiled: null, error: null };
        }
        let processedFuncStr = func.expression.replace(/\barctan\b/g, 'atan');
        const node = math.parse(processedFuncStr);
        return { id: func.id, compiled: node.compile(), error: null };
      } catch (e) {
        hasAnyCompilationError = true;
        const errorMsg = e instanceof Error ? `Syntax Error: ${e.message}` : 'Invalid function input.';
        return { id: func.id, compiled: null, error: errorMsg.substring(0, 100) + (errorMsg.length > 100 ? '...' : '') };
      }
    });
    if (hasAnyCompilationError && (!globalErrorMessage || !globalErrorMessage.includes("Syntax Error"))) {
        setGlobalErrorMessage(prev => {
            const syntaxErrorPart = results.find(r => r.error)?.error || "Syntax Error in one or more functions.";
            if (prev && prev.includes("no plottable points")) return `${syntaxErrorPart} Additionally, ${prev.substring(prev.indexOf("no plottable points"))}`;
            return syntaxErrorPart;
        });
    } else if (!hasAnyCompilationError && globalErrorMessage && globalErrorMessage.includes("Syntax Error")) {
        setGlobalErrorMessage(prev => prev ? prev.replace(/Syntax Error:.*?(\. Additionally,|$)/, '').trim() : null);
    }
    return results;
  }, [functions, globalErrorMessage]); 

  React.useEffect(() => {
    setFunctions(prevFuncs => 
      prevFuncs.map(func => {
        const compilationResult = compiledFunctions.find(cf => cf.id === func.id);
        return { ...func, error: compilationResult?.error || null };
      })
    );
  }, [compiledFunctions]);


  const evaluateFunctionAt = React.useCallback((funcIndex: number, x: number): number => {
    if (funcIndex < 0 || funcIndex >= compiledFunctions.length) return NaN;
    const compiledEntry = compiledFunctions[funcIndex];
    if (!compiledEntry || !compiledEntry.compiled) return NaN;
    try {
      const result = compiledEntry.compiled.evaluate({ x, e: Math.E });
      if (typeof result === 'object' && result.isComplex) return NaN; 
      return (typeof result === 'number' && isFinite(result)) ? result : NaN;
    } catch (error) {
      // console.error(`Error evaluating function '${functions[funcIndex]?.expression}' at x=${x}:`, error);
      return NaN;
    }
  }, [compiledFunctions]);

  React.useEffect(() => {
    setFunctions(prevFuncs =>
      prevFuncs.map((func, index) => {
        const lowerBound = parseFloat(func.integralBounds.a);
        const upperBound = parseFloat(func.integralBounds.b);
        const compiled = compiledFunctions[index]?.compiled;
        
        if (compiled && !isNaN(lowerBound) && !isNaN(upperBound)) {
          const integral = trapezoidalRule((xVal) => evaluateFunctionAt(index, xVal), lowerBound, upperBound);
          return { ...func, integralValue: integral };
        }
        return { ...func, integralValue: undefined }; 
      })
    );
  }, [functions, compiledFunctions, evaluateFunctionAt]);


  const parsedDomain = React.useMemo(() => {
    let xMin = parseFloat(domainOptions.xMin);
    let xMax = parseFloat(domainOptions.xMax);
    if (isNaN(xMin) || isNaN(xMax) || xMin >= xMax) { xMin = -10; xMax = 10; }

    let yMinProcessed: number | 'auto' = domainOptions.yMin.toLowerCase() === 'auto' ? 'auto' : parseFloat(domainOptions.yMin);
    let yMaxProcessed: number | 'auto' = domainOptions.yMax.toLowerCase() === 'auto' ? 'auto' : parseFloat(domainOptions.yMax);

    if (typeof yMinProcessed === 'number' && isNaN(yMinProcessed)) yMinProcessed = 'auto';
    if (typeof yMaxProcessed === 'number' && isNaN(yMaxProcessed)) yMaxProcessed = 'auto';
    if (typeof yMinProcessed === 'number' && typeof yMaxProcessed === 'number' && yMinProcessed >= yMaxProcessed) {
      yMinProcessed = 'auto'; yMaxProcessed = 'auto';
    }
    return { xMin, xMax, yMin: yMinProcessed, yMax: yMaxProcessed };
  }, [domainOptions]);

  // Effect to clamp xValue if domainOptions change (source of truth for manual X range)
  React.useEffect(() => {
    const currentXMin = parseFloat(domainOptions.xMin);
    const currentXMax = parseFloat(domainOptions.xMax);
    let needsUpdate = false;
    let newClampedXValue = xValue;

    if (!isNaN(currentXMin) && xValue < currentXMin) {
        newClampedXValue = currentXMin;
        needsUpdate = true;
    } else if (!isNaN(currentXMax) && xValue > currentXMax) {
        newClampedXValue = currentXMax;
        needsUpdate = true;
    }
    if (needsUpdate && Math.abs(xValue - newClampedXValue) > 1e-9) { 
        setXValue(newClampedXValue);
    }
  }, [domainOptions.xMin, domainOptions.xMax, xValue]);


  const [showFullDerivativeCurve, setShowFullDerivativeCurve] = React.useState<boolean>(false);
  const [showTangent, setShowTangent] = React.useState<boolean>(true);
  const [showArea, setShowArea] = React.useState<boolean>(true);

  const firstFunctionFx = React.useMemo(() => functions.length > 0 ? evaluateFunctionAt(0, xValue) : NaN, [evaluateFunctionAt, xValue, functions]);
  const firstFunctionFpx = React.useMemo(() => functions.length > 0 ? numericalDerivative((x) => evaluateFunctionAt(0, x), xValue) : NaN, [evaluateFunctionAt, xValue, functions]);

  const plotDataArray = React.useMemo(() => {
    return functions.map((func, index) => {
      if (parsedDomain.xMin >= parsedDomain.xMax) return { id: func.id, points: [], color: func.color, expression: func.expression };
      const points: { x: number; y: number | null }[] = [];
      const step = (parsedDomain.xMax - parsedDomain.xMin) / PLOT_POINTS;
      for (let i = 0; i <= PLOT_POINTS; i++) {
        const x = parsedDomain.xMin + i * step;
        const yVal = evaluateFunctionAt(index, x);
        points.push({ x, y: isNaN(yVal) ? null : yVal });
      }
      return { id: func.id, points, color: func.color, expression: func.expression };
    });
  }, [functions, evaluateFunctionAt, parsedDomain.xMin, parsedDomain.xMax]);
  
  React.useEffect(() => {
    const hasPlottablePoints = plotDataArray.some(
      (plot) => plot.points.length > 0 && plot.points.some((p) => p.y !== null && isFinite(p.y as number))
    );
    const noPlottableMessage = "One or more functions resulted in no plottable points in the current x-domain. Try adjusting the x-axis scale or check for mathematical issues (e.g., log of zero, division by zero).";

    if (!hasPlottablePoints && functions.some(f => compiledFunctions.find(cf => cf.id === f.id)?.compiled && !f.error && f.expression.trim() !== '')) {
      setGlobalErrorMessage(prevError => {
        if (prevError && prevError.includes("Syntax Error")) { 
            return prevError.includes(noPlottableMessage) ? prevError : `${prevError} Additionally, ${noPlottableMessage.toLowerCase()}`;
        }
        return noPlottableMessage;
      });
    } else if (hasPlottablePoints && globalErrorMessage && globalErrorMessage.includes(noPlottableMessage)) {
      setGlobalErrorMessage(prevError => {
          if (prevError) {
            let newError = prevError.replace(noPlottableMessage, "").replace("Additionally, ", "").trim();
            return newError.length > 0 ? newError : null;
          }
          return null;
      });
    }
  }, [plotDataArray, functions, compiledFunctions, globalErrorMessage]);


  const effectiveDomain = React.useMemo(() => {
    let yMinResolved: number | 'auto' = parsedDomain.yMin;
    let yMaxResolved: number | 'auto' = parsedDomain.yMax;

    if (yMinResolved === 'auto' || yMaxResolved === 'auto') {
      const allYValues = plotDataArray.flatMap(plot => plot.points.map(p => p.y).filter(y => y !== null && isFinite(y as number)) as number[]);
      
      if (allYValues.length > 0) {
        const dataMinY = Math.min(...allYValues);
        const dataMaxY = Math.max(...allYValues);
        const range = dataMaxY - dataMinY;
        const padding = range === 0 ? 1 : range * 0.15;

        if (yMinResolved === 'auto') yMinResolved = dataMinY - padding;
        if (yMaxResolved === 'auto') yMaxResolved = dataMaxY + padding;
        
        if (yMinResolved > dataMinY) yMinResolved = dataMinY - padding * 0.5;
        if (yMaxResolved < dataMaxY) yMaxResolved = dataMaxY + padding * 0.5;

        if (yMinResolved === 0 && yMaxResolved === 0 && dataMinY === 0 && dataMaxY === 0) {
            yMinResolved = -1; yMaxResolved = 1;
        } else if (yMinResolved >= yMaxResolved) {
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
    const finalYMin = typeof yMinResolved === 'string' ? -10 : yMinResolved;
    const finalYMax = typeof yMaxResolved === 'string' ? 10 : yMaxResolved;

    return { xMin: parsedDomain.xMin, xMax: parsedDomain.xMax, yMin: finalYMin, yMax: finalYMax };
  }, [parsedDomain, plotDataArray]);

  const firstFunctionDerivativePlotData = React.useMemo(() => {
    if (functions.length === 0 || !compiledFunctions[0]?.compiled || !showFullDerivativeCurve || effectiveDomain.xMin >= effectiveDomain.xMax) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (effectiveDomain.xMax - effectiveDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = effectiveDomain.xMin + i * step;
      const yPrime = numericalDerivative((valX) => evaluateFunctionAt(0, valX), x);
      points.push({ x, y: isNaN(yPrime) ? null : yPrime });
    }
    return points;
  }, [evaluateFunctionAt, compiledFunctions, showFullDerivativeCurve, effectiveDomain.xMin, effectiveDomain.xMax, functions.length]);

  const areaDataArray = React.useMemo(() => {
    return plotDataArray.map((plot, index) => {
      if (!plot.points || plot.points.length === 0 || !showArea) {
        return { id: plot.id, points: [], color: plot.color };
      }
      const func = functions[index];
      // Use xValue for dynamic area shading for the *first* function
      // For other functions, use their fixed integralBounds
      const a = index === 0 ? 0 : parseFloat(func.integralBounds.a);
      const b = index === 0 ? xValue : parseFloat(func.integralBounds.b);

      if (isNaN(a) || isNaN(b)) {
         return { id: plot.id, points: [], color: plot.color };
      }

      const lowerBound = Math.min(a,b);
      const upperBound = Math.max(a,b);
      
      const areaPoints = plot.points.map((p) => ({
        x: p.x,
        y: (p.y !== null && isFinite(p.y) && p.x >= lowerBound && p.x <= upperBound) ? p.y : 0,
      }));
      return { id: plot.id, points: areaPoints, color: func.color };
    });
  }, [plotDataArray, functions, showArea, xValue]);


  const handleXValueChangeByClick = (newX: number) => {
    const clampedNewX = Math.max(effectiveDomain.xMin, Math.min(effectiveDomain.xMax, newX));
    if (Math.abs(xValue - clampedNewX) > 1e-9) { 
        setXValue(clampedNewX);
    }
  };
  
  const handleDomainChangeFromInteraction = React.useCallback((newDomainConfig: Partial<DomainOptions>) => {
    setDomainOptions(prev => {
      const updated = { ...prev, ...newDomainConfig };
      const numXMin = parseFloat(updated.xMin);
      const numXMax = parseFloat(updated.xMax);
      if (!isNaN(numXMin) && !isNaN(numXMax) && numXMin >= numXMax) {
        toast({ title: "Invalid X Range", description: "X Min must be less than X Max.", variant: "destructive" });
        return prev;
      }

      const yMinVal = updated.yMin.toLowerCase() === 'auto' ? 'auto' : parseFloat(updated.yMin);
      const yMaxVal = updated.yMax.toLowerCase() === 'auto' ? 'auto' : parseFloat(updated.yMax);
      if (typeof yMinVal === 'number' && typeof yMaxVal === 'number' && yMinVal >= yMaxVal) {
        toast({ title: "Invalid Y Range", description: "Y Min must be less than Y Max if both are numbers.", variant: "destructive" });
        return prev;
      }
      
      return updated;
    });
  }, [setDomainOptions, toast]);
  
  const resetDomainOptions = () => {
      setDomainOptions(INITIAL_DOMAIN_OPTIONS);
      setXValue(1); 
  };

  const handleAddFunction = () => {
    if (functions.length >= 5) {
        toast({title: "Function Limit", description: "Maximum of 5 functions allowed.", variant: "destructive"});
        return;
    }
    setFunctions(prev => [
      ...prev,
      { 
        id: `calculus-playground-fn-${Date.now()}-${Math.random()}`, 
        expression: '', 
        color: getNextColor(), 
        integralBounds: { a: '0', b: '1' },
        integralValue: undefined,
        error: null,
      }
    ]);
  };

  const handleUpdateFunction = (id: string, updates: Partial<Omit<FunctionInputType, 'id'>>) => {
    setFunctions(prev => 
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteFunction = (id: string) => {
    if (functions.length === 1) {
        toast({title: "Cannot Delete", description: "At least one function must remain.", variant: "default"});
        return;
    }
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const handleSliderChange = React.useCallback((newValue: number) => {
      if (Math.abs(xValue - newValue) > 1e-9) { // Tolerance to prevent rapid updates
          setXValue(newValue);
      }
  }, [xValue]); // Removed setXValue from dependency array as it's stable


  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>Interactive Calculus Tool</CardTitle>
        <CardDescription>Enter functions of 'x', set graph scale, define integral bounds, and explore properties.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FunctionInput
          functions={functions}
          onAddFunction={handleAddFunction}
          onUpdateFunction={handleUpdateFunction}
          onDeleteFunction={handleDeleteFunction}
          domainOptions={domainOptions}
          onDomainOptionsChange={setDomainOptions} 
          onResetDomainOptions={resetDomainOptions}
        />

        {globalErrorMessage && (
          <UIAlert variant={globalErrorMessage.includes("Syntax Error") ? "destructive" : "warning"}>
            <AlertCircle className="h-4 w-4" />
            <UIAlertTitle>{globalErrorMessage.includes("Syntax Error") ? "Global Error" : "Plotting Issue"}</UIAlertTitle>
            <AlertDescription>{globalErrorMessage}</AlertDescription>
          </UIAlert>
        )}

        <PlotDisplay
          plotDataArray={plotDataArray}
          areaDataArray={areaDataArray}
          firstFunctionPlotData={plotDataArray[0]?.points || []}
          firstFunctionDerivativePlotData={firstFunctionDerivativePlotData}
          xValue={xValue}
          fxValue={firstFunctionFx}
          fpxValue={firstFunctionFpx}
          showTangent={showTangent}
          showArea={showArea}
          showFullDerivativeCurve={showFullDerivativeCurve}
          domain={effectiveDomain}
          onXValueChangeByClick={handleXValueChangeByClick}
          onDomainChange={handleDomainChangeFromInteraction} 
        />

        <SliderControl
          value={xValue}
          onValueChange={handleSliderChange}
          min={effectiveDomain.xMin}
          max={effectiveDomain.xMax}
          step={(effectiveDomain.xMax - effectiveDomain.xMin) / PLOT_POINTS || 0.01}
        />

        <ResultPanel
          functions={functions}
          xValue={xValue}
          firstFunctionFxValue={firstFunctionFx}
          firstFunctionFpxValue={firstFunctionFpx}
        />

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
