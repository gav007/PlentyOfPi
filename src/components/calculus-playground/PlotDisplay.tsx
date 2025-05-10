
'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  Area,
  ReferenceLine,
  TooltipProps, // Import TooltipProps for type safety
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { cn } from '@/lib/utils';

interface PlotDisplayProps {
  plotData: { x: number; y: number | null }[];
  derivativePlotData: { x: number; y: number | null }[]; // For the full f'(x) curve
  xValue: number;
  fxValue: number;
  fpxValue: number; // derivative value at xValue (slope of tangent)
  showTangent: boolean;
  showArea: boolean;
  showFullDerivativeCurve: boolean; // New prop to control f'(x) curve visibility
  domain: { xMin: number; xMax: number; yMin: string | number; yMax: string | number }; // Updated domain prop
  onXValueChangeByClick: (newX: number) => void; // Callback for click interaction
}

export default function PlotDisplay({
  plotData,
  derivativePlotData,
  xValue,
  fxValue,
  fpxValue,
  showTangent,
  showArea,
  showFullDerivativeCurve,
  domain,
  onXValueChangeByClick,
}: PlotDisplayProps) {
  
  const tangentLineData = React.useMemo(() => {
    if (!showTangent || isNaN(fxValue) || isNaN(fpxValue) || !isFinite(fxValue) || !isFinite(fpxValue)) return [];
    const y0 = fxValue;
    const x0 = xValue;
    const m = fpxValue;

    const yAtMin = m * (domain.xMin - x0) + y0;
    const yAtMax = m * (domain.xMax - x0) + y0;
    
    return [
      { x: domain.xMin, y: yAtMin },
      { x: domain.xMax, y: yAtMax },
    ];
  }, [showTangent, xValue, fxValue, fpxValue, domain.xMin, domain.xMax]);

  const areaData = React.useMemo(() => {
    if (!showArea) return [];
    return plotData.map(p => ({
      x: p.x,
      y: (xValue >= 0 ? (p.x >= 0 && p.x <= xValue) : (p.x >= xValue && p.x <= 0)) && p.y !== null && isFinite(p.y)
           ? p.y 
           : 0,
    }));
  }, [showArea, plotData, xValue]);

  const handleChartClick = (chartData: any) => {
    if (chartData && chartData.activeCoordinate && typeof chartData.activeCoordinate.x === 'number') {
       // Recharts' activeCoordinate.x is usually the direct data x-value or interpolated.
       // Ensure it's within the current plot domain before updating.
      const clickedX = Math.max(domain.xMin, Math.min(domain.xMax, chartData.activeCoordinate.x));
      onXValueChangeByClick(clickedX);
    } else if (chartData && typeof chartData.activeLabel === 'number') {
       // Fallback if activeCoordinate.x is not available, use activeLabel if it's numeric
      const clickedX = Math.max(domain.xMin, Math.min(domain.xMax, chartData.activeLabel));
      onXValueChangeByClick(clickedX);
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg text-sm">
          <p className="font-semibold">{`x: ${label !== undefined ? Number(label).toFixed(2) : 'N/A'}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value !== undefined && entry.value !== null ? Number(entry.value).toFixed(3) : 'N/A'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const yAxisDomain: [string | number, string | number] = [
    domain.yMin === 'auto' || isNaN(Number(domain.yMin)) ? 'auto' : Number(domain.yMin),
    domain.yMax === 'auto' || isNaN(Number(domain.yMax)) ? 'auto' : Number(domain.yMax),
  ];


  return (
    <div className="h-[400px] w-full rounded-md border border-input bg-background/30 p-4 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
            margin={{ top: 5, right: 20, left: -25, bottom: 5 }}
            onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.5)" />
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={[domain.xMin, domain.xMax]} 
            allowDataOverflow 
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => Number(tick).toFixed(Math.abs(domain.xMax - domain.xMin) > 20 ? 0 : 1)}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => Number(tick).toFixed(1)}
            domain={yAxisDomain}
            allowDataOverflow
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '3 3' }}/>

          <Line type="monotone" dataKey="y" data={plotData} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls={false} name="f(x)" />

          {showFullDerivativeCurve && derivativePlotData.length > 0 && (
            <Line type="monotone" dataKey="y" data={derivativePlotData} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls={false} name="f'(x) full" strokeDasharray="5 5" />
          )}
          
          {showArea && areaData.length > 0 && (
             <Area type="monotone" dataKey="y" data={areaData} fill="hsl(var(--chart-3))" stroke="hsl(var(--chart-3))" fillOpacity={0.3} strokeWidth={0} name="∫f(x)dx" connectNulls={false} />
          )}

          {showTangent && tangentLineData.length > 0 && !isNaN(fxValue) && isFinite(fxValue) && (
            <Line type="linear" dataKey="y" data={tangentLineData} stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} name="Tangent" />
          )}
          
          {!isNaN(fxValue) && isFinite(fxValue) && (
            <ReferenceDot x={xValue} y={fxValue} r={5} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={2} isFront={true} />
          )}
           
           {showArea && <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />}
           <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />


        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
