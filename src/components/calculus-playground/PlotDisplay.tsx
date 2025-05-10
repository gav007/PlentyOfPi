
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
  areaData: { x: number; y: number | null }[]; 
  xValue: number;
  fxValue: number; // Value of f(x) at current xValue (slider/click)
  fpxValue: number; // Value of f'(x) at current xValue (slider/click)
  showTangent: boolean;
  showArea: boolean;
  showFullDerivativeCurve: boolean;
  domain: { xMin: number; xMax: number; yMin: number | 'auto'; yMax: number | 'auto' };
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
    const y0 = fxValue; // f(x_slider)
    const x0 = xValue; // x_slider
    const m = fpxValue; // f'(x_slider)

    // Calculate y values at the domain boundaries using the tangent line equation y - y0 = m(x - x0)
    const yAtDomainMin = m * (domain.xMin - x0) + y0;
    const yAtDomainMax = m * (domain.xMax - x0) + y0;
    
    return [
      { x: domain.xMin, y: yAtDomainMin },
      { x: domain.xMax, y: yAtDomainMax },
    ];
  }, [showTangent, xValue, fxValue, fpxValue, domain.xMin, domain.xMax]);


  const handleChartClick = (chartData: any) => {
    if (chartData && chartData.activeCoordinate && typeof chartData.activeCoordinate.x === 'number') {
      onXValueChangeByClick(chartData.activeCoordinate.x); 
    } else if (chartData && typeof chartData.activeLabel === 'number') { 
      onXValueChangeByClick(chartData.activeLabel);
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length && label !== undefined) {
      const currentX = Number(label);
      // Find the corresponding f(x) value from plotData for the hovered point
      const hoveredFData = payload.find(p => p.name === "f(x)");
      const hoveredFValue = hoveredFData?.value;

      // Find the corresponding f'(x) value from derivativePlotData for the hovered point
      const hoveredFPrimeData = payload.find(p => p.name === "f'(x) full");
      const hoveredFPrimeValue = hoveredFPrimeData?.value;
      
      // The integral value is a cumulative value up to xValue (slider pos), not point-specific for hover.
      // It's better displayed in ResultPanel. Here, we show point-specific values.

      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg text-sm">
          <p className="font-semibold">{`x: ${currentX.toFixed(3)}`}</p>
          {hoveredFValue !== undefined && isFinite(Number(hoveredFValue)) && (
             <p style={{ color: payload.find(p => p.name === "f(x)")?.stroke || 'hsl(var(--primary))' }}>
              {`f(x): ${Number(hoveredFValue).toFixed(3)}`}
            </p>
          )}
           {showFullDerivativeCurve && hoveredFPrimeValue !== undefined && isFinite(Number(hoveredFPrimeValue)) && (
             <p style={{ color: payload.find(p => p.name === "f'(x) full")?.stroke || 'hsl(var(--chart-2))' }}>
              {`f'(x): ${Number(hoveredFPrimeValue).toFixed(3)}`}
            </p>
          )}
           {payload.find(item => item.name === "Tangent") && !isNaN(fpxValue) && (
             <p style={{ color: 'hsl(var(--destructive))' }}>
               {`Tangent slope: ${fpxValue.toFixed(3)} (at x=${xValue.toFixed(3)})`}
             </p>
           )}
        </div>
      );
    }
    return null;
  };
  
  const yAxisDomainConfig: [number | 'auto', number | 'auto'] = [domain.yMin, domain.yMax];

  return (
    <div 
      className="w-full rounded-md border border-input bg-background/30 p-4 shadow-inner aspect-[2.2/1] min-h-[400px] cursor-pointer"
      title="Click on graph to set x-value"
      role="application" 
      aria-label="Interactive calculus graph. Click to set x-value."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} // Adjusted left margin for y-axis labels
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
            name="x"
          />
          <YAxis 
            type="number" // Ensure YAxis is treated as numeric for domain prop
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => Number(tick).toFixed(Math.abs(Number(domain.yMax) - Number(domain.yMin)) > 20 || Math.abs(Number(domain.yMax) - Number(domain.yMin)) < 0.1 ? 0 : 1)} 
            domain={yAxisDomainConfig} 
            allowDataOverflow 
            padding={{ top: 20, bottom: 20 }}
            name="f(x)"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '3 3' }}/>
          
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" ifOverflow="visible" />
          <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" ifOverflow="visible" />

          {showArea && areaData.length > 1 && ( 
             <Area 
                type="monotone" 
                dataKey="y" 
                data={areaData} 
                fill="hsl(var(--accent))" // Using accent for area fill
                stroke="none" // No stroke for the area itself
                fillOpacity={0.4} 
                name="∫f(x)dx Area" // This name will appear in tooltip legend if enabled
                connectNulls={true} // Connects over null/NaN points in areaData if any
                baseValue={0} // Shades area towards y=0 (the x-axis)
            />
          )}

          <Line type="monotone" dataKey="y" data={plotData} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls={true} name="f(x)" />

          {showFullDerivativeCurve && derivativePlotData.length > 0 && (
            <Line type="monotone" dataKey="y" data={derivativePlotData} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls={true} name="f'(x) full" strokeDasharray="5 5" />
          )}
          
          {showTangent && tangentLineData.length > 0 && !isNaN(fxValue) && isFinite(fxValue) && (
            <Line type="linear" dataKey="y" data={tangentLineData} stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} name="Tangent" />
          )}
          
          {/* ReferenceDot for the point (xValue, fxValue) on the main f(x) curve */}
          {!isNaN(fxValue) && isFinite(fxValue) && 
           xValue >= domain.xMin && xValue <= domain.xMax &&
           (typeof domain.yMin === 'string' || (fxValue >= domain.yMin && fxValue <= (domain.yMax as number))) && // Check if point is within Y domain if numeric
           (
            <ReferenceDot 
              x={xValue} 
              y={fxValue} 
              r={5} 
              fill="hsl(var(--primary))" 
              stroke="hsl(var(--background))" 
              strokeWidth={2} 
              isFront={true} 
              ifOverflow="visible" 
              aria-label={`Current point at x=${xValue.toFixed(2)}, f(x)=${fxValue.toFixed(2)}`}
            />
          )}
           
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
