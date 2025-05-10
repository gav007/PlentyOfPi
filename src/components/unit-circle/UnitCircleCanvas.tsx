
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface UnitCircleCanvasProps {
  angle: number; // current user-dragged angle in radians
  onAngleChange: (newAngle: number) => void;
  showCheatOverlay: boolean;
  size: number;
  gameMode?: boolean;
  targetAngleRad?: number | null;
  isGameInteractionLocked?: boolean;
}

const UnitCircleCanvas: React.FC<UnitCircleCanvasProps> = ({
  angle,
  onAngleChange,
  showCheatOverlay,
  size,
  gameMode = false,
  targetAngleRad = null,
  isGameInteractionLocked = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const viewBoxMin = -1.5;
  const viewBoxSize = 3;
  const radius = 1;

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current || isGameInteractionLocked) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    let newAngle = Math.atan2(-svgP.y, svgP.x);
    if (newAngle < 0) {
      newAngle += 2 * Math.PI;
    }
    onAngleChange(newAngle);
  }, [onAngleChange, isGameInteractionLocked]);

  const startDrag = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (isGameInteractionLocked) return;
    e.preventDefault();
    setIsDragging(true);
    if ('touches' in e) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    } else {
      handleInteraction(e.clientX, e.clientY);
    }
  };

  const drag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || isGameInteractionLocked) return;
    e.preventDefault();
    if ('touches' in e) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    } else {
      handleInteraction(e.clientX, e.clientY);
    }
  }, [isDragging, handleInteraction, isGameInteractionLocked]);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging && !isGameInteractionLocked) {
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
  }, [isDragging, drag, stopDrag, isGameInteractionLocked]);

  const mathHandleX = radius * Math.cos(angle);
  const mathHandleY = radius * Math.sin(angle);
  const svgHandleX = mathHandleX;
  const svgHandleY = -mathHandleY;

  const referenceAngles = [
    { deg: 0,     rad: 0,       label: "0" }, { deg: 30,    rad: Math.PI/6, label: "π/6" },
    { deg: 45,    rad: Math.PI/4, label: "π/4" }, { deg: 60,    rad: Math.PI/3, label: "π/3" },
    { deg: 90,    rad: Math.PI/2, label: "π/2" }, { deg: 120,   rad: 2*Math.PI/3, label: "2π/3" },
    { deg: 135,   rad: 3*Math.PI/4, label: "3π/4" }, { deg: 150,   rad: 5*Math.PI/6, label: "5π/6" },
    { deg: 180,   rad: Math.PI, label: "π" }, { deg: 210,   rad: 7*Math.PI/6, label: "7π/6" },
    { deg: 225,   rad: 5*Math.PI/4, label: "5π/4" }, { deg: 240,   rad: 4*Math.PI/3, label: "4π/3" },
    { deg: 270,   rad: 3*Math.PI/2, label: "3π/2" }, { deg: 300,   rad: 5*Math.PI/3, label: "5π/3" },
    { deg: 315,   rad: 7*Math.PI/4, label: "7π/4" }, { deg: 330,   rad: 11*Math.PI/6, label: "11π/6" },
    // { deg: 360,   rad: 2*Math.PI, label: "2π" }, // 2pi overlaps with 0, typically omitted or handled carefully
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
      className={cn("border border-border rounded-md bg-card touch-none", isGameInteractionLocked ? "cursor-not-allowed" : "cursor-pointer")}
      aria-label="Interactive unit circle. Drag to change the angle."
      role="application"
    >
      {/* Axes */}
      <line x1={viewBoxMin} y1="0" x2={-viewBoxMin} y2="0" stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />
      <line x1="0" y1={viewBoxMin} x2="0" y2={-viewBoxMin} stroke="hsl(var(--muted-foreground))" strokeWidth="0.02" />

      {/* Unit Circle */}
      <circle cx="0" cy="0" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.03" />
      
      {/* Quadrant Labels */}
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

            if (refAngle.label === "0" && Math.abs(mathLabelY) < 0.001) { 
                mathLabelY += 0.05; 
            }
            // Add small offset for 2pi if it were included, to prevent overlap with 0

            const svgX = mathX;
            const svgY = -mathY;
            const svgLabelX = mathLabelX;
            const svgLabelY = -mathLabelY;

            return (
              <g key={`ref-${refAngle.label}`}>
                {(refAngle.rad !== 0) && ( // Don't draw line for 0 itself
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
                >
                  {refAngle.label}
                </text>
              </g>
            );
          })}

          {/* Triangle lines for the INTERACTIVE angle */}
          <line x1="0" y1="0" x2={svgHandleX} y2="0" stroke="hsla(var(--accent-foreground), 0.6)" strokeWidth="0.02" strokeDasharray="0.04 0.02" />
          <line x1={svgHandleX} y1="0" x2={svgHandleX} y2={svgHandleY} stroke="hsla(var(--accent-foreground), 0.6)" strokeWidth="0.02" strokeDasharray="0.04 0.02" />
          
          <path
            d={`M ${radius * 0.3} 0 A ${radius * 0.3} ${radius * 0.3} 0 ${angle > Math.PI ? 1 : 0} 1 ${radius * 0.3 * Math.cos(angle)} ${-(radius * 0.3 * Math.sin(angle))}`}
            fill="none"
            stroke="hsla(var(--accent-foreground), 0.8)"
            strokeWidth="0.02"
          />

          {/* Target Angle Indicator in Game Mode */}
          {gameMode && targetAngleRad !== null && (
             <line
                x1="0"
                y1="0"
                x2={radius * Math.cos(targetAngleRad)}
                y2={-(radius * Math.sin(targetAngleRad))}
                stroke="hsl(var(--destructive))" 
                strokeWidth="0.025"
                strokeDasharray="0.05 0.03"
                aria-label={`Target angle indicator at ${targetAngleRad.toFixed(2)} radians`}
             />
          )}
        </g>
      )}

      {/* Line from center to handle (radius line for interactive angle) */}
      <line x1="0" y1="0" x2={svgHandleX} y2={svgHandleY} stroke="hsl(var(--primary))" strokeWidth="0.03" />

      {/* Draggable Handle */}
      <circle 
        cx={svgHandleX} 
        cy={svgHandleY} 
        r="0.1" 
        fill="hsl(var(--primary))" 
        className={cn(isGameInteractionLocked ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing")}
      />
      <circle cx={svgHandleX} cy={svgHandleY} r="0.25" fill="transparent" /> {/* Larger invisible hit area */}
    </svg>
  );
};

export default UnitCircleCanvas;
