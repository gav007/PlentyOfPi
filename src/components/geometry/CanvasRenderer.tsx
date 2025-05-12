// src/components/geometry/CanvasRenderer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Point, TriangleVertices } from '@/lib/geometry/triangleUtils';
import { cn } from '@/lib/utils';

interface CanvasRendererProps {
  shapeType: 'triangle' | 'circle' | 'square' | 'trapezium';
  triangleVertices?: TriangleVertices;
  onTriangleVertexMove?: (vertexKey: keyof TriangleVertices, newPosition: Point) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  gridSpacing?: number;
  showAxes?: boolean;
  showTicks?: boolean;
}

const DRAG_HANDLE_RADIUS = 8;

export default function CanvasRenderer({
  shapeType,
  triangleVertices,
  onTriangleVertexMove,
  canvasWidth = 400,
  canvasHeight = 300, // Adjusted default to better fit typical card aspect ratios
  gridSpacing = 25,
  showAxes = true,
  showTicks = true,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingVertexKey, setDraggingVertexKey] = useState<keyof TriangleVertices | null>(null);

  const getMousePos = (event: MouseEvent | React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (shapeType !== 'triangle' || !triangleVertices || !onTriangleVertexMove) return;

    const mousePos = getMousePos(event);
    for (const key in triangleVertices) {
      const vertexKey = key as keyof TriangleVertices;
      const vertex = triangleVertices[vertexKey];
      const distance = Math.sqrt(Math.pow(mousePos.x - vertex.x, 2) + Math.pow(mousePos.y - vertex.y, 2));
      if (distance <= DRAG_HANDLE_RADIUS + 5) { // Increased hit area slightly
        setDraggingVertexKey(vertexKey);
        return;
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingVertexKey || !onTriangleVertexMove || !triangleVertices) return;
    
    let mousePos = getMousePos(event);
    
    // Snap to grid
    const snappedX = Math.round(mousePos.x / gridSpacing) * gridSpacing;
    const snappedY = Math.round(mousePos.y / gridSpacing) * gridSpacing;

    // Clamp to canvas bounds
    const clampedX = Math.max(0 + DRAG_HANDLE_RADIUS, Math.min(snappedX, canvasWidth - DRAG_HANDLE_RADIUS));
    const clampedY = Math.max(0 + DRAG_HANDLE_RADIUS, Math.min(snappedY, canvasHeight - DRAG_HANDLE_RADIUS));

    onTriangleVertexMove(draggingVertexKey, { x: clampedX, y: clampedY });
  };
  
  const handleMouseUp = () => {
    setDraggingVertexKey(null);
  };

  useEffect(() => {
    if (draggingVertexKey) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingVertexKey, handleMouseMove, handleMouseUp]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || 'blue';
    const mutedFgColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || 'grey';
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e2e8f0';
    const axisColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || 'black';

    // Draw Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvasWidth; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw Axes (assuming 0,0 is top-left for coordinates, but visual axes can be centered or at edges)
    if (showAxes) {
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1.5;
      // X-axis (e.g., at the bottom for positive Y up, or mid)
      // For now, let's consider the canvas edges as implicit axes for labeling
      // Or a main X-axis line (e.g. at y=0 if coordinate system was transformed)
      // For simplicity with current coordinate system, we'll highlight the 0-lines if they fall on grid
    }

    // Draw Tick Marks and Labels
    if (showTicks) {
      ctx.fillStyle = mutedFgColor;
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let x = 0; x <= canvasWidth; x += gridSpacing * 2) { // Label every other grid line
        if (x === 0 && gridSpacing * 2 > 20) continue; // Avoid 0 label if too close to Y axis labels
        ctx.fillText(x.toString(), x, canvasHeight - 12);
      }
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      for (let y = 0; y <= canvasHeight; y += gridSpacing * 2) {
        if (y === 0 && gridSpacing * 2 > 15) continue; // Avoid 0 label if too close to X axis labels
         ctx.fillText(y.toString(), 3, y);
      }
    }

    if (shapeType === 'triangle' && triangleVertices) {
      const { A, B, C } = triangleVertices;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      Object.entries(triangleVertices).forEach(([key, vertex]) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, DRAG_HANDLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = draggingVertexKey === key ? primaryColor : (primaryColor+'BB'); // Highlight + slight transparency
        ctx.fill();
        ctx.strokeStyle = primaryColor; // Border for handle
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = axisColor; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Smart label positioning (simple version)
        let labelOffsetX = 0;
        let labelOffsetY = - (DRAG_HANDLE_RADIUS + 8); // Default above
        if (vertex.y < DRAG_HANDLE_RADIUS * 3) labelOffsetY = DRAG_HANDLE_RADIUS + 10; // If too close to top, move below
        if (vertex.x < DRAG_HANDLE_RADIUS * 3) labelOffsetX = DRAG_HANDLE_RADIUS + 5; // If too close to left, move right
        if (vertex.x > canvasWidth - DRAG_HANDLE_RADIUS * 3) labelOffsetX = -(DRAG_HANDLE_RADIUS + 5); // If too close to right, move left
        
        ctx.fillText(key, vertex.x + labelOffsetX, vertex.y + labelOffsetY);
      });

    } else if (shapeType === 'circle') {
       // Simplified drawing, assuming centered for visual appeal.
       const visualCenterX = canvasWidth / 2;
       const visualCenterY = canvasHeight / 2;
       const visualRadius = Math.min(canvasWidth, canvasHeight) / 3;
       ctx.beginPath();
       ctx.arc(visualCenterX, visualCenterY, visualRadius, 0, 2 * Math.PI);
       ctx.strokeStyle = primaryColor;
       ctx.lineWidth = 2;
       ctx.stroke();
       ctx.fillStyle = mutedFgColor;
       ctx.font = '12px Arial';
       ctx.textAlign = 'center';
       ctx.fillText(`Circle (Radius: ${visualRadius.toFixed(0)})`, visualCenterX, 20);
    } else if (shapeType === 'square') {
        const side = Math.min(canvasWidth, canvasHeight) * 0.5; // Make it a bit smaller
        const x = (canvasWidth - side) / 2;
        const y = (canvasHeight - side) / 2;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x,y,side,side);
        ctx.fillStyle = mutedFgColor;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Square (Side: ${side.toFixed(0)})`, canvasWidth / 2, 20);
    } else if (shapeType === 'trapezium') {
        const base1 = canvasWidth * 0.3;
        const base2 = canvasWidth * 0.6;
        const height = canvasHeight * 0.4;
        const yTop = (canvasHeight - height) / 2;
        const yBottom = yTop + height;
        ctx.beginPath();
        ctx.moveTo((canvasWidth - base1) / 2, yTop);
        ctx.lineTo((canvasWidth + base1) / 2, yTop);
        ctx.lineTo((canvasWidth + base2) / 2, yBottom);
        ctx.lineTo((canvasWidth - base2) / 2, yBottom);
        ctx.closePath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = mutedFgColor;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Trapezium`, canvasWidth / 2, 20);
    } else {
        // Fallback for unhandled shapes
        ctx.fillStyle = mutedFgColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Drawing area for ${shapeType}`, canvasWidth / 2, canvasHeight / 2);
    }
  }, [shapeType, triangleVertices, draggingVertexKey, canvasWidth, canvasHeight, gridSpacing, showAxes, showTicks]); 

  return (
    <canvas 
      ref={canvasRef} 
      width={canvasWidth}
      height={canvasHeight}
      className={cn(
        "border border-input rounded-md bg-background",
        shapeType === 'triangle' && !draggingVertexKey && "cursor-grab",
        shapeType === 'triangle' && draggingVertexKey && "cursor-grabbing"
      )}
      aria-label={`Interactive canvas for ${shapeType}`}
      onMouseDown={shapeType === 'triangle' ? handleMouseDown : undefined} // Only enable drag for triangle
    >
      Canvas for {shapeType} (fallback text)
    </canvas>
  );
}
