
'use client';

import type { Root } from 'postcss';
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface UnitCircleCanvasProps {
  angle: number; // in radians
  onAngleChange: (newAngle: number) => void;
  showCheatOverlay: boolean;
  size: number;
}

const UnitCircleCanvas: React.FC<UnitCircleCanvasProps> = ({
  angle,
  onAngleChange,
  showCheatOverlay,
  size,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const viewBoxMin = -1.5;
  const viewBoxSize = 3;
  const radius = 1;

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    let newAngle = Math.atan2(svgP.y, svgP.x);
    // atan2 returns angle in radians from -PI to PI.
    // We want it in [0, 2PI] with 0 along the positive x-axis.
    // SVG y-coordinates are typically inverted (positive down), but viewBox transform handles this
    // so svgP.y should be standard Cartesian y.
    // Standard atan2(y,x):
    // Positive y up, Positive x right.
    // Angle 0 is along positive x-axis.
    // Angle increases counter-clockwise.
    // Result is [-PI, PI].
    // To convert to [0, 2PI]:
    if (newAngle < 0) {
      newAngle += 2 * Math.PI;
    }
    onAngleChange(newAngle);
  }, [onAngleChange]);

  const startDrag = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDragging(true);
    if ('touches' in e) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    } else {
      handleInteraction(e.clientX, e.clientY);
    }
  };

  const drag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if ('touches' in e) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    } else {
      handleInteraction(e.clientX, e.clientY);
    }
  }, [isDragging, handleInteraction]);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', drag);
      window.addEventListener('touchmove', drag);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);
    } else {
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('touchmove', drag);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    }
    return () => {
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('touchmove', drag);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [isDragging, drag, stopDrag]);

  const handleX = radius * Math.cos(angle);
  const handleY = radius * Math.sin(angle);

  const cheatAngles = [
    { rad: 0, label: "0" }, // Simplified 0, 2π to just 0 for label to avoid overlap, 2PI is same pos
    { rad: Math.PI / 6, label: "π/6" }, { rad: Math.PI / 4, label: "π/4" }, { rad: Math.PI / 3, label: "π/3" },
    { rad: Math.PI / 2, label: "π/2" }, { rad: 2 * Math.PI / 3, label: "2π/3" }, { rad: 3 * Math.PI / 4, label: "3π/4" }, { rad: 5 * Math.PI / 6, label: "5π/6" },
    { rad: Math.PI, label: "π" }, { rad: 7 * Math.PI / 6, label: "7π/6" }, { rad: 5 * Math.PI / 4, label: "5π/4" }, { rad: 4 * Math.PI / 3, label: "4π/3" },
    { rad: 3 * Math.PI / 2, label: "3π/2" }, { rad: 5 * Math.PI / 3, label: "5π/3" }, { rad: 7 * Math.PI / 4, label: "7π/4" }, { rad: 11 * Math.PI / 6, label: "11π/6" },
  ];

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`${viewBoxMin} ${viewBoxMin} ${viewBoxSize} ${viewBoxSize}`}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      className="cursor-pointer touch-none border border-border rounded-md bg-card"
      aria-label="Interactive unit circle. Drag to change the angle."
      role="application"
      style={{ transform: "scaleY(-1)" }} // Invert Y-axis for standard math coordinates
    >
      {/* Axes */}
      <line x1={viewBoxMin} y1="0" x2={-viewBoxMin} y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />
      <line x1="0" y1={viewBoxMin} x2="0" y2={-viewBoxMin} stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />

      {/* Unit Circle */}
      <circle cx="0" cy="0" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.03" />
      
      {/* Quadrant Labels (optional, if not too cluttered) - adjust y due to scaleY(-1) */}
      <text x={radius * 0.7} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>I</text>
      <text x={-radius * 0.7} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>II</text>
      <text x={-radius * 0.7} y={-radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>III</text>
      <text x={radius * 0.7} y={-radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>IV</text>

      {/* Cheat Overlay Elements */}
      {showCheatOverlay && (
        <g>
          {/* Radial Guide Lines for cheat angles */}
          {cheatAngles.map(a => {
            // Don't draw line for angle 0 as it's the x-axis itself
            if (a.rad === 0 && Math.PI*2) return null; 
            const lineX = radius * Math.cos(a.rad);
            const lineY = radius * Math.sin(a.rad);
            return (
              <line
                key={`radial-line-${a.label}`}
                x1="0"
                y1="0"
                x2={lineX}
                y2={lineY}
                stroke="hsla(var(--muted-foreground), 0.4)" // Faint color
                strokeWidth="0.015"
                strokeDasharray="0.04 0.02"
              />
            );
          })}

          {/* Triangle lines for the INTERACTIVE angle (cos and sin components) */}
          <line x1="0" y1="0" x2={handleX} y2="0" stroke="hsla(var(--accent-foreground), 0.6)" strokeWidth="0.02" strokeDasharray="0.04 0.02" />
          <line x1={handleX} y1="0" x2={handleX} y2={handleY} stroke="hsla(var(--accent-foreground), 0.6)" strokeWidth="0.02" strokeDasharray="0.04 0.02" />
          
          {/* Arc for the INTERACTIVE angle */}
          <path
            d={`M ${radius * 0.3} 0 A ${radius * 0.3} ${radius * 0.3} 0 ${angle > Math.PI ? 1 : 0} 1 ${radius * 0.3 * Math.cos(angle)} ${radius * 0.3 * Math.sin(angle)}`}
            fill="none"
            stroke="hsla(var(--accent-foreground), 0.8)"
            strokeWidth="0.02"
          />

          {/* Labels for common angles. Apply inverse scaleY to text to make it upright. */}
          {cheatAngles.map(a => (
             <text
                key={`label-${a.label}`}
                x={(radius + 0.18) * Math.cos(a.rad)} // Adjust distance from circle
                y={(radius + 0.18) * Math.sin(a.rad)}
                fontSize="0.12" // Slightly larger for readability
                fill="hsl(var(--accent-foreground))"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ transform: "scaleY(-1)" }} // Counter-act parent SVG transform for text
              >
                {a.label}
              </text>
          ))}
           {/* Label for 2PI at the 0 position */}
           <text
                x={(radius + 0.18) * Math.cos(0)}
                y={(radius + 0.18) * Math.sin(0) - 0.15} // Offset slightly below 0 label
                fontSize="0.12"
                fill="hsl(var(--accent-foreground))"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ transform: "scaleY(-1)" }}
              >
                2π
            </text>
        </g>
      )}

      {/* Line from center to handle (radius line for interactive angle) */}
      <line x1="0" y1="0" x2={handleX} y2={handleY} stroke="hsl(var(--primary))" strokeWidth="0.03" />

      {/* Draggable Handle */}
      <circle cx={handleX} cy={handleY} r="0.1" fill="hsl(var(--primary))" className="cursor-grab active:cursor-grabbing" />
      <circle cx={handleX} cy={handleY} r="0.25" fill="transparent" /> {/* Larger invisible hit area for easier dragging */}
    </svg>
  );
};

export default UnitCircleCanvas;
