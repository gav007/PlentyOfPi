
// src/components/geometry/CanvasRenderer.tsx
'use client';

import { useEffect, useRef, useState }
from 'react';
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
  canvasHeight = 300,
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
      if (distance <= DRAG_HANDLE_RADIUS + 5) { // Increased hit radius for easier interaction
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

    // Clamp within canvas boundaries, considering handle radius
    const clampedX = Math.max(DRAG_HANDLE_RADIUS, Math.min(snappedX, canvasWidth - DRAG_HANDLE_RADIUS));
    const clampedY = Math.max(DRAG_HANDLE_RADIUS, Math.min(snappedY, canvasHeight - DRAG_HANDLE_RADIUS));

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
    };
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingVertexKey, handleMouseMove, handleMouseUp]); // Removed triangleVertices from deps as it can cause rapid re-binding


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    const themePrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3B82F6';
    const themeMutedFgColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || '#64748b';
    const themeGridColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e2e8f0'; // Light gray for grid
    const themeAxisColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#111827'; // Darker for axes


    ctx.save();
    ctx.translate(0, canvasHeight); // Move origin to bottom-left
    ctx.scale(1, -1); // Flip Y-axis

    // Draw Grid
    ctx.strokeStyle = themeGridColor;
    ctx.lineWidth = 0.5; // Thin grid lines
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

    // Draw Axes
    if (showAxes) {
      ctx.strokeStyle = themeAxisColor; // Use darker color for axes
      ctx.lineWidth = 1.5; // Thicker axes
      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvasWidth, 0);
      ctx.stroke();
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, canvasHeight);
      ctx.stroke();
    }
    
    // Shape drawing (uses Cartesian coords)
    ctx.strokeStyle = themePrimaryColor;
    ctx.lineWidth = 2;

    if (shapeType === 'triangle' && triangleVertices) {
      const { A, B, C } = triangleVertices;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.stroke();

      Object.entries(triangleVertices).forEach(([key, vertex]) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, DRAG_HANDLE_RADIUS, 0, 2 * Math.PI);
        const isCurrentDragging = draggingVertexKey === key as keyof TriangleVertices;
        ctx.fillStyle = isCurrentDragging ? themePrimaryColor : `${themePrimaryColor}BB`; // Solid if dragging, else semi-transparent
        ctx.fill();
        ctx.strokeStyle = themePrimaryColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    } else if (shapeType === 'circle') {
       const mathCenterX = canvasWidth / 2;
       const mathCenterY = canvasHeight / 2;
       const visualRadius = Math.min(canvasWidth, canvasHeight) / 3;
       ctx.beginPath();
       ctx.arc(mathCenterX, mathCenterY, visualRadius, 0, 2 * Math.PI);
       ctx.stroke();
    } else if (shapeType === 'square') {
        const side = Math.min(canvasWidth, canvasHeight) * 0.5;
        const mathX = (canvasWidth - side) / 2;
        const mathY = (canvasHeight - side) / 2;
        ctx.strokeRect(mathX, mathY, side, side);
    } else if (shapeType === 'trapezium') {
        const base1 = canvasWidth * 0.3;
        const base2 = canvasWidth * 0.6;
        const height = canvasHeight * 0.4;
        const mathYBottom = (canvasHeight - height) / 2;
        const mathYTop = mathYBottom + height;
        const xTop1 = (canvasWidth - base1) / 2;
        const xTop2 = (canvasWidth + base1) / 2;
        const xBottom1 = (canvasWidth - base2) / 2;
        const xBottom2 = (canvasWidth + base2) / 2;
        ctx.beginPath();
        ctx.moveTo(xTop1, mathYTop);
        ctx.lineTo(xTop2, mathYTop);
        ctx.lineTo(xBottom2, mathYBottom);
        ctx.lineTo(xBottom1, mathYBottom);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.restore(); // Restore to original canvas coordinates for text

    // Draw Tick Marks and Labels (in original canvas coordinates)
    if (showTicks) {
      ctx.fillStyle = themeMutedFgColor;
      ctx.font = '10px Arial';
      // X-axis Ticks & Labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let x = 0; x <= canvasWidth; x += gridSpacing * 2) {
        if (x === 0 && gridSpacing*2 > 20 && canvasHeight - (gridSpacing / 2) + 3 > canvasHeight - 15) continue;
        ctx.fillText(x.toString(), x, canvasHeight - (gridSpacing / 2) + 5); // Adjusted y for better positioning
      }
      // Y-axis Ticks & Labels
      ctx.textAlign = 'right'; 
      ctx.textBaseline = 'middle';
      for (let y = gridSpacing * 2; y <= canvasHeight; y += gridSpacing * 2) {
        ctx.fillText((canvasHeight - y).toString(), (gridSpacing / 2) - 5, y); // Adjusted x for better positioning
      }
      // Origin '0' label
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText("0", (gridSpacing / 2) - 5, canvasHeight - (gridSpacing/2) + 5);
    }

    // Vertex Labels for Triangle
    if (shapeType === 'triangle' && triangleVertices) {
        Object.entries(triangleVertices).forEach(([key, vertex]) => {
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = themeAxisColor; // Use darker axis color for labels
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            let labelOffsetX = 0;
            let labelOffsetY = -(DRAG_HANDLE_RADIUS + 10); 
            if (vertex.y < DRAG_HANDLE_RADIUS * 2 + 15) labelOffsetY = DRAG_HANDLE_RADIUS + 12; 
            if (vertex.x < DRAG_HANDLE_RADIUS * 2 + 10) { labelOffsetX = DRAG_HANDLE_RADIUS + 10; ctx.textAlign = 'left'; }
            if (vertex.x > canvasWidth - (DRAG_HANDLE_RADIUS * 2 + 10)) { labelOffsetX = -(DRAG_HANDLE_RADIUS + 10); ctx.textAlign = 'right'; }
            
            ctx.fillText(key, vertex.x + labelOffsetX, vertex.y + labelOffsetY);
        });
    } else if (shapeType !== 'triangle') { // Generic titles for other shapes
        ctx.fillStyle = themeMutedFgColor;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        let title = shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
        if (shapeType === 'circle') {
            const visualRadius = Math.min(canvasWidth, canvasHeight) / 3;
            title = `Circle (Radius: ${visualRadius.toFixed(0)})`;
        } else if (shapeType === 'square') {
            const side = Math.min(canvasWidth, canvasHeight) * 0.5;
            title = `Square (Side: ${side.toFixed(0)})`;
        }
        ctx.fillText(title, canvasWidth / 2, 10); 
    }

  }, [shapeType, triangleVertices, draggingVertexKey, canvasWidth, canvasHeight, gridSpacing, showAxes, showTicks, onTriangleVertexMove]); // Added onTriangleVertexMove here

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
      onMouseDown={shapeType === 'triangle' ? handleMouseDown : undefined}
    >
      Canvas for {shapeType} (fallback text)
    </canvas>
  );
}
