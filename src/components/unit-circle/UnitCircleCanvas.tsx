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
    // Adjust angle to be in [0, 2π]
    // atan2 returns in [-π, π]. Positive y is downwards in SVG after some transforms,
    // but atan2 standard math is positive y upwards. So if y is "positive" (downwards in SVG screen), angle is positive.
    // Let's keep it consistent with standard math coordinates where positive y is up.
    // The viewBox transformation should handle this correctly if the viewBox is set up with y increasing upwards.
    // For atan2, if svgP.y is for positive y-axis up, then result is fine.
    // We adjust it to be [0, 2pi] range, typically with 0 at positive x-axis.
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
  const handleY = radius * Math.sin(angle); // sin(angle) is correct for math coords, SVG y will be inverted by viewBox.

  const cheatAngles = [
    { rad: 0, label: "0, 2π" },
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
    >
      {/* Grid lines (optional enhancement) */}
      {[-1, -0.5, 0.5, 1].map(v => (
        <React.Fragment key={`grid-${v}`}>
          <line x1={v} y1={-radius*1.1} x2={v} y2={radius*1.1} stroke="hsl(var(--border))" strokeWidth="0.01" />
          <line x1={-radius*1.1} y1={v} x2={radius*1.1} y2={v} stroke="hsl(var(--border))" strokeWidth="0.01" />
        </React.Fragment>
      ))}

      {/* Axes */}
      <line x1={viewBoxMin} y1="0" x2={-viewBoxMin} y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />
      <line x1="0" y1={viewBoxMin} x2="0" y2={-viewBoxMin} stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />

      {/* Unit Circle */}
      <circle cx="0" cy="0" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.03" />
      
      {/* Quadrant Labels (optional, if not too cluttered) */}
      <text x={radius * 0.7} y={-radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle">I</text>
      <text x={-radius * 0.7} y={-radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle">II</text>
      <text x={-radius * 0.7} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle">III</text>
      <text x={radius * 0.7} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle">IV</text>


      {/* Cheat Overlay Elements */}
      {showCheatOverlay && (
        <g>
          {/* Triangle lines */}
          <line x1="0" y1="0" x2={handleX} y2="0" stroke="hsla(var(--accent-foreground), 0.5)" strokeWidth="0.02" strokeDasharray="0.04" />
          <line x1={handleX} y1="0" x2={handleX} y2={handleY} stroke="hsla(var(--accent-foreground), 0.5)" strokeWidth="0.02" strokeDasharray="0.04" />
          
          {/* Angle arc */}
          <path
            d={`M ${radius * 0.3} 0 A ${radius * 0.3} ${radius * 0.3} 0 ${angle > Math.PI ? 1 : 0} 1 ${radius * 0.3 * Math.cos(angle)} ${radius * 0.3 * Math.sin(angle)}`}
            fill="none"
            stroke="hsla(var(--accent-foreground), 0.7)"
            strokeWidth="0.02"
          />

          {/* Labels for common angles */}
          {cheatAngles.map(a => (
             <text
                key={a.label}
                x={(radius + 0.2) * Math.cos(a.rad)}
                y={(radius + 0.2) * Math.sin(a.rad)}
                fontSize="0.1"
                fill="hsl(var(--accent-foreground))"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {a.label}
              </text>
          ))}
        </g>
      )}

      {/* Line from center to handle */}
      <line x1="0" y1="0" x2={handleX} y2={handleY} stroke="hsl(var(--primary))" strokeWidth="0.03" />

      {/* Draggable Handle */}
      <circle cx={handleX} cy={handleY} r="0.1" fill="hsl(var(--primary))" className="cursor-grab active:cursor-grabbing" />
      <circle cx={handleX} cy={handleY} r="0.25" fill="transparent" /> {/* Larger invisible hit area */}
    </svg>
  );
};

export default UnitCircleCanvas;
