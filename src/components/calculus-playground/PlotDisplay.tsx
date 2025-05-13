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
import type { DomainOptions } from './FunctionInput';

interface PlotDisplayProps {
  plotData: { x: number; y: number | null }[];
  derivativePlotData: { x: number; y: number | null }[];
  areaData: { x: number; y: number | null }[];
  xValue: number;
  fxValue: number; 
  fpxValue: number; 
  showTangent: boolean;
  showArea: boolean;
  showFullDerivativeCurve: boolean;
  domain: { xMin: number; xMax: number; yMin: number | 'auto'; yMax: number | 'auto' };
  onXValueChangeByClick: (newX: number) => void;
  onDomainChange: (newDomain: Partial<DomainOptions>) => void; // New prop
}

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
  onDomainChange, // Destructure new prop
}: PlotDisplayProps) {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const [chartLayout, setChartLayout] = React.useState<any>(null);


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
    if (chartData && chartData.activeCoordinate && typeof chartData.activeCoordinate.x === 'number') {
      onXValueChangeByClick(chartData.activeCoordinate.x);
    } else if (chartData && typeof chartData.activeLabel === 'number') {
      onXValueChangeByClick(chartData.activeLabel);
    }
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length && label !== undefined) {
      const currentX = Number(label);
      const fDataPoint = payload.find(p => p.name === "f(x)");
      const fValueAtHover = fDataPoint?.value;
      
      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg text-sm">
          <p className="font-semibold">{`x: ${currentX.toFixed(3)}`}</p>
          {fValueAtHover !== undefined && isFinite(Number(fValueAtHover)) && (
             <p style={{ color: 'hsl(var(--primary))' }}>
              {`f(x): ${Number(fValueAtHover).toFixed(3)}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const yAxisDomainConfig: [number | 'auto', number | 'auto'] = [domain.yMin, domain.yMax];
  
  const xRange = domain.xMax - domain.xMin;
  const yRangeEffective = (typeof domain.yMax === 'number' && typeof domain.yMin === 'number') ? (domain.yMax - domain.yMin) : 20;


  // Zoom handler
  const handleWheelZoom = React.useCallback((event: WheelEvent) => {
    event.preventDefault();
    if (!chartLayout || !chartLayout.xAxisMap || !chartLayout.xAxisMap[0] || !chartLayout.xAxisMap[0].scale) {
        // console.warn("Chart layout or xAxisMap not available for zoom.");
        return;
    }
    
    const { offsetX } = event;
    const chartRect = chartContainerRef.current?.getBoundingClientRect();
    if (!chartRect) return;

    const mouseXInChartPixels = offsetX - chartLayout.offset.left; // Ensure 'offset' is part of your chartLayout if it exists
                                                                 // Or, if offsetX is already relative to the chart SVG, this adjustment isn't needed.
                                                                 // Let's assume offsetX is relative to chartContainerRef for simplicity if no specific chart-internal offset is available.

    const xCoord = chartLayout.xAxisMap[0].scale.invert(mouseXInChartPixels);

    const zoomIntensity = 0.1;
    const direction = event.deltaY < 0 ? 1 : -1; 

    let { xMin, xMax } = domain;
    xMin = Number(xMin);
    xMax = Number(xMax);

    const newXMin = xMin + (xCoord - xMin) * direction * zoomIntensity;
    const newXMax = xMax - (xMax - xCoord) * direction * zoomIntensity;

    if (newXMin < newXMax) {
      onDomainChange({ 
        xMin: newXMin.toString(), 
        xMax: newXMax.toString(),
        // Decide on Y-axis behavior: auto-scale or fixed ratio or independent Y zoom
        yMin: 'auto', // Or implement Y zoom based on event.offsetY and yAxisMap
        yMax: 'auto'
      });
    }
  }, [chartLayout, domain, onDomainChange]);

  React.useEffect(() => {
    const container = chartContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheelZoom, { passive: false });
      return () => container.removeEventListener('wheel', handleWheelZoom);
    }
  }, [handleWheelZoom]); // Re-attach if handleWheelZoom changes (due to its own dependencies)


  return (
    <div
      ref={chartContainerRef}
      className="w-full rounded-md border border-input bg-background/30 p-4 shadow-inner aspect-[2.2/1] min-h-[400px] cursor-grab active:cursor-grabbing"
      title="Click on graph to set x-value, scroll to zoom X-axis"
      role="application"
      aria-label="Interactive calculus graph. Click to set x-value. Scroll to zoom."
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            onClick={handleChartClick}
            onMouseMove={(e: any) => { // Capture layout info from Recharts event
                if (e && e.chartX && e.chartY && e.xAxisMap && e.yAxisMap && e.chartWidth && e.chartHeight && e.offset) {
                    // Only update if significantly different or not set, to avoid too many re-renders
                    if (!chartLayout || 
                        chartLayout.chartX !== e.chartX || 
                        chartLayout.chartWidth !== e.chartWidth ||
                        !chartLayout.xAxisMap || !chartLayout.yAxisMap ) { // Basic check
                       setChartLayout({
                           chartX: e.chartX, 
                           chartY: e.chartY, 
                           chartWidth: e.chartWidth, 
                           chartHeight: e.chartHeight,
                           xAxisMap: e.xAxisMap,
                           yAxisMap: e.yAxisMap,
                           offset: e.offset // Recharts provides an offset object {top, left, right, bottom, width, height}
                       });
                    }
                }
            }}
            // Reset chartLayout if domain changes significantly to ensure map is re-captured
            // This is tricky, might need a key on LineChart based on domainOptions to force remount of chart internals
            // For now, we assume onMouseMove will update it sufficiently.
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

          <Line type="monotone" dataKey="y" data={plotData} stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls={false} name="f(x)" isAnimationActive={false} />

          {showFullDerivativeCurve && derivativePlotData.length > 0 && (
            <Line type="monotone" dataKey="y" data={derivativePlotData} stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls={false} name="f'(x) full" strokeDasharray="5 5" isAnimationActive={false}/>
          )}

          {showTangent && tangentLineData.length > 0 && !isNaN(fxValue) && isFinite(fxValue) && (
            <Line type="linear" dataKey="y" data={tangentLineData} stroke="hsl(var(--destructive))" strokeWidth={1.5} dot={false} name="Tangent" isAnimationActive={false} />
          )}

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
