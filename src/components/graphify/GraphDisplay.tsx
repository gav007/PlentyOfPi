
'use client';

import type { PlotData, GraphViewSettings } from '@/types/graphify';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import * as React from 'react';

interface GraphDisplayProps {
  plotDataArray: PlotData[];
  viewSettings: GraphViewSettings;
  onPan?: (dxPercent: number, dyPercent: number) => void; // For future drag-to-pan
}

export default function GraphDisplay({ plotDataArray, viewSettings, onPan }: GraphDisplayProps) {
  const chartRef = React.useRef<any>(null);
  const dragStartRef = React.useRef<{ x: number, y: number } | null>(null);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length && label !== undefined) {
      return (
        <div className="bg-background/90 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg text-xs">
          <p className="font-semibold mb-1">x: {Number(label).toFixed(3)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ color: entry.stroke }} className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor: entry.stroke}}></span>
              {`${entry.name || `f${plotDataArray.findIndex(p => p.id === entry.payload?.id) + 1}(x)`}: ${Number(entry.value).toFixed(3)}`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Combine all points for domain calculation if Y is auto-scaled
  const allPoints = React.useMemo(() => {
    if (!viewSettings.autoScaleY) return [];
    return plotDataArray.reduce((acc, series) => acc.concat(series.points), [] as { x: number, y: number | null }[]);
  }, [plotDataArray, viewSettings.autoScaleY]);

  const yDomain = React.useMemo((): [number | string, number | string] => {
    if (viewSettings.autoScaleY) {
      const yValues = allPoints.map(p => p.y).filter(y => y !== null && isFinite(y)) as number[];
      if (yValues.length > 0) {
        let dataMinY = Math.min(...yValues);
        let dataMaxY = Math.max(...yValues);
        const range = dataMaxY - dataMinY;
        const padding = range === 0 ? 1 : range * 0.1;
        dataMinY -= padding;
        dataMaxY += padding;
        if (dataMinY === dataMaxY) { // If range was 0, e.g. y=5
          dataMinY -= 1;
          dataMaxY += 1;
        }
        return [dataMinY, dataMaxY];
      }
      return ['auto', 'auto']; // Fallback if no valid points
    }
    return [viewSettings.yMin, viewSettings.yMax];
  }, [viewSettings.yMin, viewSettings.yMax, viewSettings.autoScaleY, allPoints]);


  const handleMouseDown = (e: React.MouseEvent) => {
    if (chartRef.current && chartRef.current.container && onPan) {
        const chartRect = chartRef.current.container.getBoundingClientRect();
        dragStartRef.current = { x: e.clientX - chartRect.left, y: e.clientY - chartRect.top };
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
      if (dragStartRef.current && chartRef.current && chartRef.current.container && onPan) {
        const chartRect = chartRef.current.container.getBoundingClientRect();
        const currentX = e.clientX - chartRect.left;
        const currentY = e.clientY - chartRect.top;
  
        const dx = currentX - dragStartRef.current.x;
        const dy = currentY - dragStartRef.current.y;
        
        if (chartRect.width > 0 && chartRect.height > 0) {
            onPan(-dx / chartRect.width, dy / chartRect.height);
        }
  
        dragStartRef.current = { x: currentX, y: currentY };
      }
  };
  
  const handleMouseUpOrLeave = () => {
    dragStartRef.current = null;
  };


  return (
    <div 
      className="w-full aspect-[16/10] min-h-[300px] md:min-h-[400px] bg-background rounded-md shadow-lg border cursor-grab active:cursor-grabbing"
      onMouseDown={onPan ? handleMouseDown : undefined}
      onMouseMove={onPan ? handleMouseMove : undefined}
      onMouseUp={onPan ? handleMouseUpOrLeave : undefined}
      onMouseLeave={onPan ? handleMouseUpOrLeave : undefined}
      // Note: Wheel zoom is handled by GraphControls and updates viewSettings
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          ref={chartRef}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          // Note: onClick for point selection or specific interactions could be added here
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.7)" />
          <XAxis
            type="number"
            dataKey="x" // Generic dataKey, actual data comes from Line components
            domain={[viewSettings.xMin, viewSettings.xMax]}
            allowDataOverflow
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => Number(tick).toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:1})}
            label={{ value: 'x', position: 'insideBottomRight', offset: -10, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            type="number"
            domain={yDomain}
            allowDataOverflow
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => Number(tick).toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:1})}
            label={{ value: 'y', angle: -90, position: 'insideLeft', offset: 10, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeWidth={0.75} ifOverflow="visible"/>
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeWidth={0.75} ifOverflow="visible"/>

          {plotDataArray.map((series) => (
            series.points && series.points.length > 0 && (
              <Line
                key={series.id}
                type="monotone"
                dataKey="y"
                data={series.points}
                stroke={series.color}
                strokeWidth={2}
                dot={false}
                name={series.expression || `f${plotDataArray.findIndex(p => p.id === series.id) + 1}(x)`}
                connectNulls={false} // Do not connect across undefined points (NaNs)
                isAnimationActive={false}
              />
            )
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
