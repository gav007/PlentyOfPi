
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FunctionDefinition, PlotData, GraphViewSettings, Point } from '@/types/graphify';
import FunctionList from './FunctionList';
import GraphDisplay from './GraphDisplay';
import StarterPanel from './StarterPanel';
import GraphControls from './GraphControls';
import { evaluate, compile, parse } from 'mathjs'; // Using mathjs
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart as LineChartIcon } from 'lucide-react'; // Renamed to avoid conflict

const INITIAL_X_MIN = -10;
const INITIAL_X_MAX = 10;
const INITIAL_Y_MIN = -10;
const INITIAL_Y_MAX = 10;
const PLOT_RESOLUTION = 200; // Number of points to plot for each function

const PREDEFINED_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899', 
  '#8B5CF6', '#EF4444', '#6366F1', '#F97316',
  '#22D3EE', '#A3E635' 
];
let colorIndex = 0;
const getNextColor = () => {
  const color = PREDEFINED_COLORS[colorIndex % PREDEFINED_COLORS.length];
  colorIndex = (colorIndex + 1) % PREDEFINED_COLORS.length;
  return color;
};


export default function GraphifyLayout() {
  const [functions, setFunctions] = useState<FunctionDefinition[]>([
    { id: crypto.randomUUID(), expression: 'x^2', color: getNextColor(), isVisible: true, error: null },
  ]);
  const [plotDataArray, setPlotDataArray] = useState<PlotData[]>([]);
  const [viewSettings, setViewSettings] = useState<GraphViewSettings>({
    xMin: INITIAL_X_MIN,
    xMax: INITIAL_X_MAX,
    yMin: INITIAL_Y_MIN,
    yMax: INITIAL_Y_MAX,
    autoScaleY: true,
  });

  // Memoized function generation
  const generatePlotData = useCallback((funcDef: FunctionDefinition, settings: GraphViewSettings): PlotData => {
    const points: Point[] = [];
    if (!funcDef.expression.trim() || funcDef.error) {
      return { id: funcDef.id, points, color: funcDef.color, expression: funcDef.expression };
    }

    try {
      const compiledExpr = compile(funcDef.expression);
      const step = (settings.xMax - settings.xMin) / PLOT_RESOLUTION;

      for (let i = 0; i <= PLOT_RESOLUTION; i++) {
        const x = settings.xMin + i * step;
        let y: number | null = null;
        try {
          const result = compiledExpr.evaluate({ x });
          if (typeof result === 'number' && isFinite(result)) {
            y = result;
          } else { // Handles Complex numbers, undefined results from mathjs
            y = null;
          }
        } catch (evalError) {
          // Error during evaluation of a specific point (e.g. log of negative)
          y = null; 
        }
        points.push({ x: parseFloat(x.toFixed(4)), y: y !== null ? parseFloat(y.toFixed(4)) : null });
      }
    } catch (compileError) {
      // This error should have been caught during onUpdateFunction, but as a fallback:
      console.error(`Error compiling expression "${funcDef.expression}" for plotting:`, compileError);
       // The error state on funcDef should already be set.
    }
    return { id: funcDef.id, points, color: funcDef.color, expression: funcDef.expression };
  }, []);


  useEffect(() => {
    const newPlotDataArray = functions
      .filter(f => f.isVisible && f.expression.trim() !== '' && !f.error)
      .map(funcDef => generatePlotData(funcDef, viewSettings));
    setPlotDataArray(newPlotDataArray);
  }, [functions, viewSettings, generatePlotData]);
  
  const validateAndCompileExpression = (expression: string): { error: string | null } => {
    if (!expression.trim()) return { error: null }; // Empty is not an error for input purposes
    try {
      parse(expression); // Use parse for syntax check, compile for evaluation
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid syntax" };
    }
  };

  const handleAddFunction = () => {
    setFunctions(prev => [
      ...prev,
      { id: crypto.randomUUID(), expression: '', color: getNextColor(), isVisible: true, error: null },
    ]);
  };

  const handleUpdateFunction = (id: string, updates: Partial<Omit<FunctionDefinition, 'id'>>) => {
    setFunctions(prev =>
      prev.map(f => {
        if (f.id === id) {
          const updatedFunc = { ...f, ...updates };
          if (updates.expression !== undefined) { // Validate only if expression changed
            const validation = validateAndCompileExpression(updates.expression);
            updatedFunc.error = validation.error;
          }
          return updatedFunc;
        }
        return f;
      })
    );
  };

  const handleDeleteFunction = (id: string) => {
    setFunctions(prev => {
      const newFunctions = prev.filter(f => f.id !== id);
      if (newFunctions.length === 0) {
        // Ensure there's always at least one input field, or handle empty state appropriately
        return [{ id: crypto.randomUUID(), expression: '', color: getNextColor(), isVisible: true, error: null }];
      }
      return newFunctions;
    });
  };

  const handleAddSampleToGraph = (expression: string) => {
    const validation = validateAndCompileExpression(expression);
    // Try to use an empty existing function input if available
    const emptyFuncIndex = functions.findIndex(f => f.expression.trim() === '' && !f.error);
    if (emptyFuncIndex !== -1 && !validation.error) {
      handleUpdateFunction(functions[emptyFuncIndex].id, { expression, error: null });
    } else {
       setFunctions(prev => [
        ...prev,
        { id: crypto.randomUUID(), expression, color: getNextColor(), isVisible: true, error: validation.error },
      ]);
    }
  };
  
  const handleViewSettingsChange = (settingsUpdate: Partial<GraphViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...settingsUpdate }));
  };

  const handleResetView = () => {
    setViewSettings({
      xMin: INITIAL_X_MIN,
      xMax: INITIAL_X_MAX,
      yMin: INITIAL_Y_MIN,
      yMax: INITIAL_Y_MAX,
      autoScaleY: true,
    });
  };

  const handleZoom = (factor: number) => {
    setViewSettings(prev => {
      const xRange = prev.xMax - prev.xMin;
      const yRange = prev.yMax - prev.yMin; // Assuming yMin/yMax are numbers for zoom
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;

      const newXMin = xCenter - (xRange / 2) * factor;
      const newXMax = xCenter + (xRange / 2) * factor;
      
      let newYMin = prev.yMin;
      let newYMax = prev.yMax;

      if(!prev.autoScaleY){ // Only zoom Y if not auto-scaling
        newYMin = yCenter - (yRange / 2) * factor;
        newYMax = yCenter + (yRange / 2) * factor;
      }

      return { ...prev, xMin: newXMin, xMax: newXMax, yMin: newYMin, yMax: newYMax };
    });
  };
  
  const handlePan = (dxPercent: number, dyPercent: number) => {
    setViewSettings(prev => {
      const xRangeVal = prev.xMax - prev.xMin;
      const dx = xRangeVal * dxPercent;
      
      const newSettings = {
        ...prev,
        xMin: prev.xMin + dx,
        xMax: prev.xMax + dx,
      };

      if (!prev.autoScaleY) {
        const yRangeVal = prev.yMax - prev.yMin;
        const dy = yRangeVal * dyPercent;
        newSettings.yMin = prev.yMin + dy;
        newSettings.yMax = prev.yMax + dy;
      }
      return newSettings;
    });
  };


  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen flex flex-col">
      <Card className="shadow-xl flex-shrink-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <LineChartIcon className="w-8 h-8" />
            Graphify Calculator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Plot multiple functions, explore graphs, and visualize equations in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Placeholder for Firebase Auth: Login/Signup buttons and user display would go here */}
           {/* Placeholder for Firebase Firestore: Save/Load graph set buttons would go here */}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        <div className="lg:col-span-1 space-y-4 flex flex-col">
          <Card className="shadow-md flex-grow flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Functions</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <FunctionList
                functions={functions}
                onUpdateFunction={handleUpdateFunction}
                onDeleteFunction={handleDeleteFunction}
                onAddFunction={handleAddFunction}
              />
            </CardContent>
          </Card>
          <StarterPanel onAddSample={handleAddSampleToGraph} />
        </div>

        <div className="lg:col-span-2 space-y-4 flex flex-col">
           <GraphControls 
            viewSettings={viewSettings} 
            onViewSettingsChange={handleViewSettingsChange}
            onResetView={handleResetView}
            onZoom={handleZoom}
          />
          <GraphDisplay plotDataArray={plotDataArray} viewSettings={viewSettings} onPan={handlePan} />
          {/* Placeholder: PWA install prompt could be triggered here */}
        </div>
      </div>
       {/* Placeholder: HowToUseToggle or docs link */}
       {/* Placeholder: Dark mode toggle integration if not in header */}
    </div>
  );
}
