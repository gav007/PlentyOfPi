'use client';

import React, { useRef, useEffect, useState } from 'react';

interface SineWavePlotProps {
  angle: number; // in radians
  height: number;
}

const SineWavePlot: React.FC<SineWavePlotProps> = ({ angle, height }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (width === 0) {
    return <div ref={containerRef} style={{ height: `${height}px` }} className="w-full bg-muted/30 rounded-md animate-pulse"></div>;
  }

  const padding = 20; // Padding around the graph
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;
  
  const xMax = 2 * Math.PI; // Show one full cycle
  const yRange = 2; // sin goes from -1 to 1

  const scaleX = graphWidth / xMax;
  const scaleY = graphHeight / yRange;
  
  const originX = padding;
  const originY = padding + graphHeight / 2;

  // Generate path data for the full sine wave
  let fullWavePathData = `M ${originX} ${originY - Math.sin(0) * scaleY}`;
  const segments = 100;
  for (let i = 1; i <= segments; i++) {
    const xRad = (i / segments) * xMax;
    const yRad = Math.sin(xRad);
    fullWavePathData += ` L ${originX + xRad * scaleX} ${originY - yRad * scaleY}`;
  }

  // Generate path data for the highlighted portion up to the current angle
  let activeWavePathData = `M ${originX} ${originY - Math.sin(0) * scaleY}`;
  const activeSegments = Math.max(2, Math.ceil((angle / xMax) * segments)); // Ensure at least 2 segments for a line
  
  // Cap angle at xMax for drawing
  const displayAngle = Math.min(angle, xMax);

  if (displayAngle > 0) {
    for (let i = 1; i <= activeSegments; i++) {
      const xRad = (i / activeSegments) * displayAngle;
      // ensure xRad does not exceed displayAngle for the last point due to floating point issues
      const currentXRad = Math.min(xRad, displayAngle);
      const yRad = Math.sin(currentXRad);
      activeWavePathData += ` L ${originX + currentXRad * scaleX} ${originY - yRad * scaleY}`;
    }
  } else if (displayAngle === 0) { // Draw a tiny segment at 0 if angle is 0
     activeWavePathData += ` L ${originX + 0.001 * scaleX} ${originY - Math.sin(0.001) * scaleY}`;
  }


  const currentPointX = originX + displayAngle * scaleX;
  const currentPointY = originY - Math.sin(displayAngle) * scaleY;

  const xTicks = [0, Math.PI/2, Math.PI, 3*Math.PI/2, 2*Math.PI];
  const xTickLabels = ["0", "π/2", "π", "3π/2", "2π"];
  const yTicks = [-1, -0.5, 0, 0.5, 1];


  return (
    <div ref={containerRef} className="w-full">
      <svg width={width} height={height} aria-label="Sine wave graph representing sin(θ) from 0 to current angle θ">
        {/* Axes */}
        <line x1={padding} y1={originY} x2={width - padding} y2={originY} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
        <line x1={originX} y1={padding} x2={originX} y2={height - padding} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />

        {/* X-axis Ticks and Labels */}
        {xTicks.map((tick, i) => (
          <g key={`x-tick-${i}`}>
            <line
              x1={originX + tick * scaleX}
              y1={originY - 3}
              x2={originX + tick * scaleX}
              y2={originY + 3}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1"
            />
            <text
              x={originX + tick * scaleX}
              y={originY + 15}
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              textAnchor="middle"
            >
              {xTickLabels[i]}
            </text>
          </g>
        ))}
        
        {/* Y-axis Ticks and Labels */}
        {yTicks.map((tick, i) => (
          <g key={`y-tick-${i}`}>
            <line
              x1={originX - 3}
              y1={originY - tick * scaleY}
              x2={originX + 3}
              y2={originY - tick * scaleY}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1"
            />
            {tick !== 0 && ( /* Avoid double-labeling origin */
              <text
                x={originX - 8}
                y={originY - tick * scaleY + 3} /* Adjust for baseline */
                fontSize="10"
                fill="hsl(var(--muted-foreground))"
                textAnchor="end"
              >
                {tick}
              </text>
            )}
          </g>
        ))}


        {/* Full sine wave (dimmed) */}
        <path d={fullWavePathData} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />

        {/* Active part of the sine wave */}
        <path d={activeWavePathData} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />

        {/* Point indicating current angle on the wave */}
        <circle cx={currentPointX} cy={currentPointY} r="4" fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
};

export default SineWavePlot;
