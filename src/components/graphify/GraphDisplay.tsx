
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { FunctionDefinition, GraphViewSettings } from '@/types/graphify';
// functionPlot is imported dynamically

interface GraphDisplayProps {
  functions: FunctionDefinition[];
  viewSettings: GraphViewSettings;
  onPan: (dxPercent: number, dyPercent: number) => void;
}

export default function GraphDisplay({ functions, viewSettings, onPan }: GraphDisplayProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const plotInstanceRef = useRef<any>(null); // To store the function-plot instance
  const functionPlotRef = useRef<any>(null); // Ref to store the functionPlot library
  const [isPlotLibLoaded, setIsPlotLibLoaded] = useState(false);

  useEffect(() => {
    import('function-plot').then(module => {
      functionPlotRef.current = module.default; // Store in ref
      setIsPlotLibLoaded(true);
    }).catch(err => console.error("Failed to load function-plot:", err));
  }, []);

  const drawGraph = useCallback(() => {
    if (!graphRef.current || !isPlotLibLoaded || !functionPlotRef.current) return;

    const fp = functionPlotRef.current; // Use the ref

    const dataToPlot = functions
      .filter(f => f.isVisible && f.expression.trim() !== '' && !f.error)
      .map(f => ({
        fn: f.expression,
        color: f.color,
        graphType: 'polyline' as const,
        sampler: 'builtIn' as const,
      }));

    // Destroy previous instance and clean target before any plotting attempt or return
    if (plotInstanceRef.current && typeof plotInstanceRef.current.destroy === 'function') {
      plotInstanceRef.current.destroy();
      plotInstanceRef.current = null;
    }
    if (graphRef.current) {
      graphRef.current.innerHTML = ''; // Clean the target element
    }

    if (dataToPlot.length === 0) {
      if (graphRef.current) {
        graphRef.current.innerHTML = '<p class="text-center text-muted-foreground p-4">No functions to plot.</p>';
      }
      return; // Exit if no data to plot
    }

    try {
      const options: any = {
        target: graphRef.current,
        width: graphRef.current.clientWidth,
        height: graphRef.current.clientHeight,
        xAxis: {
          label: viewSettings.xAxis?.label || 'x-axis',
          domain: [viewSettings.xMin, viewSettings.xMax],
        },
        yAxis: {
          label: viewSettings.yAxis?.label || 'y-axis',
          domain: viewSettings.autoScaleY ? null : [viewSettings.yMin, viewSettings.yMax],
        },
        grid: viewSettings.grid ?? true,
        data: dataToPlot,
        disableZoom: true,
        plugins: [], // Initialize with an empty array, zoom plugin can be added if needed & compatible
        tip: {
          xLine: true,
          yLine: true,
          renderer: function (x: number, y: number, index: number) {
            const func = dataToPlot[index];
            // Safer access to func and func.fn
            if (func && typeof func.fn === 'string') {
              return `(${x.toFixed(3)}, ${y.toFixed(3)}) on ${func.fn}`;
            }
            return `(${x.toFixed(3)}, ${y.toFixed(3)})`; // Fallback if func or func.fn is not available
          }
        }
      };

      // Example of how plugins could be added if function-plot's internal zoom/pan was desired
      // and compatible with disableZoom: true or manual handling.
      // Currently, pan is manual, and zoom is via controls, so this is often not needed.
      // if (fp.plugins && typeof fp.plugins.zoom === 'function') {
      //   options.plugins.push(fp.plugins.zoom());
      // }

      plotInstanceRef.current = fp(options); // This is line 82 from error

    } catch (error) {
      console.error("Error rendering graph with function-plot:", error);
      if (graphRef.current) {
        graphRef.current.innerHTML = `<p style="color:red;text-align:center;padding-top:20px;">Error rendering graph. Check console.</p>`;
      }
    }
  }, [functions, viewSettings, isPlotLibLoaded]);


  useEffect(() => {
    if(isPlotLibLoaded) { // Ensure lib is loaded before first draw
        drawGraph();
    }
  }, [drawGraph, isPlotLibLoaded]);

  useEffect(() => {
    if (!graphRef.current || !isPlotLibLoaded) return;
    const resizeObserver = new ResizeObserver(() => {
      drawGraph();
    });
    resizeObserver.observe(graphRef.current);
    return () => resizeObserver.disconnect();
  }, [drawGraph, isPlotLibLoaded]);


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
        onPan(-dx / plotWidth, dy / plotHeight);
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
