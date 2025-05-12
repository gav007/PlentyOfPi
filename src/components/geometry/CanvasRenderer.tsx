'use client';

import { useEffect, useRef, useState } from 'react';
import type { Point, TriangleVertices } from '@/lib/geometry/triangleUtils';

interface CanvasRendererProps {
  shapeType: 'triangle' | 'circle' | 'square' | 'trapezium';
  triangleVertices?: TriangleVertices;
  onTriangleVertexMove?: (vertexKey: keyof TriangleVertices, newPosition: Point) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  // Add more props as needed for other shapes
}

const DRAG_HANDLE_RADIUS = 8;

export default function CanvasRenderer({
  shapeType,
  triangleVertices,
  onTriangleVertexMove,
  canvasWidth = 300, // Default canvas width
  canvasHeight = 200, // Default canvas height
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
      if (distance <= DRAG_HANDLE_RADIUS) {
        setDraggingVertexKey(vertexKey);
        return;
      }
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingVertexKey || !onTriangleVertexMove) return;
    const mousePos = getMousePos(event);
    onTriangleVertexMove(draggingVertexKey, mousePos);
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
    
    // Set common styles
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const mutedFgColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim();

    if (shapeType === 'triangle' && triangleVertices) {
      const { A, B, C } = triangleVertices;
      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.strokeStyle = primaryColor || 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw draggable handles and labels
      Object.entries(triangleVertices).forEach(([key, vertex]) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, DRAG_HANDLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = draggingVertexKey === key ? primaryColor : (primaryColor+'99'); // Highlight if dragging
        ctx.fill();
        ctx.strokeStyle = primaryColor;
        ctx.stroke();
        
        ctx.font = '12px Arial';
        ctx.fillStyle = mutedFgColor || 'grey';
        ctx.textAlign = 'center';
        // Position labels slightly offset from vertex
        let labelX = vertex.x;
        let labelY = vertex.y;
        if (key === 'A') { labelX -= DRAG_HANDLE_RADIUS + 5; labelY += DRAG_HANDLE_RADIUS + 10;}
        else if (key === 'B') { labelX += DRAG_HANDLE_RADIUS + 5; labelY += DRAG_HANDLE_RADIUS + 10;}
        else if (key === 'C') { labelY -= DRAG_HANDLE_RADIUS + 5;}
        ctx.fillText(key, labelX, labelY);
      });

    } else if (shapeType === 'circle') {
       ctx.beginPath();
       ctx.arc(canvasWidth / 2, canvasHeight / 2, Math.min(canvasWidth, canvasHeight)/3 , 0, 2 * Math.PI);
       ctx.strokeStyle = primaryColor || 'blue';
       ctx.lineWidth = 2;
       ctx.stroke();
       ctx.fillStyle = mutedFgColor || 'grey';
       ctx.font = '16px Arial';
       ctx.textAlign = 'center';
       ctx.textBaseline = 'middle';
       ctx.fillText(`Interactive Circle`, canvasWidth / 2, 30);
    } else if (shapeType === 'square') {
        ctx.strokeStyle = primaryColor || 'blue';
        ctx.lineWidth = 2;
        const side = Math.min(canvasWidth, canvasHeight) * 0.6;
        const x = (canvasWidth - side) / 2;
        const y = (canvasHeight - side) / 2;
        ctx.strokeRect(x,y,side,side);
        ctx.fillStyle = mutedFgColor || 'grey';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Interactive Square`, canvasWidth / 2, 30);
    } else if (shapeType === 'trapezium') {
        ctx.strokeStyle = primaryColor || 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const base1 = canvasWidth * 0.4;
        const base2 = canvasWidth * 0.7;
        const height = canvasHeight * 0.5;
        const yTop = (canvasHeight - height) / 2;
        const yBottom = yTop + height;
        ctx.moveTo((canvasWidth - base1) / 2, yTop);
        ctx.lineTo((canvasWidth + base1) / 2, yTop);
        ctx.lineTo((canvasWidth + base2) / 2, yBottom);
        ctx.lineTo((canvasWidth - base2) / 2, yBottom);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = mutedFgColor || 'grey';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Interactive Trapezium`, canvasWidth / 2, 30);
    } else {
        ctx.fillStyle = primaryColor || 'blue';
        ctx.fillRect(canvasWidth/2 - 50, canvasHeight/2 - 25, 100, 50);
        ctx.fillStyle = mutedFgColor || 'grey';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Drawing area for ${shapeType}`, canvasWidth / 2, canvasHeight / 2);
    }
  }, [shapeType, triangleVertices, draggingVertexKey, canvasWidth, canvasHeight]); // Redraw when shapeType changes or other relevant props

  return (
    <canvas 
      ref={canvasRef} 
      width={canvasWidth}
      height={canvasHeight}
      className="border border-input rounded-md bg-background cursor-grab active:cursor-grabbing"
      aria-label={`Interactive canvas for ${shapeType}`}
      onMouseDown={handleMouseDown}
    >
      Canvas for {shapeType} (fallback text)
    </canvas>
  );
}