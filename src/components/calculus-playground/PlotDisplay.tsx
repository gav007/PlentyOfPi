
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
  TooltipProps, 
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { cn } from '@/lib/utils';

interface PlotDisplayProps {
  plotData: { x: number; y: number | null }[];
  derivativePlotData: { x: number; y: number | null }[];
  areaData: { x: number; y: number | null }[]; // Data for integral area
  xValue: number;
  fxValue: number;
  fpxValue: number; 
  showTangent: boolean;
  showArea: boolean;
  showFullDerivativeCurve: boolean;
  domain: { xMin: number; xMax: number; yMin: number | 'auto'; yMax: number | 'auto' }; // yMin/yMax can be numbers or 'auto' if resolved by parent
  onXValueChangeByClick: (newX: number) => void;
}

export default function PlotDisplay({
  plotData,
  derivativePlotData,
  areaData,
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
    if (!showTangent || isNaN(fxValue) || isNaN(fpxValue) || !isFinite(fxValue) || !isFinite(fpxValue) || domain.xMin >= domain.xMax) return [];
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

  // Area data is now passed as a prop, no need for local calculation here.

  const handleChartClick = (chartData: any) => {
    if (chartData && chartData.activeCoordinate && typeof chartData.activeCoordinate.x === 'number') {
      const clickedX = Math.max(domain.xMin, Math.min(domain.xMax, chartData.activeCoordinate.x));
      onXValueChangeByClick(clickedX);
    } else if (chartData && typeof chartData.activeLabel === 'number') {
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
  
  const yAxisDomainConfig: [number | 'auto', number | 'auto'] = [domain.yMin, domain.yMax];


  return (
    <div className="w-full rounded-md border border-input bg-background/30 p-4 shadow-inner aspect-[2/1] min-h-[400px] cursor-pointer" title="Click on graph to set x-value">
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
            domain={yAxisDomainConfig} 
            allowDataOverflow 
            padding={{ top: 20, bottom: 20 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '3 3' }}/>
          
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" ifOverflow="visible" />
          <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" ifOverflow="visible" />

          {showArea && areaData.length > 0 && (
             <Area 
                type="monotone" 
                dataKey="y" 
                data={areaData} 
                fill="hsl(var(--chart-3))" 
                stroke="hsl(var(--chart-3))" 
                fillOpacity={0.4} 
                strokeWidth={0} 
                name="∫f(x)dx" 
                connectNulls={false} 
                baseValue={0} 
            />
          )}

          <Line type="monotone" dataKey="y" data={plotData} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls={false} name="f(x)" />

          {showFullDerivativeCurve && derivativePlotData.length > 0 && (
            <Line type="monotone" dataKey="y" data={derivativePlotData} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls={false} name="f'(x) full" strokeDasharray="5 5" />
          )}
          
          {showTangent && tangentLineData.length > 0 && !isNaN(fxValue) && isFinite(fxValue) && (
            <Line type="linear" dataKey="y" data={tangentLineData} stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} name="Tangent" />
          )}
          
          {!isNaN(fxValue) && isFinite(fxValue) && xValue >= domain.xMin && xValue <= domain.xMax && (
            <ReferenceDot x={xValue} y={fxValue} r={5} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={2} isFront={true} ifOverflow="visible" />
          )}
           
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
