
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FunctionDefinition, PlotData, GraphViewSettings } from '@/types/graphify';
import FunctionList from './FunctionList';
import GraphDisplay from './GraphDisplay';
import StarterPanel from './StarterPanel';
import GraphControls from './GraphControls';
import { evaluate, compile, parse } from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription }
from '@/components/ui/card';
import { LineChart as LineChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const INITIAL_X_MIN = -10;
const INITIAL_X_MAX = 10;
const INITIAL_Y_MIN = -10;
const INITIAL_Y_MAX = 10;

const PREDEFINED_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
  '#8B5CF6', '#EF4444', '#6366F1', '#F97316',
  '#22D3EE', '#A3E635'
];

const initialViewSettings: GraphViewSettings = {
  xMin: INITIAL_X_MIN,
  xMax: INITIAL_X_MAX,
  yMin: INITIAL_Y_MIN,
  yMax: INITIAL_Y_MAX,
  grid: true,
  autoScaleY: true,
};

export default function GraphifyLayout() {
  const { toast } = useToast();

  // Initial color is fixed to avoid hydration mismatch
  const initialFunctionColor = PREDEFINED_COLORS[0];
  const [functions, setFunctions] = useState<FunctionDefinition[]>([
    { id: crypto.randomUUID(), expression: 'x^2', color: initialFunctionColor, isVisible: true, error: null },
  ]);
  const [viewSettings, setViewSettings] = useState<GraphViewSettings>(initialViewSettings);

  // Use a ref for colorIndex for client-side additions to ensure consistency
  const nextColorIndexRef = useRef(1 % PREDEFINED_COLORS.length); // Start from the second color

  const getNextColorForNewFunction = (): string => {
    const color = PREDEFINED_COLORS[nextColorIndexRef.current];
    nextColorIndexRef.current = (nextColorIndexRef.current + 1) % PREDEFINED_COLORS.length;
    return color;
  };

  const validateAndCompileExpression = (expression: string): { error: string | null } => {
    if (!expression.trim()) return { error: null };
    try {
      parse(expression);
      return { error: null };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Invalid syntax";
      return { error: message.length > 50 ? message.substring(0, 50) + "..." : message };
    }
  };

  const handleAddFunction = (expression?: string) => {
    setFunctions(prev => {
      if (prev.length >= 10) {
        toast({ title: "Function Limit Reached", description: "You can plot up to 10 functions.", variant: "destructive" });
        return prev;
      }
      const validation = validateAndCompileExpression(expression || '');
      return [
        ...prev,
        { id: crypto.randomUUID(), expression: expression || '', color: getNextColorForNewFunction(), isVisible: true, error: validation.error },
      ]
    });
  };

  const handleUpdateFunction = (id: string, updates: Partial<Omit<FunctionDefinition, 'id'>>) => {
    setFunctions(prev =>
      prev.map(f => {
        if (f.id === id) {
          const updatedFunc = { ...f, ...updates };
          if (updates.expression !== undefined) {
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
        // When deleting the last function, add a new blank one with the next color
        return [{ id: crypto.randomUUID(), expression: '', color: getNextColorForNewFunction(), isVisible: true, error: null }];
      }
      return newFunctions;
    });
  };
  
  const handleViewSettingsChange = (settingsUpdate: Partial<GraphViewSettings>) => {
    setViewSettings(prev => ({ ...prev, ...settingsUpdate }));
  };

  const handleResetView = () => setViewSettings(initialViewSettings);

  const handleZoom = (factor: number) => {
    setViewSettings(prev => {
      const xRange = prev.xMax - prev.xMin;
      const yRange = prev.yMax - prev.yMin;
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;

      const newXMin = xCenter - (xRange / 2) * factor;
      const newXMax = xCenter + (xRange / 2) * factor;
      
      let newYMin = prev.yMin;
      let newYMax = prev.yMax;

      if(!prev.autoScaleY){
        newYMin = yCenter - (yRange / 2) * factor;
        newYMax = yCenter + (yRange / 2) * factor;
      }
      if (Math.abs(newXMax - newXMin) < 0.01 || Math.abs(newYMax - newYMin) < 0.01 && !prev.autoScaleY) {
        return prev;
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
    <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 min-h-screen flex flex-col">
      <Card className="shadow-xl flex-shrink-0">
        <CardHeader className="text-center pb-3 sm:pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <LineChartIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            Graphify Calculator
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Plot functions, explore graphs, and analyze equations.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 flex-grow min-h-0">
        <div className="lg:col-span-1 space-y-4 flex flex-col min-h-0">
          <Card className="shadow-md flex-grow flex flex-col">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base sm:text-lg">Functions</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-2 sm:p-3">
              <FunctionList
                functions={functions}
                onUpdateFunction={handleUpdateFunction}
                onDeleteFunction={handleDeleteFunction}
                onAddFunction={() => handleAddFunction()}
              />
            </CardContent>
          </Card>
          <StarterPanel onAddSample={(expr) => handleAddFunction(expr)} />
        </div>

        <div className="lg:col-span-2 space-y-4 flex flex-col min-h-0">
           <GraphControls 
            viewSettings={viewSettings} 
            onViewSettingsChange={handleViewSettingsChange}
            onResetView={handleResetView}
            onZoom={handleZoom}
          />
          <div className="flex-grow min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            <GraphDisplay 
                functions={functions.filter(f => f.isVisible && !f.error && f.expression.trim() !== '')} 
                viewSettings={viewSettings} 
                onPan={handlePan}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
