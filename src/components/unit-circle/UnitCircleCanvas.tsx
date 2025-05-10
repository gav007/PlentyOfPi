
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
    
    // With manual Y inversion for display, atan2 needs the inverted Y coordinate
    // from SVG's default (positive Y down) to mathematical (positive Y up)
    let newAngle = Math.atan2(-svgP.y, svgP.x);
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

  const mathHandleX = radius * Math.cos(angle);
  const mathHandleY = radius * Math.sin(angle);

  // SVG Y coordinates are inverted from mathematical Y
  const svgHandleX = mathHandleX;
  const svgHandleY = -mathHandleY;


  const referenceAngles = [
    { deg: 0,     rad: 0,       label: "0" },
    { deg: 30,    rad: Math.PI/6, label: "π/6" },
    { deg: 45,    rad: Math.PI/4, label: "π/4" },
    { deg: 60,    rad: Math.PI/3, label: "π/3" },
    { deg: 90,    rad: Math.PI/2, label: "π/2" },
    { deg: 120,   rad: 2*Math.PI/3, label: "2π/3" },
    { deg: 135,   rad: 3*Math.PI/4, label: "3π/4" },
    { deg: 150,   rad: 5*Math.PI/6, label: "5π/6" },
    { deg: 180,   rad: Math.PI, label: "π" },
    { deg: 210,   rad: 7*Math.PI/6, label: "7π/6" },
    { deg: 225,   rad: 5*Math.PI/4, label: "5π/4" },
    { deg: 240,   rad: 4*Math.PI/3, label: "4π/3" },
    { deg: 270,   rad: 3*Math.PI/2, label: "3π/2" },
    { deg: 300,   rad: 5*Math.PI/3, label: "5π/3" },
    { deg: 315,   rad: 7*Math.PI/4, label: "7π/4" },
    { deg: 330,   rad: 11*Math.PI/6, label: "11π/6" },
    { deg: 360,   rad: 2*Math.PI, label: "2π" },
  ];

  const labelOffsetRadius = radius + 0.22;

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
      // Removed style={{ transform: "scaleY(-1)" }} - Y inversion is now manual
    >
      {/* Axes */}
      <line x1={viewBoxMin} y1="0" x2={-viewBoxMin} y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />
      <line x1="0" y1={viewBoxMin} x2="0" y2={-viewBoxMin} stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />

      {/* Unit Circle */}
      <circle cx="0" cy="0" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.03" />
      
      {/* Quadrant Labels - Y coordinates manually inverted */}
      <text x={radius * 0.7} y={-(radius * 0.7)} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" dominantBaseline="middle">I</text>
      <text x={-(radius * 0.7)} y={-(radius * 0.7)} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" dominantBaseline="middle">II</text>
      <text x={-(radius * 0.7)} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" dominantBaseline="middle">III</text>
      <text x={radius * 0.7} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" dominantBaseline="middle">IV</text>

      {/* Cheat Overlay Elements */}
      {showCheatOverlay && (
        <g>
          {referenceAngles.map(refAngle => {
            const mathX = radius * Math.cos(refAngle.rad);
            const mathY = radius * Math.sin(refAngle.rad);
            
            const mathLabelX = labelOffsetRadius * Math.cos(refAngle.rad);
            let mathLabelY = labelOffsetRadius * Math.sin(refAngle.rad);

            // Adjustments for 0 and 2π labels to avoid overlap
            if (refAngle.label === "2π" && Math.abs(mathLabelY) < 0.001) { // If Y is ~0 for 2pi
                mathLabelY -= 0.10; // Move 2π label slightly down mathematically
            }
            if (refAngle.label === "0" && Math.abs(mathLabelY) < 0.001) { // If Y is ~0 for 0
                mathLabelY += 0.05; // Move 0 label slightly up mathematically
            }

            const svgX = mathX;
            const svgY = -mathY;
            const svgLabelX = mathLabelX;
            const svgLabelY = -mathLabelY;


            return (
              <g key={`ref-${refAngle.label}`}>
                {(refAngle.rad !== 0 && refAngle.rad !== 2 * Math.PI) && (
                  <line
                    x1="0"
                    y1="0"
                    x2={svgX}
                    y2={svgY}
                    stroke="hsl(var(--muted-foreground))"
                    strokeOpacity="0.5"
                    strokeWidth="0.015"
                    strokeDasharray="0.03 0.03" 
                  />
                )}
                <text
                  x={svgLabelX}
                  y={svgLabelY}
                  fontSize="0.12"
                  fill="hsl(var(--accent-foreground))"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  // Removed style={{ transform: "scaleY(-1)" }}
                >
                  {refAngle.label}
                </text>
              </g>
            );
          })}

          {/* Triangle lines for the INTERACTIVE angle (cos and sin components) */}
          {/* Y coordinates (svgHandleY and 0) are already SVG-correct */}
          <line x1="0" y1="0" x2={svgHandleX} y2="0" stroke="hsla(var(--accent-foreground), 0.6)" strokeWidth="0.02" strokeDasharray="0.04 0.02" />
          <line x1={svgHandleX} y1="0" x2={svgHandleX} y2={svgHandleY} stroke="hsla(var(--accent-foreground), 0.6)" strokeWidth="0.02" strokeDasharray="0.04 0.02" />
          
          {/* Arc for the INTERACTIVE angle. Last Y param needs to be SVG Y. */}
          <path
            d={`M ${radius * 0.3} 0 A ${radius * 0.3} ${radius * 0.3} 0 ${angle > Math.PI ? 1 : 0} 1 ${radius * 0.3 * Math.cos(angle)} ${-(radius * 0.3 * Math.sin(angle))}`}
            fill="none"
            stroke="hsla(var(--accent-foreground), 0.8)"
            strokeWidth="0.02"
          />
        </g>
      )}

      {/* Line from center to handle (radius line for interactive angle) */}
      <line x1="0" y1="0" x2={svgHandleX} y2={svgHandleY} stroke="hsl(var(--primary))" strokeWidth="0.03" />

      {/* Draggable Handle */}
      <circle cx={svgHandleX} cy={svgHandleY} r="0.1" fill="hsl(var(--primary))" className="cursor-grab active:cursor-grabbing" />
      <circle cx={svgHandleX} cy={svgHandleY} r="0.25" fill="transparent" /> {/* Larger invisible hit area for easier dragging */}
    </svg>
  );
};

export default UnitCircleCanvas;

