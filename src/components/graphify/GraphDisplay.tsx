
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { FunctionDefinition, GraphViewSettings } from '@/types/graphify';
// functionPlot is imported dynamically
// import functionPlot from 'function-plot'; // Standard import if not dynamic

interface GraphDisplayProps {
  functions: FunctionDefinition[];
  viewSettings: GraphViewSettings;
  onPan: (dxPercent: number, dyPercent: number) => void;
}

export default function GraphDisplay({ functions, viewSettings, onPan }: GraphDisplayProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const plotInstanceRef = useRef<any>(null); // To store the function-plot instance
  const [isPlotLibLoaded, setIsPlotLibLoaded] = useState(false);

  useEffect(() => {
    import('function-plot').then(module => {
      window.functionPlot = module.default; // Make it globally available for function-plot or store in ref
      setIsPlotLibLoaded(true);
    }).catch(err => console.error("Failed to load function-plot:", err));
  }, []);

  const drawGraph = useCallback(() => {
    if (!graphRef.current || !isPlotLibLoaded || !window.functionPlot) return;

    const dataToPlot = functions
      .filter(f => f.isVisible && f.expression.trim() !== '' && !f.error)
      .map(f => ({
        fn: f.expression,
        color: f.color,
        graphType: 'polyline' as const, // Explicitly type
        sampler: 'builtIn' as const,    // Explicitly type
      }));

    try {
      const options: any = { // function-plot options type is complex
        target: graphRef.current,
        width: graphRef.current.clientWidth,
        height: graphRef.current.clientHeight,
        xAxis: {
          label: viewSettings.xAxis?.label || 'x-axis',
          domain: [viewSettings.xMin, viewSettings.xMax],
        },
        yAxis: {
          label: viewSettings.yAxis?.label || 'y-axis',
          domain: viewSettings.autoScaleY ? null : [viewSettings.yMin, viewSettings.yMax], // Let function-plot auto-scale Y if autoScaleY
        },
        grid: viewSettings.grid ?? true,
        data: dataToPlot,
        disableZoom: true, // We'll handle zoom/pan via our controls + this component
        plugins: [
          // @ts-ignore functionPlot types might not have this plugin structure explicitly
          window.functionPlot.plugins.zoom(), // For programmatic zoom, not necessarily user drag/wheel on canvas
        ],
        tip: { // Tooltip configuration
          xLine: true,
          yLine: true,
          renderer: function (x: number, y: number, index: number) {
            const func = dataToPlot[index];
            return `(${x.toFixed(3)}, ${y.toFixed(3)}) on ${func.fn}`;
          }
        }
      };
      
      plotInstanceRef.current = window.functionPlot(options);

      // Add custom event listeners for pan if function-plot's internal ones are not sufficient or disabled
      // This is a simplified example; robust pan/zoom might need more sophisticated event handling.
      // The `functionPlot.plugins.zoom()` might already provide some level of interaction.
      // If more control is needed, attach listeners to `graphRef.current`.
      
    } catch (error) {
      console.error("Error rendering graph with function-plot:", error);
      // Display an error message on the canvas or a fallback UI
      if (graphRef.current) {
        graphRef.current.innerHTML = `<p style="color:red;text-align:center;padding-top:20px;">Error rendering graph. Check console.</p>`;
      }
    }
  }, [functions, viewSettings, isPlotLibLoaded]);


  useEffect(() => {
    drawGraph();
  }, [drawGraph]); // Redraw when functions or viewSettings change

  // Resize observer for responsive graph
  useEffect(() => {
    if (!graphRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      drawGraph();
    });
    resizeObserver.observe(graphRef.current);
    return () => resizeObserver.disconnect();
  }, [drawGraph]);


  // Manual Pan logic (example, can be more sophisticated)
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartRef.current && graphRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      const plotWidth = graphRef.current.clientWidth;
      const plotHeight = graphRef.current.clientHeight;

      if (plotWidth > 0 && plotHeight > 0) {
        onPan(-dx / plotWidth, dy / plotHeight); // Pass percentage change
      }
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };
  
  const handleMouseUpOrLeave = () => {
    dragStartRef.current = null;
  };

  return (
    <div 
      className="w-full h-full bg-background rounded-md shadow-lg border cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      <div ref={graphRef} style={{ width: '100%', height: '100%' }}>
        {!isPlotLibLoaded && <p className="text-center text-muted-foreground p-4">Loading graphing library...</p>}
      </div>
    </div>
  );
}
