
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
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { ExpressionPlotData } from '@/types/graphing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Expand, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card'; // Ensure Card is imported

interface GraphCanvasProps {
  plotData: ExpressionPlotData[];
  domain: { xMin: number; xMax: number };
  range: { yMin: number | 'auto'; yMax: number | 'auto' };
  onDomainChange: (newDomain: { xMin: number; xMax: number }) => void;
  onRangeChange: (newRange: { yMin: number | 'auto'; yMax: number | 'auto' }) => void;
}

const INITIAL_DOMAIN = { xMin: -10, xMax: 10 };
const INITIAL_RANGE = { yMin: -10, yMax: 10 };

export default function GraphCanvas({
  plotData,
  domain,
  range,
  onDomainChange,
  onRangeChange,
}: GraphCanvasProps) {
  const [tempDomain, setTempDomain] = React.useState(domain);
  const [tempRange, setTempRange] = React.useState(range);
  const chartRef = React.useRef<any>(null); // For accessing chart instance for potential direct interactions

  React.useEffect(() => setTempDomain(domain), [domain]);
  React.useEffect(() => setTempRange(range), [range]);

  const handleApplyViewChanges = () => {
    const newXMin = parseFloat(String(tempDomain.xMin));
    const newXMax = parseFloat(String(tempDomain.xMax));
    const newYMinStr = String(tempRange.yMin).toLowerCase();
    const newYMaxStr = String(tempRange.yMax).toLowerCase();

    if (!isNaN(newXMin) && !isNaN(newXMax) && newXMin < newXMax) {
      onDomainChange({ xMin: newXMin, xMax: newXMax });
    }
    
    let processedYMin: number | 'auto' = newYMinStr === 'auto' ? 'auto' : parseFloat(newYMinStr);
    let processedYMax: number | 'auto' = newYMaxStr === 'auto' ? 'auto' : parseFloat(newYMaxStr);

    if (typeof processedYMin === 'number' && isNaN(processedYMin)) processedYMin = 'auto';
    if (typeof processedYMax === 'number' && isNaN(processedYMax)) processedYMax = 'auto';
    
    if (typeof processedYMin === 'number' && typeof processedYMax === 'number' && processedYMin >= processedYMax) {
      // Invalid range, perhaps revert or alert, for now just don't apply y change
    } else {
      onRangeChange({ yMin: processedYMin, yMax: processedYMax });
    }
  };

  const handleResetView = () => {
    setTempDomain(INITIAL_DOMAIN);
    setTempRange(INITIAL_RANGE);
    onDomainChange(INITIAL_DOMAIN);
    onRangeChange(INITIAL_RANGE);
  };
  
  const handleZoom = (factor: number) => {
    const xCenter = (tempDomain.xMin + tempDomain.xMax) / 2;
    const yCenter = (typeof tempRange.yMin === 'number' && typeof tempRange.yMax === 'number') ? (tempRange.yMin + tempRange.yMax) / 2 : 0;

    const newXMin = xCenter - (xCenter - tempDomain.xMin) * factor;
    const newXMax = xCenter + (tempDomain.xMax - xCenter) * factor;
    
    let newYMin: number | 'auto' = tempRange.yMin;
    let newYMax: number | 'auto' = tempRange.yMax;

    if (typeof tempRange.yMin === 'number' && typeof tempRange.yMax === 'number') {
        newYMin = yCenter - (yCenter - tempRange.yMin) * factor;
        newYMax = yCenter + (tempRange.yMax - yCenter) * factor;
    } // If 'auto', let Recharts handle it or implement smarter auto-scaling based on data

    setTempDomain({ xMin: newXMin, xMax: newXMax });
    setTempRange({ yMin: newYMin, yMax: newYMax });
    // Apply immediately for zoom/pan for responsiveness
    onDomainChange({ xMin: newXMin, xMax: newXMax });
    onRangeChange({yMin: newYMin, yMax: newYMax});
  };

  const handlePan = (dxPercent: number, dyPercent: number) => {
    const xRange = tempDomain.xMax - tempDomain.xMin;
    const dx = xRange * dxPercent;
    
    const newXMin = tempDomain.xMin + dx;
    const newXMax = tempDomain.xMax + dx;

    let newYMin: number | 'auto' = tempRange.yMin;
    let newYMax: number | 'auto' = tempRange.yMax;

    if (typeof tempRange.yMin === 'number' && typeof tempRange.yMax === 'number') {
      const yRangeVal = tempRange.yMax - tempRange.yMin;
      const dy = yRangeVal * dyPercent;
      newYMin = tempRange.yMin + dy;
      newYMax = tempRange.yMax + dy;
    }
    
    setTempDomain({ xMin: newXMin, xMax: newXMax });
    setTempRange({ yMin: newYMin, yMax: newYMax });
    onDomainChange({ xMin: newXMin, xMax: newXMax });
    onRangeChange({yMin: newYMin, yMax: newYMax});
  };


  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/90 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg text-xs">
          <p className="font-semibold mb-1">x: {Number(label).toFixed(3)}</p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} style={{ color: entry.stroke }} className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full inline-block" style={{backgroundColor: entry.stroke}}></span>
              {`${entry.name || entry.dataKey}: ${Number(entry.value).toFixed(3)}`}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Drag to pan logic
  const dragStartRef = React.useRef<{x: number, y: number} | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (chartRef.current) {
        const { chartX, chartY } = chartRef.current.getInternalState().offset; // Approx
        dragStartRef.current = { x: e.clientX - chartX, y: e.clientY - chartY};
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (dragStartRef.current && chartRef.current) {
        const { chartX, chartY, width, height } = chartRef.current.getInternalState().offset;
        const currentX = e.clientX - chartX;
        // const currentY = e.clientY - chartY; // Y-axis pan not fully implemented this way

        const dx = currentX - dragStartRef.current.x;
        // const dy = currentY - dragStartRef.current.y;
        
        if (width && height) { // Ensure width and height are available
            handlePan(-dx / width, 0); // Pan only X for now: dy / height
        }

        dragStartRef.current = { x: currentX, y: e.clientY - chartY};
      }
  };
  
  const handleMouseUp = () => {
    dragStartRef.current = null;
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1; // Zoom in if deltaY is negative
    handleZoom(zoomFactor);
  };


  return (
    <div className="space-y-4">
      <Card className="bg-muted/20 p-4 shadow-inner">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <div>
            <Label htmlFor="xMin" className="text-xs">X Min</Label>
            <Input id="xMin" type="number" value={String(tempDomain.xMin)} onChange={e => setTempDomain(d => ({...d, xMin: parseFloat(e.target.value) || d.xMin}))} className="h-8 text-sm"/>
          </div>
          <div>
            <Label htmlFor="xMax" className="text-xs">X Max</Label>
            <Input id="xMax" type="number" value={String(tempDomain.xMax)} onChange={e => setTempDomain(d => ({...d, xMax: parseFloat(e.target.value) || d.xMax}))} className="h-8 text-sm"/>
          </div>
          <div>
            <Label htmlFor="yMin" className="text-xs">Y Min</Label>
            <Input id="yMin" type="text" value={String(tempRange.yMin)} onChange={e => setTempRange(r => ({...r, yMin: e.target.value.toLowerCase() === 'auto' ? 'auto' : parseFloat(e.target.value) || r.yMin}))} className="h-8 text-sm" placeholder="auto"/>
          </div>
          <div>
            <Label htmlFor="yMax" className="text-xs">Y Max</Label>
            <Input id="yMax" type="text" value={String(tempRange.yMax)} onChange={e => setTempRange(r => ({...r, yMax: e.target.value.toLowerCase() === 'auto' ? 'auto' : parseFloat(e.target.value) || r.yMax}))} className="h-8 text-sm" placeholder="auto"/>
          </div>
          <Button onClick={handleApplyViewChanges} size="sm" className="h-8 w-full text-xs md:mt-0 mt-2 col-span-2 md:col-span-1">Apply View</Button>
        </div>
        <div className="flex gap-2 mt-3 justify-center">
            <Button onClick={() => handleZoom(0.8)} variant="outline" size="sm" title="Zoom In"><ZoomIn className="w-4 h-4"/></Button>
            <Button onClick={() => handleZoom(1.25)} variant="outline" size="sm" title="Zoom Out"><ZoomOut className="w-4 h-4"/></Button>
            <Button onClick={handleResetView} variant="outline" size="sm" title="Reset View"><RefreshCw className="w-4 h-4"/></Button>
        </div>
      </Card>

      <div 
        className="w-full aspect-[4/3] min-h-[300px] sm:min-h-[400px] md:min-h-[450px] bg-background rounded-md shadow-lg border cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop panning if mouse leaves chart
        onWheel={handleWheel}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            ref={chartRef}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[tempDomain.xMin, tempDomain.xMax]}
              allowDataOverflow
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(tick) => Number(tick).toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:1})}
              label={{ value: 'x', position: 'insideBottomRight', offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              type="number"
              domain={[tempRange.yMin, tempRange.yMax]}
              allowDataOverflow
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(tick) => Number(tick).toLocaleString(undefined, {minimumFractionDigits:0, maximumFractionDigits:1})}
              label={{ value: 'y', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} ifOverflow="visible"/>
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeWidth={0.5} ifOverflow="visible"/>

            {plotData.map((series) => (
              <Line
                key={series.id}
                type="monotone"
                dataKey="y"
                data={series.points}
                stroke={series.color}
                strokeWidth={2}
                dot={false}
                name={series.value || `f${plotData.findIndex(p => p.id === series.id) + 1}(x)`}
                connectNulls={false} // Important for functions with discontinuities
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
