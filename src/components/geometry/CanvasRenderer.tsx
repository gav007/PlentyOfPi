
// src/components/geometry/CanvasRenderer.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Point, TriangleVertices } from '@/lib/geometry/triangleUtils';
import { cn } from '@/lib/utils';

interface CanvasRendererProps {
  shapeType: 'triangle' | 'circle' | 'square' | 'trapezium';
  triangleVertices?: TriangleVertices;
  onTriangleVertexMove?: (vertexKey: keyof TriangleVertices, newPosition: Point) => void;
  initialCanvasWidth?: number; // Renamed to initial, as it will be dynamic
  initialCanvasHeight?: number; // Renamed to initial
  gridSpacing?: number;
  showAxes?: boolean;
  showTicks?: boolean;
}

const DRAG_HANDLE_RADIUS = 8;

export default function CanvasRenderer({
  shapeType,
  triangleVertices,
  onTriangleVertexMove,
  initialCanvasWidth = 400,
  initialCanvasHeight = 300,
  gridSpacing = 25,
  showAxes = true,
  showTicks = true,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingVertexKey, setDraggingVertexKey] = useState<keyof TriangleVertices | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: initialCanvasWidth, height: initialCanvasHeight });

  // Make canvas responsive
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Maintain aspect ratio if height is not explicitly driven by parent's height constraint
        // For example, if parent has aspect-ratio styling, use that height.
        // Otherwise, default to 4:3 based on width.
        const newHeight = canvas.parentElement?.style.aspectRatio ? height : width * (initialCanvasHeight / initialCanvasWidth);
        setCanvasSize({ width, height: newHeight });
      }
    });

    resizeObserver.observe(canvas.parentElement);
    
    // Initial size set
    const parentRect = canvas.parentElement.getBoundingClientRect();
    const initialHeight = canvas.parentElement?.style.aspectRatio ? parentRect.height : parentRect.width * (initialCanvasHeight / initialCanvasWidth);
    setCanvasSize({ width: parentRect.width, height: initialHeight });


    return () => {
      resizeObserver.disconnect();
    };
  }, [initialCanvasWidth, initialCanvasHeight]);


  const getMousePos = useCallback((event: PointerEvent | React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (shapeType !== 'triangle' || !triangleVertices || !onTriangleVertexMove || isNaN(canvasSize.width) || isNaN(canvasSize.height)) return;

    const mousePos = getMousePos(event);
    // Check distance in screen coordinates (top-down Y)
    for (const key in triangleVertices) {
      const vertexKey = key as keyof TriangleVertices;
      const vertex = triangleVertices[vertexKey];
      const distance = Math.sqrt(Math.pow(mousePos.x - vertex.x, 2) + Math.pow(mousePos.y - vertex.y, 2));
      if (distance <= DRAG_HANDLE_RADIUS + 5) {
        setDraggingVertexKey(vertexKey);
        canvasRef.current?.setPointerCapture(event.pointerId); // Capture pointer
        return;
      }
    }
  }, [shapeType, triangleVertices, onTriangleVertexMove, getMousePos, gridSpacing, canvasSize.width, canvasSize.height]);


  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!draggingVertexKey || !onTriangleVertexMove || !triangleVertices || !canvasRef.current || isNaN(canvasSize.width) || isNaN(canvasSize.height)) return;
    
    let mousePos = getMousePos(event);
    
    const snappedX = Math.round(mousePos.x / gridSpacing) * gridSpacing;
    const snappedY = Math.round(mousePos.y / gridSpacing) * gridSpacing;

    const clampedX = Math.max(DRAG_HANDLE_RADIUS, Math.min(snappedX, canvasSize.width - DRAG_HANDLE_RADIUS));
    const clampedY = Math.max(DRAG_HANDLE_RADIUS, Math.min(snappedY, canvasSize.height - DRAG_HANDLE_RADIUS));

    onTriangleVertexMove(draggingVertexKey, { x: clampedX, y: clampedY });
  }, [draggingVertexKey, onTriangleVertexMove, triangleVertices, getMousePos, gridSpacing, canvasSize.width, canvasSize.height]);
  
  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (draggingVertexKey) {
        setDraggingVertexKey(null);
        canvasRef.current?.releasePointerCapture(event.pointerId); // Release pointer
    }
  }, [draggingVertexKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !draggingVertexKey) return;

    // These listeners are for movements outside the canvas while dragging
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingVertexKey, handlePointerMove, handlePointerUp]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isNaN(canvasSize.width) || isNaN(canvasSize.height) || canvasSize.width === 0 || canvasSize.height === 0) return;
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
    const themePrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3B82F6';
    const themeMutedFgColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim() || '#64748b';
    const themeGridColor = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#d1d5db'; // Tailwind slate-300
    const themeAxisColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#111827';


    ctx.save();
    // Correct transform for Cartesian coordinates (origin bottom-left, Y increases upwards)
    ctx.translate(0, canvasSize.height); 
    ctx.scale(1, -1);

    // Draw Grid
    ctx.strokeStyle = themeGridColor;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvasSize.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasSize.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }

    // Draw Axes
    if (showAxes) {
      ctx.strokeStyle = themeAxisColor; 
      ctx.lineWidth = 1.5;
      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, 0); // Origin is now (0,0) in math coords
      ctx.lineTo(canvasSize.width, 0);
      ctx.stroke();
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, canvasSize.height);
      ctx.stroke();
    }
    
    // Shape drawing (uses math Cartesian coords after transform)
    // Note: triangleVertices are still in screen coords (top-down Y)
    // The transform handles converting them visually
    ctx.strokeStyle = themePrimaryColor;
    ctx.lineWidth = 2;

    if (shapeType === 'triangle' && triangleVertices) {
      const { A, B, C } = triangleVertices; // These are screen coordinates
      ctx.beginPath();
      ctx.moveTo(A.x, A.y); // Draw using screen coords within the transformed context
      ctx.lineTo(B.x, B.y);
      ctx.lineTo(C.x, C.y);
      ctx.closePath();
      ctx.stroke();

      Object.entries(triangleVertices).forEach(([key, vertex]) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, DRAG_HANDLE_RADIUS, 0, 2 * Math.PI);
        const isCurrentDragging = draggingVertexKey === key as keyof TriangleVertices;
        ctx.fillStyle = isCurrentDragging ? themePrimaryColor : `${themePrimaryColor}BB`;
        ctx.fill();
        ctx.strokeStyle = themePrimaryColor; // Border for handle
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    } else if (shapeType === 'circle') {
       const centerX = canvasSize.width / 2;
       const centerY = canvasSize.height / 2;
       const visualRadius = Math.min(canvasSize.width, canvasSize.height) / 3;
       ctx.beginPath();
       // Drawing in transformed context means centerY is from bottom
       ctx.arc(centerX, centerY, visualRadius, 0, 2 * Math.PI);
       ctx.stroke();
    } else if (shapeType === 'square') {
        const side = Math.min(canvasSize.width, canvasSize.height) * 0.5;
        const x = (canvasSize.width - side) / 2;
        const y = (canvasSize.height - side) / 2; // Y from bottom in transformed context
        ctx.strokeRect(x, y, side, side);
    } else if (shapeType === 'trapezium') {
        const base1 = canvasSize.width * 0.3;
        const base2 = canvasSize.width * 0.6;
        const height = canvasSize.height * 0.4;
        const yBottom = (canvasSize.height - height) / 2; // Y from bottom
        const yTop = yBottom + height;
        const xTop1 = (canvasSize.width - base1) / 2;
        const xTop2 = (canvasSize.width + base1) / 2;
        const xBottom1 = (canvasSize.width - base2) / 2;
        const xBottom2 = (canvasSize.width + base2) / 2;
        ctx.beginPath();
        ctx.moveTo(xTop1, yTop);
        ctx.lineTo(xTop2, yTop);
        ctx.lineTo(xBottom2, yBottom);
        ctx.lineTo(xBottom1, yBottom);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.restore(); // Restore to original canvas coordinates (top-left origin) for text

    if (showTicks) {
      ctx.fillStyle = themeMutedFgColor;
      ctx.font = '10px Inter, Arial, sans-serif';
      // X-axis Ticks & Labels
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let x = 0; x <= canvasSize.width; x += gridSpacing * 2) {
        if (x === 0 && gridSpacing*2 > 20 && canvasSize.height - (gridSpacing / 2) + 5 > canvasSize.height - 15) continue; // Avoid overlap for origin '0' if too close
        ctx.fillText(x.toString(), x, canvasSize.height - gridSpacing + 8); // Adjusted y for better positioning below axis
      }
      // Y-axis Ticks & Labels
      ctx.textAlign = 'right'; 
      ctx.textBaseline = 'middle';
      for (let y = gridSpacing * 2; y <= canvasSize.height; y += gridSpacing * 2) {
         // Label text is math value (0 at bottom)
        ctx.fillText((canvasSize.height - y).toString(), gridSpacing - 8, y); 
      }
      // Origin '0' label
      ctx.font = 'bold 12px Inter, Arial, sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'top';
      ctx.fillText("0", gridSpacing - 8, canvasSize.height - gridSpacing + 8);
    }

    if (shapeType === 'triangle' && triangleVertices) {
        Object.entries(triangleVertices).forEach(([key, vertex]) => { // vertex x,y are screen coords
            ctx.font = 'bold 12px Inter, Arial, sans-serif';
            ctx.fillStyle = themeAxisColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Label positioning logic based on screen coordinates
            let labelOffsetX = 0;
            let labelOffsetY = -(DRAG_HANDLE_RADIUS + 10); 
            // If vertex is near top of canvas, move label below
            if (vertex.y < DRAG_HANDLE_RADIUS * 2 + 15) labelOffsetY = DRAG_HANDLE_RADIUS + 12; 
            // If vertex is near left/right edges, adjust horizontal alignment
            if (vertex.x < DRAG_HANDLE_RADIUS * 2 + 20) { labelOffsetX = DRAG_HANDLE_RADIUS + 10; ctx.textAlign = 'left'; }
            if (vertex.x > canvasSize.width - (DRAG_HANDLE_RADIUS * 2 + 20)) { labelOffsetX = -(DRAG_HANDLE_RADIUS + 10); ctx.textAlign = 'right'; }
            
            ctx.fillText(key, vertex.x + labelOffsetX, vertex.y + labelOffsetY);
        });
    } else if (shapeType !== 'triangle') { 
        ctx.fillStyle = themeMutedFgColor;
        ctx.font = '12px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        let title = shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
        if (shapeType === 'circle') {
            const visualRadius = Math.min(canvasSize.width, canvasSize.height) / 3;
            title = `Circle (Radius: ${visualRadius.toFixed(0)})`;
        } else if (shapeType === 'square') {
            const side = Math.min(canvasSize.width, canvasSize.height) * 0.5;
            title = `Square (Side: ${side.toFixed(0)})`;
        }
        ctx.fillText(title, canvasSize.width / 2, 10); 
    }

  }, [shapeType, triangleVertices, draggingVertexKey, canvasSize, gridSpacing, showAxes, showTicks, getMousePos]);

  return (
    <canvas 
      ref={canvasRef} 
      // Width and height are now set in useEffect via state
      className={cn(
        "border border-input rounded-md bg-background w-full h-full", // w-full and h-full to respect parent
        shapeType === 'triangle' && !draggingVertexKey && "cursor-grab",
        shapeType === 'triangle' && draggingVertexKey && "cursor-grabbing"
      )}
      aria-label={`Interactive canvas for ${shapeType}`}
      onPointerDown={shapeType === 'triangle' ? handlePointerDown : undefined}
      // onPointerMove and onPointerUp for dragging outside are handled by document listeners
    >
      Canvas for {shapeType} (fallback text)
    </canvas>
  );
}

