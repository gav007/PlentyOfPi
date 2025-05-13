
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { FunctionDefinition, GraphViewSettings } from '@/types/graphify'; // Use shared Graphify types
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ZoomIn, ZoomOut, RefreshCw, Settings2, CheckSquare, Square, Grid as GridIcon, Axe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dynamically import function-plot
let functionPlot: any = null; 

interface GraphCanvasProps {
  expressions: FunctionDefinition[]; // Use FunctionDefinition
  viewSettings: GraphViewSettings;
  onViewSettingsChange: (settings: Partial<GraphViewSettings>) => void;
  isDebugMode?: boolean; // Optional for debug features
}

const DEFAULT_VIEW_SETTINGS: GraphViewSettings = {
  xMin: -10, xMax: 10, yMin: -10, yMax: 10, grid: true, autoScaleY: true,
};

export default function GraphCanvas({
  expressions,
  viewSettings: initialViewSettings, // Rename to avoid conflict with internal state
  onViewSettingsChange,
  isDebugMode,
}: GraphCanvasProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const plotInstanceRef = useRef<any>(null);
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const { toast } = useToast();

  // Internal state for view settings to manage popover inputs without immediate global update
  const [localViewSettings, setLocalViewSettings] = useState(initialViewSettings);
   const [popoverOpen, setPopoverOpen] = useState(false);


  useEffect(() => {
    setLocalViewSettings(initialViewSettings); // Sync local with prop changes
  }, [initialViewSettings]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !functionPlot) {
      import('function-plot').then(module => {
        functionPlot = module.default;
        setIsLibLoaded(true);
      }).catch(err => {
        console.error("Failed to load function-plot:", err);
        toast({ title: "Graphing Library Error", description: "Could not load the graphing library.", variant: "destructive"});
      });
    } else if (functionPlot) {
      setIsLibLoaded(true);
    }
  }, [toast]);
  
  const drawGraph = useCallback(() => {
    if (!graphRef.current || !isLibLoaded || !functionPlot) return;

    const dataToPlot = expressions
      .filter(f => f.isVisible && f.expression.trim() !== '' && !f.error)
      .map(f => ({
        fn: f.expression,
        color: f.color,
        graphType: 'polyline' as const,
      }));

    try {
      graphRef.current.innerHTML = ''; // Clear previous plot
      plotInstanceRef.current = functionPlot({
        target: graphRef.current,
        width: graphRef.current.clientWidth,
        height: graphRef.current.clientHeight,
        xAxis: { domain: [initialViewSettings.xMin, initialViewSettings.xMax] },
        yAxis: { domain: initialViewSettings.autoScaleY ? null : [initialViewSettings.yMin, initialViewSettings.yMax] },
        grid: initialViewSettings.grid,
        data: dataToPlot,
        tip: { // Basic tooltip
          xLine: true, yLine: true,
          renderer: (x: number, y: number, L: any, M: any, N: any, d: any, index: number) => 
             `fn: ${dataToPlot[index]?.fn || 'N/A'}<br>x: ${x.toFixed(2)}<br>y: ${y.toFixed(2)}`
        },
        plugins: [
          functionPlot.plugins.zoom(), // Basic zoom/pan
          functionPlot.plugins.pan(),
        ]
      });
      
      // Listen to function-plot's internal domain change events if available
      // This example uses a simplified approach by updating global state on our control interactions
      if (plotInstanceRef.current && plotInstanceRef.current.meta && plotInstanceRef.current.meta.xScale) {
        // If function-plot emits events for domain changes, listen here
        // e.g., plotInstanceRef.current.on('domain-change', (newDomain) => { ... });
        // For now, this is not standard in function-plot, so we rely on our own controls.
      }


    } catch (error) {
      console.error("Error rendering graph:", error);
      if (graphRef.current) {
        graphRef.current.innerHTML = `<p class="p-4 text-center text-destructive">Error rendering graph. Check console or function syntax.</p>`;
      }
      toast({ title: "Graphing Error", description: "Could not plot the functions. Check syntax.", variant: "destructive"});
    }
  }, [expressions, initialViewSettings, isLibLoaded, toast]);

  useEffect(() => {
    if (isLibLoaded && graphRef.current) {
      drawGraph();
      const resizeObserver = new ResizeObserver(() => drawGraph());
      resizeObserver.observe(graphRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [drawGraph, isLibLoaded]); // Rerun if drawGraph or lib status changes


  const handleZoom = (factor: number) => {
    const { xMin, xMax, yMin, yMax, autoScaleY } = initialViewSettings;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;

    const newXMin = xCenter - (xRange / 2) * factor;
    const newXMax = xCenter + (xRange / 2) * factor;
    
    let newYMin = yMin;
    let newYMax = yMax;

    if (!autoScaleY) {
      newYMin = yCenter - (yRange / 2) * factor;
      newYMax = yCenter + (yRange / 2) * factor;
    }
     if (Math.abs(newXMax - newXMin) < 0.001 || (!autoScaleY && Math.abs(newYMax - newYMin) < 0.001)) return;

    onViewSettingsChange({ xMin: newXMin, xMax: newXMax, yMin: newYMin, yMax: newYMax });
  };
  
  const handleInputChange = (field: keyof GraphViewSettings, value: string) => {
    const numValue = parseFloat(value);
    setLocalViewSettings(prev => ({ ...prev, [field]: value === '' || value === '-' || isNaN(numValue) ? value : numValue }));
  };
  
  const handleCheckboxChange = (field: keyof GraphViewSettings, checked: boolean) => {
    setLocalViewSettings(prev => ({ ...prev, [field]: checked }));
  };

  const applyLocalSettings = () => {
    const { xMin, xMax, yMin, yMax, autoScaleY, grid } = localViewSettings;
    const parsedXMin = parseFloat(String(xMin));
    const parsedXMax = parseFloat(String(xMax));
    const parsedYMin = parseFloat(String(yMin));
    const parsedYMax = parseFloat(String(yMax));

    const newSettings: Partial<GraphViewSettings> = { autoScaleY, grid };

    if (!isNaN(parsedXMin)) newSettings.xMin = parsedXMin;
    if (!isNaN(parsedXMax)) newSettings.xMax = parsedXMax;

    if (newSettings.xMin !== undefined && newSettings.xMax !== undefined && newSettings.xMin >= newSettings.xMax) {
        toast({ title: "Invalid Range", description: "X Min must be less than X Max.", variant: "destructive"}); return;
    }
    if (!autoScaleY) {
      if (!isNaN(parsedYMin)) newSettings.yMin = parsedYMin;
      if (!isNaN(parsedYMax)) newSettings.yMax = parsedYMax;
       if (newSettings.yMin !== undefined && newSettings.yMax !== undefined && newSettings.yMin >= newSettings.yMax) {
        toast({ title: "Invalid Range", description: "Y Min must be less than Y Max.", variant: "destructive"}); return;
      }
    } else {
        newSettings.yMin = undefined; 
        newSettings.yMax = undefined;
    }
    onViewSettingsChange(newSettings);
    setPopoverOpen(false);
  };
  
  const resetViewSettings = () => {
    onViewSettingsChange(DEFAULT_VIEW_SETTINGS);
    setLocalViewSettings(DEFAULT_VIEW_SETTINGS); // Also reset local temp state
  };


  return (
    <div className="space-y-2 sm:space-y-3 h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-muted/40 rounded-md border shadow-sm">
        <div className="flex gap-1 sm:gap-1.5">
          <Button onClick={() => handleZoom(0.8)} variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button onClick={() => handleZoom(1.25)} variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button onClick={resetViewSettings} variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" title="Reset View">
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" title="Graph Settings">
              <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 sm:w-64 space-y-2.5 p-3">
            <h4 className="font-medium text-xs sm:text-sm flex items-center gap-1"><Axe className="w-3.5 h-3.5"/>Axis Bounds</h4>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label htmlFor="xMin-canvas" className="text-xs">X Min</Label>
                <Input id="xMin-canvas" type="number" value={String(localViewSettings.xMin)} onChange={e => handleInputChange('xMin', e.target.value)} className="h-7 text-xs"/>
              </div>
              <div>
                <Label htmlFor="xMax-canvas" className="text-xs">X Max</Label>
                <Input id="xMax-canvas" type="number" value={String(localViewSettings.xMax)} onChange={e => handleInputChange('xMax', e.target.value)} className="h-7 text-xs"/>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <Button variant="ghost" size="sm" className="p-0 h-auto data-[state=checked]:bg-transparent" onClick={() => handleCheckboxChange('autoScaleY', !localViewSettings.autoScaleY)} data-state={localViewSettings.autoScaleY ? 'checked' : 'unchecked'}>
                {localViewSettings.autoScaleY ? <CheckSquare className="w-3.5 h-3.5 text-primary"/> : <Square className="w-3.5 h-3.5 text-muted-foreground"/>}
              </Button>
              <Label className="text-xs cursor-pointer" onClick={() => handleCheckboxChange('autoScaleY', !localViewSettings.autoScaleY)}>Autoscale Y</Label>
            </div>
            {!localViewSettings.autoScaleY && (
              <div className="grid grid-cols-2 gap-1.5">
                <div><Label htmlFor="yMin-canvas" className="text-xs">Y Min</Label><Input id="yMin-canvas" type="number" value={String(localViewSettings.yMin)} onChange={e => handleInputChange('yMin', e.target.value)} className="h-7 text-xs"/></div>
                <div><Label htmlFor="yMax-canvas" className="text-xs">Y Max</Label><Input id="yMax-canvas" type="number" value={String(localViewSettings.yMax)} onChange={e => handleInputChange('yMax', e.target.value)} className="h-7 text-xs"/></div>
              </div>
            )}
            <div className="flex items-center space-x-1.5 mt-1 border-t pt-1.5">
              <Button variant="ghost" size="sm" className="p-0 h-auto data-[state=checked]:bg-transparent" onClick={() => handleCheckboxChange('grid', !localViewSettings.grid)} data-state={localViewSettings.grid ? 'checked' : 'unchecked'}>
                {localViewSettings.grid ? <CheckSquare className="w-3.5 h-3.5 text-primary"/> : <Square className="w-3.5 h-3.5 text-muted-foreground"/>}
              </Button>
              <Label className="text-xs cursor-pointer flex items-center gap-1" onClick={() => handleCheckboxChange('grid', !localViewSettings.grid)}><GridIcon className="w-3 h-3"/>Show Grid</Label>
            </div>
            <Button onClick={applyLocalSettings} size="sm" className="w-full mt-1.5 text-xs h-7">Apply</Button>
          </PopoverContent>
        </Popover>
      </div>
      <div ref={graphRef} className="flex-grow w-full h-full min-h-[250px] sm:min-h-[350px] bg-background rounded-md shadow-md border">
        {!isLibLoaded && <p className="text-center text-muted-foreground p-4">Loading graphing library...</p>}
      </div>
    </div>
  );
}
