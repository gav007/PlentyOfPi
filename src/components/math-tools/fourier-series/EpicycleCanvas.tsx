
'use client';

import React from 'react';

interface Epicycle {
  x: number; // center x
  y: number; // center y
  radius: number;
  angle: number;
  tipX: number; // x of the vector tip from this epicycle's center
  tipY: number; // y of the vector tip from this epicycle's center
}

interface EpicycleCanvasProps {
  epicycleData: Epicycle[];
  width: number;
  height: number;
  currentSeriesValue: number; // Y-value of the sum of series (tip of last epicycle)
}

const EpicycleCanvas: React.FC<EpicycleCanvasProps> = ({
  epicycleData,
  width,
  height,
  currentSeriesValue,
}) => {
  const viewBoxMinX = -2; // Adjusted for typical Fourier series radii sum
  const viewBoxMaxX = 2;
  const viewBoxMinY = -1.5;
  const viewBoxMaxY = 1.5;
  const viewBoxWidth = viewBoxMaxX - viewBoxMinX;
  const viewBoxHeight = viewBoxMaxY - viewBoxMinY;

  // Scale factor to make epicycles visible, chosen empirically
  const visScaleFactor = Math.min(width, height) * 0.3; 

  const epicycleOriginX = width / 2; // Center epicycles in their half
  const epicycleOriginY = height / 2;
  
  // Transform for math coordinates (Y up) and scaling
  // The epicycle calculations already sum up, so their 'x' and 'y' are relative to (0,0) math origin
  // We just need to scale them and translate to SVG origin.

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="border rounded-md bg-background shadow-inner">
      <g transform={`translate(${epicycleOriginX}, ${epicycleOriginY}) scale(1, -1)`}>
        {/* Optional: Origin marker for epicycles */}
        {/* <circle cx="0" cy="0" r="2" fill="hsl(var(--muted-foreground))" /> */}

        {epicycleData.map((epicycle, index) => {
          const scaledRadius = epicycle.radius * visScaleFactor;
          const scaledPrevX = epicycle.x * visScaleFactor; // Center of current circle
          const scaledPrevY = epicycle.y * visScaleFactor;
          const scaledTipX = epicycle.tipX * visScaleFactor; // Tip of vector from this circle
          const scaledTipY = epicycle.tipY * visScaleFactor;

          return (
            <g key={index}>
              {/* Epicycle circle */}
              <circle
                cx={scaledPrevX}
                cy={scaledPrevY}
                r={Math.abs(scaledRadius)} // Radius must be positive
                fill="none"
                stroke={index === 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                strokeOpacity={0.5}
                strokeWidth="1"
              />
              {/* Vector line from center of this circle to its tip */}
              <line
                x1={scaledPrevX}
                y1={scaledPrevY}
                x2={scaledTipX}
                y2={scaledTipY}
                stroke={index === epicycleData.length - 1 ? "hsl(var(--destructive))" : "hsl(var(--accent-foreground))"}
                strokeWidth="1.5"
              />
            </g>
          );
        })}
        
        {/* Line connecting final epicycle tip to the waveform y-value */}
        {epicycleData.length > 0 && (
            <line
                x1={epicycleData[epicycleData.length -1].tipX * visScaleFactor}
                y1={epicycleData[epicycleData.length -1].tipY * visScaleFactor}
                x2={width / 2 - epicycleOriginX + 10} // Extend to right edge of epicycle canvas slightly
                y2={epicycleData[epicycleData.length -1].tipY * visScaleFactor}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="3 3"
            />
        )}
      </g>
    </svg>
  );
};

export default EpicycleCanvas;
