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

// Helper function for adaptive tick formatting
const formatTick = (tick: number, range: number): string => {
  if (isNaN(tick)) return '';
  if (range === 0) return tick.toFixed(2);
  if (Math.abs(range) >= 100) return tick.toFixed(0);
  if (Math.abs(range) >= 10) return tick.toFixed(1);
  if (Math.abs(range) < 1 && Math.abs(range) > 0) return tick.toFixed(3);
  return tick.toFixed(2);
};


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

  React.useEffect(() => {
    // console.log(
    //   'areaData (first 10 points):', areaData.slice(0, 10),
    //   'Total points:', areaData.length
    // );
  }, [areaData]);

  const tangentLineData = React.useMemo(() => {
    if (!showTangent || isNaN(fxValue) || isNaN(fpxValue) || !isFinite(fxValue) || !isFinite(fpxValue) || domain.xMin >= domain.xMax) return [];
    const y0 = fxValue; 
    const x0 = xValue; 
    const m = fpxValue; 

    const yAtDomainMin = m * (domain.xMin - x0) + y0;
    const yAtDomainMax = m * (domain.xMax - x0) + y0;

    return [
      { x: domain.xMin, y: yAtDomainMin },
      { x: domain.xMax, y: yAtDomainMax },
    ];
  }, [showTangent, xValue, fxValue, fpxValue, domain.xMin, domain.xMax]);


  const handleChartClick = (chartData: any) => {
    console.log("Calculus Plot: Chart click data received:", chartData);
    if (chartData && chartData.activeCoordinate && typeof chartData.activeCoordinate.x === 'number') {
      console.log("Calculus Plot: Clicked x (from activeCoordinate):", chartData.activeCoordinate.x);
      onXValueChangeByClick(chartData.activeCoordinate.x);
    } else if (chartData && typeof chartData.activeLabel === 'number') {
      // Fallback if activeCoordinate is not available but activeLabel (x-value) is
      console.log("Calculus Plot: Clicked x (from activeLabel):", chartData.activeLabel);
      onXValueChangeByClick(chartData.activeLabel);
    } else {
      console.warn("Calculus Plot: Could not determine clicked x-coordinate from chartData.");
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length && label !== undefined) {
      const currentX = Number(label);
      // Find the f(x) value from the payload, which corresponds to the main plotData series
      const fDataPoint = payload.find(p => p.name === "f(x)");
      const fValueAtHover = fDataPoint?.value;
      
      // Find ∫f(x)dx value from the payload, if area is shown
      // The area data might not directly appear in tooltip payload unless specifically configured
      // For now, we'll show the global integralVal passed to ResultPanel, not specific to hover.
      // If you want integral at hover, areaData needs 'integral_at_x' field or similar.
      // This tooltip is primarily for f(x) and derivative at hover point.

      // Calculate derivative at this specific hover point 'currentX' if showFullDerivativeCurve
      // This is complex as derivativePlotData needs to be searched or re-calculated.
      // For simplicity, the current tooltip structure is fine.
      // The main derivative fpxValue (at slider xValue) is shown in ResultPanel.


      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg text-sm">
          <p className="font-semibold">{`x: ${currentX.toFixed(3)}`}</p>
          {fValueAtHover !== undefined && isFinite(Number(fValueAtHover)) && (
             <p style={{ color: 'hsl(var(--primary))' }}>
              {`f(x): ${Number(fValueAtHover).toFixed(3)}`}
            </p>
          )}
           {/* To show derivative from full curve at hover, you'd search derivativePlotData here */}
        </div>
      );
    }
    return null;
  };

  const yAxisDomainConfig: [number | 'auto', number | 'auto'] = [domain.yMin, domain.yMax];
  
  const xRange = domain.xMax - domain.xMin;
  const yRangeEffective = (typeof domain.yMax === 'number' && typeof domain.yMin === 'number') ? (domain.yMax - domain.yMin) : 20; // Default if auto


  return (
    <div
      className="w-full rounded-md border border-input bg-background/30 p-4 shadow-inner aspect-[2.2/1] min-h-[400px] cursor-pointer"
      title="Click on graph to set x-value"
      role="application"
      aria-label="Interactive calculus graph. Click to set x-value."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }} // Adjusted left margin for Y-axis labels
            onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.5)" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[domain.xMin, domain.xMax]}
            allowDataOverflow
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => formatTick(Number(tick), xRange)}
            name="x"
          />
          <YAxis
            type="number"
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(tick) => formatTick(Number(tick), yRangeEffective)}
            domain={yAxisDomainConfig}
            allowDataOverflow
            padding={{ top: 10, bottom: 10 }}
            name="f(x)"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeDasharray: '3 3' }}/>

          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" ifOverflow="visible" />
          <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" ifOverflow="visible" />

          {/* 1. Shaded integration area under f(x) */}
          {showArea && areaData.length > 0 && (
             <Area
                type="monotone"
                dataKey="y"
                data={areaData}
                fill="hsl(var(--primary))" 
                stroke="none"
                fillOpacity={0.4}
                connectNulls={false} 
                baseValue={0}
                isAnimationActive={false}
                name="∫f(x)dx"
            />
          )}

          {/* 2. Main function curve */}
          <Line type="monotone" dataKey="y" data={plotData} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls={false} name="f(x)" isAnimationActive={false} />

          {/* 3. Full derivative curve (dashed) */}
          {showFullDerivativeCurve && derivativePlotData.length > 0 && (
            <Line type="monotone" dataKey="y" data={derivativePlotData} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls={true} name="f'(x) full" strokeDasharray="5 5" isAnimationActive={false}/>
          )}

          {/* 4. Tangent line at current xValue */}
          {showTangent && tangentLineData.length > 0 && !isNaN(fxValue) && isFinite(fxValue) && (
            <Line type="linear" dataKey="y" data={tangentLineData} stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} name="Tangent" isAnimationActive={false} />
          )}

          {/* 5. Current point marker */}
          {!isNaN(fxValue) && isFinite(fxValue) && xValue >= domain.xMin && xValue <= domain.xMax && (
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
