
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
} from 'recharts';
import { cn } from '@/lib/utils';

interface PlotDisplayProps {
  plotData: { x: number; y: number | null }[];
  derivativePlotData: { x: number; y: number | null }[];
  xValue: number;
  fxValue: number;
  fpxValue: number; // derivative value at xValue (slope of tangent)
  showTangent: boolean;
  showArea: boolean;
  domainMin: number;
  domainMax: number;
}

export default function PlotDisplay({
  plotData,
  derivativePlotData,
  xValue,
  fxValue,
  fpxValue,
  showTangent,
  showArea,
  domainMin,
  domainMax,
}: PlotDisplayProps) {
  
  const tangentLineData = React.useMemo(() => {
    if (!showTangent || isNaN(fxValue) || isNaN(fpxValue) || !isFinite(fxValue) || !isFinite(fpxValue)) return [];
    // y = m(x - x0) + y0
    const y0 = fxValue;
    const x0 = xValue;
    const m = fpxValue;

    // Calculate y values at domainMin and domainMax for the tangent line
    const yAtMin = m * (domainMin - x0) + y0;
    const yAtMax = m * (domainMax - x0) + y0;
    
    return [
      { x: domainMin, y: yAtMin },
      { x: domainMax, y: yAtMax },
    ];
  }, [showTangent, xValue, fxValue, fpxValue, domainMin, domainMax]);

  const areaData = React.useMemo(() => {
    if (!showArea) return [];
    // Creates data for shading area from x=0 to xValue under f(x)
    // Points outside this range will have y=0 for this series, effectively shading only the desired region.
    return plotData.map(p => ({
      x: p.x,
      y: (xValue >= 0 ? (p.x >= 0 && p.x <= xValue) : (p.x >= xValue && p.x <= 0)) && p.y !== null && isFinite(p.y)
           ? p.y 
           : 0, // Use 0 to draw area along x-axis outside integration range
    }));
  }, [showArea, plotData, xValue]);


  const CustomTooltip = ({ active, payload, label }: any) => {
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

  return (
    <div className="h-[400px] w-full rounded-md border border-input bg-background/30 p-4 shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.5)" />
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={[domainMin, domainMax]} 
            allowDataOverflow 
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => Number(tick).toFixed(0)}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => Number(tick).toFixed(1)}
            domain={['auto', 'auto']} // Auto-adjust y-axis based on data
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '3 3' }}/>

          {/* Main function f(x) */}
          <Line type="monotone" dataKey="y" data={plotData} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls={false} name="f(x)" />

          {/* Derivative f'(x) */}
          {derivativePlotData.length > 0 && (
            <Line type="monotone" dataKey="y" data={derivativePlotData} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls={false} name="f'(x)" strokeDasharray="5 5" />
          )}
          
          {/* Area under f(x) from 0 to xValue */}
          {showArea && areaData.length > 0 && (
             <Area type="monotone" dataKey="y" data={areaData} fill="hsl(var(--chart-3))" stroke="hsl(var(--chart-3))" fillOpacity={0.3} strokeWidth={0} name="∫f(x)dx" connectNulls={false} />
          )}

          {/* Tangent line */}
          {showTangent && tangentLineData.length > 0 && !isNaN(fxValue) && (
            <Line type="linear" dataKey="y" data={tangentLineData} stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} name="Tangent" />
          )}
          
          {/* Point on the curve at xValue */}
          {!isNaN(fxValue) && isFinite(fxValue) && (
            <ReferenceDot x={xValue} y={fxValue} r={5} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={2} isFront={true} />
          )}
           {/* Vertical line at x=0 if area is shown */}
           {showArea && <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
