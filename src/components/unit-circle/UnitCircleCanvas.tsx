
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

  const labelOffsetRadius = radius + 0.22; // Determines how far labels are from the circle's edge

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
      
      {/* Quadrant Labels */}
      <text x={radius * 0.7} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>I</text>
      <text x={-radius * 0.7} y={radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>II</text>
      <text x={-radius * 0.7} y={-radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>III</text>
      <text x={radius * 0.7} y={-radius * 0.7} fontSize="0.1" fill="hsl(var(--muted-foreground))" textAnchor="middle" style={{ transform: "scaleY(-1)"}}>IV</text>

      {/* Cheat Overlay Elements */}
      {showCheatOverlay && (
        <g>
          {/* Radial Guide Lines and Labels for reference angles */}
          {referenceAngles.map(refAngle => {
            const x = radius * Math.cos(refAngle.rad);
            const y = radius * Math.sin(refAngle.rad);
            
            const lx = labelOffsetRadius * Math.cos(refAngle.rad);
            let ly = labelOffsetRadius * Math.sin(refAngle.rad);

            // Slightly offset 2π label from 0 label
            if (refAngle.label === "2π") {
              // For 2Pi (which is at 0 radians visually for text positioning)
              // if y is 0, move it slightly down in the text's coordinate system
              // (which is up on screen before text's own scaleY(-1))
              ly = (labelOffsetRadius * Math.sin(refAngle.rad)) - 0.15; // Adjust this offset as needed
            }
             if (refAngle.label === "0" && Math.abs(ly) < 0.001) {
               ly = (labelOffsetRadius * Math.sin(refAngle.rad)) + 0.02; // Nudge "0" slightly up to not clash with axis text potentially
             }


            return (
              <g key={`ref-${refAngle.label}`}>
                {(refAngle.rad !== 0 && refAngle.rad !== 2 * Math.PI) && ( // Avoid drawing line over x-axis for 0/2PI
                  <line
                    x1="0"
                    y1="0"
                    x2={x}
                    y2={y}
                    stroke="hsl(var(--muted-foreground))"
                    strokeOpacity="0.5"
                    strokeWidth="0.015"
                    strokeDasharray="0.03 0.03" 
                  />
                )}
                <text
                  x={lx}
                  y={ly}
                  fontSize="0.12"
                  fill="hsl(var(--accent-foreground))"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ transform: "scaleY(-1)" }} // Counter-act parent SVG transform for text
                >
                  {refAngle.label}
                </text>
              </g>
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
