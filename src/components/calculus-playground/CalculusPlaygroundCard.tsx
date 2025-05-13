
'use client';

import * as React from 'react';
import * as math from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import FunctionInput, { type DomainOptions } from './FunctionInput';
import type { FunctionInputType as StateFunctionInputType } from './FunctionInput'; // Keep original type for state
import PlotDisplay from './PlotDisplay';
import SliderControl from './SliderControl';
import ResultPanel from './ResultPanel';
import TogglePanel from './TogglePanel';
import { AlertTriangle } from 'lucide-react'; // For potential future use if Shadcn Alert is re-added
import { Alert as UIAlert, AlertDescription, AlertTitle as UIAlertTitle } from '@/components/ui/alert'; // Shadcn Alert
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
    return NaN;
  }
}

const INITIAL_DOMAIN_OPTIONS: DomainOptions = {
  xMin: '-10', xMax: '10', yMin: 'auto', yMax: 'auto',
};

const PREDEFINED_COLORS = [
  'hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-4))', 
  'hsl(var(--destructive))', 'hsl(var(--chart-5))', 'hsl(var(--chart-1))', 
  'hsl(var(--chart-3))', 
];

let colorIndexInternal = 0; // Renamed to avoid conflict if imported
const getNextColor = (): string => {
  const color = PREDEFINED_COLORS[colorIndexInternal % PREDEFINED_COLORS.length];
  colorIndexInternal = (colorIndexInternal + 1);
  return color;
};

// StateFunctionInputType might still have `error` and `integralValue` if used for other purposes
// For this refactor, we assume parsing errors are handled via compilationModule
// and integral values via integralValuesMap for display.
// If these fields are needed in `functions` state for other logic, that needs to be specified.
// For now, let's treat the `functions` state as primarily holding structural info (id, expression, color, bounds).
export interface CurrentFunctionInputType {
  id: string;
  expression: string;
  color: string;
  integralBounds: { a: string; b: string };
}


export default function CalculusPlaygroundCard() {
  const { toast } = useToast();
  const [functions, setFunctions] = React.useState<CurrentFunctionInputType[]>([
    { 
      id: `calculus-fn-${React.useId()}`, 
      expression: 'x^2', 
      color: getNextColor(), 
      integralBounds: { a: '0', b: '2' },
    }
  ]);
  const [xValue, setXValue] = React.useState<number>(1);
  const [domainOptions, setDomainOptions] = React.useState<DomainOptions>(INITIAL_DOMAIN_OPTIONS);
  const [globalErrorMessage, setGlobalErrorMessage] = React.useState<string | null>(null);

  const compilationModule = React.useMemo(() => {
    let hasAnySyntaxError = false;
    let firstSyntaxErrorMsg: string | null = null;

    const compiledList = functions.map(func => {
      try {
        if (!func.expression.trim()) {
          return { id: func.id, compiled: null, error: null };
        }
        let processedFuncStr = func.expression.replace(/\barctan\b/g, 'atan');
        const node = math.parse(processedFuncStr);
        return { id: func.id, compiled: node.compile(), error: null };
      } catch (e) {
        hasAnySyntaxError = true;
        const errorMsg = e instanceof Error ? `Syntax Error: ${e.message}` : 'Invalid function input.';
        const shortErrorMsg = errorMsg.substring(0, 100) + (errorMsg.length > 100 ? '...' : '');
        if (!firstSyntaxErrorMsg) {
            firstSyntaxErrorMsg = shortErrorMsg;
        }
        return { id: func.id, compiled: null, error: shortErrorMsg };
      }
    });
    return { compiledList, firstSyntaxErrorMsg, hasAnySyntaxError };
  }, [functions]);

  React.useEffect(() => {
    const { firstSyntaxErrorMsg, hasAnySyntaxError } = compilationModule;
    
    setGlobalErrorMessage(prevGlobalError => {
      let newGlobalError = prevGlobalError || "";
      const syntaxErrorPartPattern = /Syntax Error:.*?(\. Additionally,|$)/i;
      const noPlotPartPattern = /One or more functions resulted in no plottable points.*?(\.|$)/i;

      if (hasAnySyntaxError && firstSyntaxErrorMsg) {
        // If there's a syntax error, it should be the primary message.
        // If a "no plottable points" message also exists, append it.
        let currentNoPlotMsg = "";
        if (noPlotPartPattern.test(newGlobalError)) {
            const match = newGlobalError.match(noPlotPartPattern);
            if(match) currentNoPlotMsg = match[0].trim();
        }
        newGlobalError = firstSyntaxErrorMsg;
        if (currentNoPlotMsg) {
            newGlobalError += ` Additionally, ${currentNoPlotMsg.toLowerCase()}`;
        }
      } else {
        // No new syntax error, remove any existing syntax error part from the global message
        newGlobalError = newGlobalError.replace(syntaxErrorPartPattern, '').trim();
        if (newGlobalError.startsWith("Additionally,")) {
             newGlobalError = newGlobalError.substring("Additionally,".length).trim();
        }
      }
      
      newGlobalError = newGlobalError.replace(/\.\s*Additionally,\s*$/, ".").trim();
      newGlobalError = newGlobalError.replace(/Additionally,\s*$/, "").trim();
      
      return newGlobalError === prevGlobalError ? prevGlobalError : (newGlobalError === "" ? null : newGlobalError);
    });

  }, [compilationModule]);

  const evaluateFunctionAt = React.useCallback((funcIndex: number, x: number): number => {
    if (funcIndex < 0 || funcIndex >= compilationModule.compiledList.length) return NaN;
    const compiledEntry = compilationModule.compiledList[funcIndex];
    if (!compiledEntry || !compiledEntry.compiled) return NaN;
    try {
      const result = compiledEntry.compiled.evaluate({ x, e: Math.E, pi: Math.PI });
      if (typeof result === 'object' && result.isComplex) return NaN;
      return (typeof result === 'number' && isFinite(result)) ? result : NaN;
    } catch (error) {
      return NaN;
    }
  }, [compilationModule.compiledList]);

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
  
  const plotDataArray = React.useMemo(() => {
    return functions.map((func, index) => {
      if (parsedDomain.xMin >= parsedDomain.xMax) return { id: func.id, points: [], color: func.color, expression: func.expression };
      const points: { x: number; y: number | null }[] = [];
      const step = (parsedDomain.xMax - parsedDomain.xMin) / PLOT_POINTS;
      for (let i = 0; i <= PLOT_POINTS; i++) {
        const xPlot = parsedDomain.xMin + i * step;
        const yVal = evaluateFunctionAt(index, xPlot);
        points.push({ x: xPlot, y: isNaN(yVal) ? null : yVal });
      }
      return { id: func.id, points, color: func.color, expression: func.expression };
    });
  }, [functions, evaluateFunctionAt, parsedDomain.xMin, parsedDomain.xMax]);

  React.useEffect(() => {
    const { hasAnySyntaxError } = compilationModule;
    const hasPlottablePoints = plotDataArray.some(
      (plot) => plot.points.length > 0 && plot.points.some((p) => p.y !== null && isFinite(p.y as number))
    );
    const noPlottableMessage = "One or more functions resulted in no plottable points in the current x-domain. Try adjusting the x-axis scale or check for mathematical issues (e.g., log of zero, division by zero).";

    setGlobalErrorMessage(prevGlobalError => {
        let currentError = prevGlobalError || "";
        const syntaxErrorPartPattern = /Syntax Error:.*?(\. Additionally,|$)/i;
        const noPlotPartPattern = /One or more functions resulted in no plottable points.*?(\.|$)/i;
        
        const hasExistingNoPlotMsg = noPlotPartPattern.test(currentError);
        const hasExistingSyntaxError = syntaxErrorPartPattern.test(currentError);

        if (!hasPlottablePoints && !hasAnySyntaxError) { // Show "no plottable" only if there's NO syntax error
            if (!hasExistingNoPlotMsg) {
                currentError = hasExistingSyntaxError 
                    ? `${currentError.trim().replace(/\.$/, "")}. Additionally, ${noPlottableMessage.toLowerCase()}` 
                    : noPlottableMessage;
            }
        } else if (hasPlottablePoints && hasExistingNoPlotMsg) { // If points become plottable, remove the "no plottable" message
            currentError = currentError.replace(noPlotPartPattern, "").trim();
            // Clean up "Additionally, " if it's now redundant
             if (currentError.endsWith("Additionally,")) {
                currentError = currentError.substring(0, currentError.length - "Additionally,".length).trim();
            }
             if (currentError.endsWith("Additionally")) { 
                currentError = currentError.substring(0, currentError.length - "Additionally".length).trim();
            }
        }
        
        currentError = currentError.replace(/\.\s*Additionally,\s*$/, ".").trim();
        currentError = currentError.replace(/Additionally,\s*$/, "").trim();

        return currentError === prevGlobalError ? prevGlobalError : (currentError === "" ? null : currentError);
    });
  }, [plotDataArray, compilationModule.hasAnySyntaxError]);

  const integralValuesMap = React.useMemo(() => {
    const map = new Map<string, number | undefined>();
    functions.forEach((func, index) => {
      const lowerBound = parseFloat(func.integralBounds.a);
      const upperBound = parseFloat(func.integralBounds.b);
      const compiledEntry = compilationModule.compiledList.find(cf => cf.id === func.id);

      if (compiledEntry?.compiled && !isNaN(lowerBound) && !isNaN(upperBound)) {
        const integral = trapezoidalRule((xVal) => evaluateFunctionAt(index, xVal), lowerBound, upperBound);
        map.set(func.id, integral);
      } else {
        map.set(func.id, undefined);
      }
    });
    return map;
  }, [functions, compilationModule.compiledList, evaluateFunctionAt]);


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

  const effectiveDomain = React.useMemo(() => {
    let yMinResolved: number | 'auto' = parsedDomain.yMin;
    let yMaxResolved: number | 'auto' = parsedDomain.yMax;

    if (yMinResolved === 'auto' || yMaxResolved === 'auto') {
      const allYValues = plotDataArray.flatMap(plot => plot.points.map(p => p.y).filter(y => y !== null && isFinite(y as number)) as number[]);
      if (firstFunctionFx !== null && isFinite(firstFunctionFx)) allYValues.push(firstFunctionFx);

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
             yMinResolved = dataMinY - (Math.abs(dataMinY * 0.1) || 1);
             yMaxResolved = dataMaxY + (Math.abs(dataMaxY * 0.1) || 1);
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
  }, [parsedDomain, plotDataArray, firstFunctionFx]);

  const firstFunctionDerivativePlotData = React.useMemo(() => {
    if (functions.length === 0 || !compilationModule.compiledList[0]?.compiled || !showFullDerivativeCurve || effectiveDomain.xMin >= effectiveDomain.xMax) return [];
    const points: { x: number; y: number | null }[] = [];
    const step = (effectiveDomain.xMax - effectiveDomain.xMin) / PLOT_POINTS;
    for (let i = 0; i <= PLOT_POINTS; i++) {
      const x = effectiveDomain.xMin + i * step;
      const yPrime = numericalDerivative((valX) => evaluateFunctionAt(0, valX), x);
      points.push({ x, y: isNaN(yPrime) ? null : yPrime });
    }
    return points;
  }, [evaluateFunctionAt, compilationModule.compiledList, showFullDerivativeCurve, effectiveDomain.xMin, effectiveDomain.xMax, functions.length]);

  const areaDataArrayPlots = React.useMemo(() => {
    return plotDataArray.map((plot, index) => {
      if (!plot.points || plot.points.length === 0 || !showArea) {
        return { id: plot.id, points: [], color: plot.color };
      }
      const func = functions[index];
      const a = parseFloat(func.integralBounds.a); 
      const b = parseFloat(func.integralBounds.b);

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
  }, [toast]); 
  
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
        id: `calculus-fn-${React.useId()}`, 
        expression: '', 
        color: getNextColor(), 
        integralBounds: { a: '0', b: '1' },
      }
    ]);
  };

  const handleUpdateFunction = (id: string, updates: Partial<Omit<CurrentFunctionInputType, 'id'>>) => {
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
      if (Math.abs(xValue - newValue) > 1e-9) { 
          setXValue(newValue);
      }
  }, [xValue]);


  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>Interactive Calculus Tool</CardTitle>
        <CardDescription>Enter functions of 'x', set graph scale, define integral bounds, and explore properties.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FunctionInput
          functions={functions}
          compilationResultsList={compilationModule.compiledList}
          onAddFunction={handleAddFunction}
          onUpdateFunction={handleUpdateFunction}
          onDeleteFunction={handleDeleteFunction}
          domainOptions={domainOptions}
          onDomainOptionsChange={setDomainOptions} 
          onResetDomainOptions={resetDomainOptions}
        />

        {globalErrorMessage && (
          <UIAlert variant={globalErrorMessage.includes("Syntax Error") ? "destructive" : "warning"}>
            <AlertTriangle className="h-4 w-4" />
            <UIAlertTitle>{globalErrorMessage.includes("Syntax Error") ? "Input Error" : "Plotting Issue"}</UIAlertTitle>
            <AlertDescription>{globalErrorMessage}</AlertDescription>
          </UIAlert>
        )}

        <PlotDisplay
          plotDataArray={plotDataArray}
          areaDataArray={areaDataArrayPlots}
          firstFunctionPlotData={plotDataArray[0]?.points || []} // Only for first function's tangent/dot
          firstFunctionDerivativePlotData={firstFunctionDerivativePlotData} // Only for first function's derivative curve
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
          integralValuesMap={integralValuesMap}
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
