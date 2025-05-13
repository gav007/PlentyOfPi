
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
        plugins: [], // Initialize with an empty array
        tip: { 
          xLine: true,
          yLine: true,
          renderer: function (x: number, y: number, index: number) {
            const func = dataToPlot[index];
            return `(${x.toFixed(3)}, ${y.toFixed(3)}) on ${func.fn}`;
          }
        }
      };
      
      // Safely add zoom plugin if available
      if (fp.plugins && typeof fp.plugins.zoom === 'function') {
        options.plugins.push(fp.plugins.zoom());
      } else {
        console.warn("function-plot zoom plugin not available or not a function.");
      }
      
      // Safely add pan plugin if available (example, if you decide to use it)
      // if (fp.plugins && typeof fp.plugins.pan === 'function') {
      //   options.plugins.push(fp.plugins.pan());
      // } else {
      //   console.warn("function-plot pan plugin not available or not a function.");
      // }
      
      plotInstanceRef.current = fp(options);
      
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
    if (!graphRef.current || !isPlotLibLoaded) return; // Add isPlotLibLoaded check
    const resizeObserver = new ResizeObserver(() => {
      drawGraph();
    });
    resizeObserver.observe(graphRef.current);
    return () => resizeObserver.disconnect();
  }, [drawGraph, isPlotLibLoaded]); // Add isPlotLibLoaded check


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
