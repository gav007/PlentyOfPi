
'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

interface WaveformPlotProps {
  fullWaveformPath: Array<{ x: number; y: number }>; // x is time, y is f(t)
  tracedWaveformPath: Array<{ x: number; y: number }>; // Points traced by animation
  currentTime: number;    // Current time for the drawing head
  currentValue: number;   // Current value f(currentTime)
  timePeriod: number;     // e.g., 2 * Math.PI
  width: number;
  height: number;
}

const WaveformPlot: React.FC<WaveformPlotProps> = ({
  fullWaveformPath,
  tracedWaveformPath,
  currentTime,
  currentValue,
  timePeriod,
  width,
  height
}) => {

  // Determine Y-axis domain dynamically or set fixed
  const yValues = fullWaveformPath.map(p => p.y);
  const yMin = Math.min(...yValues, -1.5); // Ensure at least -1.5 to 1.5 range
  const yMax = Math.max(...yValues, 1.5);
  const yDomain = [Math.floor(yMin * 10) / 10, Math.ceil(yMax * 10) / 10];


  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className="border rounded-md bg-background shadow-inner">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
            data={fullWaveformPath} // Use full path for defining chart scale and background wave
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, timePeriod]}
            ticks={[0, timePeriod / 4, timePeriod / 2, (3 * timePeriod) / 4, timePeriod]}
            tickFormatter={(tick) => {
              if (tick === 0) return '0';
              if (Math.abs(tick - timePeriod / 2) < 0.01) return 'π';
              if (Math.abs(tick - timePeriod) < 0.01) return '2π';
              if (Math.abs(tick - timePeriod / 4) < 0.01) return 'π/2';
              if (Math.abs(tick - (3*timePeriod) / 4) < 0.01) return '3π/2';
              return '';
            }}
            stroke="hsl(var(--muted-foreground))"
            label={{ value: "t (time)", position: "insideBottomRight", offset: -5, fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis 
            domain={yDomain} 
            stroke="hsl(var(--muted-foreground))"
            label={{ value: "f(t)", angle: -90, position: "insideLeft", fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip 
            labelFormatter={(label) => `t = ${Number(label).toFixed(2)}`}
            formatter={(value: any) => [Number(value).toFixed(3), "f(t)"]}
            contentStyle={{backgroundColor: 'hsl(var(--background)/0.8)', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
            itemStyle={{color: 'hsl(var(--foreground))'}}
            cursor={{stroke: 'hsl(var(--primary))', strokeDasharray: '3 3'}}
          />
          
          {/* Full waveform (dimmed background) */}
          <Line type="monotone" dataKey="y" stroke="hsl(var(--muted))" dot={false} strokeWidth={1.5} isAnimationActive={false} />

          {/* Traced waveform (animated part) */}
          {tracedWaveformPath.length > 0 && (
            <Line type="monotone" dataKey="y" data={tracedWaveformPath} stroke="hsl(var(--primary))" dot={false} strokeWidth={2.5} isAnimationActive={false}/>
          )}

          {/* Drawing head / Current point on waveform */}
          <ReferenceDot
            x={currentTime}
            y={currentValue}
            r={4}
            fill="hsl(var(--destructive))"
            stroke="hsl(var(--background))"
            strokeWidth={1}
            isFront={true}
            ifOverflow="visible"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaveformPlot;
