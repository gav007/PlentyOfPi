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
      const vertex = triangleVertices[vertexKey]; // These are top-left canvas coords
      const distance = Math.sqrt(Math.pow(mousePos.x - vertex.x, 2) + Math.pow(mousePos.y - vertex.y, 2));
      if (distance <= DRAG_HANDLE_RADIUS + 5) {
        setDraggingVertexKey(vertexKey);
        return;
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingVertexKey || !onTriangleVertexMove || !triangleVertices) return;
    
    let mousePos = getMousePos(event);
    
    const snappedX = Math.round(mousePos.x / gridSpacing) * gridSpacing;
    const snappedY = Math.round(mousePos.y / gridSpacing) * gridSpacing;

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
    };
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

    // --- Save default state before any transformations ---
    ctx.save();

    // --- Apply Cartesian transform: (0,0) at bottom-left, Y increases upwards ---
    ctx.translate(0, canvasHeight);
    ctx.scale(1, -1);

    // --- Draw Grid (now in Cartesian coordinates) ---
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvasWidth; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0); // from y=0 (bottom)
      ctx.lineTo(x, canvasHeight); // to y=canvasHeight (top)
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y); // from x=0 (left)
      ctx.lineTo(canvasWidth, y); // to x=canvasWidth (right)
      ctx.stroke();
    }

    // --- Draw Axes (now in Cartesian coordinates) ---
    if (showAxes) {
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 1.5;
      // X-axis (at y=0)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvasWidth, 0);
      ctx.stroke();
      // Y-axis (at x=0)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, canvasHeight);
      ctx.stroke();
    }

    // --- Shape drawing (uses Cartesian coords due to global transform) ---
    if (shapeType === 'triangle' && triangleVertices) {
      const { A, B, C } = triangleVertices; // These are top-left canvas coords
      // The global transform handles their correct placement in the flipped system
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draggable handles for triangle vertices
      Object.values(triangleVertices).forEach((vertex) => {
        ctx.beginPath();
        // arc expects center x, y in current transformed space. Angles are standard.
        ctx.arc(vertex.x, vertex.y, DRAG_HANDLE_RADIUS, 0, 2 * Math.PI);
        // Check if this vertex is being dragged for fill style
        const isDraggingCurrent = Object.keys(triangleVertices).find(
            k => triangleVertices[k as keyof TriangleVertices] === vertex && draggingVertexKey === k
        );
        ctx.fillStyle = isDraggingCurrent ? primaryColor : (primaryColor + 'BB');
        ctx.fill();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    } else if (shapeType === 'circle') {
       const mathCenterX = canvasWidth / 2;
       const mathCenterY = canvasHeight / 2;
       const visualRadius = Math.min(canvasWidth, canvasHeight) / 3;
       ctx.beginPath();
       ctx.arc(mathCenterX, mathCenterY, visualRadius, 0, 2 * Math.PI);
       ctx.strokeStyle = primaryColor;
       ctx.lineWidth = 2;
       ctx.stroke();
    } else if (shapeType === 'square') {
        const side = Math.min(canvasWidth, canvasHeight) * 0.5;
        const mathX = (canvasWidth - side) / 2; // bottom-left x
        const mathY = (canvasHeight - side) / 2; // bottom-left y
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(mathX, mathY, side, side); // strokeRect(x,y,width,height)
    } else if (shapeType === 'trapezium') {
        const base1 = canvasWidth * 0.3; // top base
        const base2 = canvasWidth * 0.6; // bottom base
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
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // --- Restore context to draw non-transformed elements like labels ---
    ctx.restore(); 

    // --- Draw Tick Marks and Labels (in original canvas coordinates, 0,0 at top-left) ---
    if (showTicks) {
      ctx.fillStyle = mutedFgColor;
      ctx.font = '10px Arial';
      // X-axis Ticks & Labels (along the bottom edge of canvas)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top'; // Labels just below the line (appears above in math coords)
      for (let x = 0; x <= canvasWidth; x += gridSpacing * 2) {
        if (x === 0 && gridSpacing * 2 > 20 && canvasHeight - (gridSpacing * 2) < canvasHeight - 15) continue; // Avoid overlap with y-axis 0
        ctx.fillText(x.toString(), x, canvasHeight - (gridSpacing / 2) + 3);
      }
      // Y-axis Ticks & Labels (along the left edge of canvas)
      ctx.textAlign = 'right'; 
      ctx.textBaseline = 'middle';
      for (let y = gridSpacing * 2; y <= canvasHeight; y += gridSpacing * 2) { // Start from first non-zero grid line
         // Label value is canvasHeight - y (to represent math Y=0 at bottom)
        ctx.fillText((canvasHeight - y).toString(), (gridSpacing / 2) - 3, y);
      }
      // Add origin labels '0'
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText("0", (gridSpacing / 2) - 3, canvasHeight - (gridSpacing/2) + 3);
    }

    // --- Draw Vertex Labels for Triangle (in original canvas coordinates) ---
    if (shapeType === 'triangle' && triangleVertices) {
        Object.entries(triangleVertices).forEach(([key, vertex]) => {
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = axisColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            let labelOffsetX = 0;
            let labelOffsetY = - (DRAG_HANDLE_RADIUS + 8); // Default above
            if (vertex.y < DRAG_HANDLE_RADIUS * 3 + 10) labelOffsetY = DRAG_HANDLE_RADIUS + 10; // If too close to top, move below
            if (vertex.x < DRAG_HANDLE_RADIUS * 3 + 5) {
                labelOffsetX = DRAG_HANDLE_RADIUS + 8; // If too close to left, move right
                ctx.textAlign = 'left';
            }
            if (vertex.x > canvasWidth - (DRAG_HANDLE_RADIUS * 3 + 5)) {
                labelOffsetX = -(DRAG_HANDLE_RADIUS + 8); // If too close to right, move left
                ctx.textAlign = 'right';
            }
            
            ctx.fillText(key, vertex.x + labelOffsetX, vertex.y + labelOffsetY);
        });
    } else if (shapeType !== 'triangle') { // Generic titles for other shapes
        ctx.fillStyle = mutedFgColor;
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
        ctx.fillText(title, canvasWidth / 2, 10); // Position title at top-center of canvas
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
      onMouseDown={shapeType === 'triangle' ? handleMouseDown : undefined}
    >
      Canvas for {shapeType} (fallback text)
    </canvas>
  );
}

