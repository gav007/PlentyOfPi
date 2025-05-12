
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
  Legend,
  TooltipProps,
} from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { PlotData, Expression } from '@/types/graphing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

interface GraphCanvasProps {
  plotData: PlotData[];
  expressions: Expression[];
  domain: { xMin: number; xMax: number };
  range: { yMin: number | 'auto'; yMax: number | 'auto' };
  onDomainChange: (newDomain: { xMin: number, xMax: number }) => void;
  onRangeChange: (newRange: { yMin: number | 'auto', yMax: number | 'auto' }) => void;
}

// Helper for formatting ticks, can be expanded
const formatTick = (tick: any) => (typeof tick === 'number' ? tick.toFixed(1) : String(tick));

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-sm p-2 border border-border rounded-md shadow-lg text-xs">
        <p className="font-semibold mb-1">{`x: ${Number(label).toFixed(3)}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.stroke || entry.color }} className={entry.strokeWidth && entry.strokeWidth > 1 ? 'font-bold' : ''}>
            {`${entry.name || `f${index + 1}(x)`}: ${Number(entry.value).toFixed(3)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function GraphCanvas({
  plotData,
  expressions,
  domain,
  range,
  onDomainChange,
  onRangeChange,
}: GraphCanvasProps) {
  const [tempDomain, setTempDomain] = React.useState(domain);
  const [tempRange, setTempRange] = React.useState({
    yMin: String(range.yMin), 
    yMax: String(range.yMax),
  });

  React.useEffect(() => {
    setTempDomain(domain);
  }, [domain]);

  React.useEffect(() => {
    setTempRange({ yMin: String(range.yMin), yMax: String(range.yMax) });
  }, [range]);

  const handleApplyDomain = () => {
    const xMinNum = parseFloat(tempDomain.xMin.toString()); // Ensure string conversion for parseFloat
    const xMaxNum = parseFloat(tempDomain.xMax.toString());
    if (!isNaN(xMinNum) && !isNaN(xMaxNum) && xMinNum < xMaxNum) {
      onDomainChange({ xMin: xMinNum, xMax: xMaxNum });
    } else {
      alert("Invalid X domain: X Min must be less than X Max.");
    }
  };
  
  const handleApplyRange = () => {
    const yMinParsed = tempRange.yMin.toLowerCase() === 'auto' ? 'auto' : parseFloat(tempRange.yMin);
    const yMaxParsed = tempRange.yMax.toLowerCase() === 'auto' ? 'auto' : parseFloat(tempRange.yMax);

    if (typeof yMinParsed === 'number' && typeof yMaxParsed === 'number' && yMinParsed >= yMaxParsed) {
        alert("Invalid Y range: Y Min must be less than Y Max if both are numbers.");
        return;
    }
    if ((typeof yMinParsed !== 'number' && yMinParsed !== 'auto') || (typeof yMaxParsed !== 'number' && yMaxParsed !== 'auto')) {
        alert("Invalid Y range: Y Min/Max must be a number or 'auto'.");
        return;
    }
    if (isNaN(Number(yMinParsed)) && yMinParsed !== 'auto') { alert("Invalid Y Min. Must be a number or 'auto'."); return; }
    if (isNaN(Number(yMaxParsed)) && yMaxParsed !== 'auto') { alert("Invalid Y Max. Must be a number or 'auto'."); return; }

    onRangeChange({ yMin: yMinParsed, yMax: yMaxParsed });
  };

  const handleDomainInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyDomain();
    }
  };
  const handleRangeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyRange();
    }
  };


  const handleResetView = () => {
    onDomainChange({ xMin: -10, xMax: 10 });
    onRangeChange({ yMin: 'auto', yMax: 'auto' });
  };

  const visiblePlotData = plotData.filter(pd => {
    const expr = expressions.find(e => e.id === pd.id);
    return expr ? expr.visible && !expr.error : false; // Also check for error
  });

  return (
    <div className="space-y-4">
      <Card className="bg-muted/20 p-4 shadow-inner">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <div>
            <Label htmlFor="xMin" className="text-xs">X Min</Label>
            <Input id="xMin" type="number" value={tempDomain.xMin} onChange={e => setTempDomain(d => ({ ...d, xMin: parseFloat(e.target.value) || 0 }))} onKeyDown={handleDomainInputKeyDown} className="h-8 text-sm" />
          </div>
          <div>
            <Label htmlFor="xMax" className="text-xs">X Max</Label>
            <Input id="xMax" type="number" value={tempDomain.xMax} onChange={e => setTempDomain(d => ({ ...d, xMax: parseFloat(e.target.value) || 0 }))}  onKeyDown={handleDomainInputKeyDown} className="h-8 text-sm" />
          </div>
          <div>
            <Label htmlFor="yMin" className="text-xs">Y Min</Label>
            <Input id="yMin" type="text" value={tempRange.yMin} onChange={e => setTempRange(r => ({ ...r, yMin: e.target.value }))} placeholder="auto" onKeyDown={handleRangeInputKeyDown} className="h-8 text-sm" />
          </div>
          <div>
            <Label htmlFor="yMax" className="text-xs">Y Max</Label>
            <Input id="yMax" type="text" value={tempRange.yMax} onChange={e => setTempRange(r => ({ ...r, yMax: e.target.value }))} placeholder="auto" onKeyDown={handleRangeInputKeyDown} className="h-8 text-sm" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApplyDomain} size="sm" variant="outline" className="h-8 text-xs flex-1">Apply X</Button>
             <Button onClick={handleApplyRange} size="sm" variant="outline" className="h-8 text-xs flex-1">Apply Y</Button>
          </div>
        </div>
         <Button onClick={handleResetView} size="sm" variant="link" className="mt-2 text-xs px-0 h-auto">
            <RotateCcw className="mr-1 h-3 w-3" /> Reset View (-10 to 10, auto Y)
        </Button>
      </Card>

      <div className="w-full aspect-[1.5/1] min-h-[350px] md:min-h-[450px] bg-background border rounded-md shadow-lg p-2 pr-4">
        {visiblePlotData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 10, left: -20, bottom: 20 }}> {/* Increased bottom margin for X-axis label */}
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis
                type="number"
                dataKey="x"
                domain={[domain.xMin, domain.xMax]}
                tickFormatter={formatTick}
                stroke="hsl(var(--muted-foreground))"
                allowDataOverflow
                label={{ value: 'x', position: 'insideBottomRight', offset: -10, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                type="number"
                domain={[range.yMin, range.yMax]}
                tickFormatter={formatTick}
                stroke="hsl(var(--muted-foreground))"
                allowDataOverflow
                label={{ value: 'f(x)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: 40 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{fontSize: "0.75rem", paddingTop: "10px"}}/>
              {visiblePlotData.map(plot => (
                <Line
                  key={plot.id}
                  type="monotone"
                  dataKey="y"
                  data={plot.data}
                  stroke={plot.color}
                  strokeWidth={2} // Increased line thickness
                  dot={false}
                  name={expressions.find(e => e.id === plot.id)?.value || 'f(x)'}
                  isAnimationActive={false} 
                  connectNulls={true} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Enter an expression like "x^2 + sin(x)" or select an example.
          </div>
        )}
      </div>
    </div>
  );
}

