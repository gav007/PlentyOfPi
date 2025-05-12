
'use client';

import { useEffect, useRef } from 'react';

interface CanvasRendererProps {
  shapeType: 'triangle' | 'circle' | 'square' | 'trapezium';
  // Add more props as needed, e.g., dimensions, points, interactive handlers
}

export default function CanvasRenderer({ shapeType }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Basic drawing logic placeholder
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'hsl(var(--primary))';
    ctx.font = '16px Arial';
    
    // Center the text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Placeholder text
    let textToDraw = `Drawing area for ${shapeType}`;
    if (shapeType === 'triangle') {
      // Example: Draw a simple triangle
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 50);
      ctx.lineTo(50, canvas.height - 50);
      ctx.lineTo(canvas.width - 50, canvas.height - 50);
      ctx.closePath();
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 2;
      ctx.stroke();
      textToDraw = `Interactive ${shapeType}`;
    } else if (shapeType === 'circle') {
       ctx.beginPath();
       ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height)/3 , 0, 2 * Math.PI);
       ctx.strokeStyle = 'hsl(var(--primary))';
       ctx.lineWidth = 2;
       ctx.stroke();
       textToDraw = `Interactive ${shapeType}`;
    } else {
        ctx.fillRect(canvas.width/2 - 50, canvas.height/2 - 25, 100, 50);
    }


    // Draw placeholder text slightly above center if shape drawn
    const textY = shapeType === 'triangle' || shapeType === 'circle' ? 30 : canvas.height / 2;
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    ctx.fillText(textToDraw, canvas.width / 2, textY);


  }, [shapeType]); // Redraw when shapeType changes (or other relevant props)

  return (
    <canvas 
      ref={canvasRef} 
      width={300}  // Default size, can be responsive
      height={200} // Default size, can be responsive
      className="border border-border rounded-md bg-background"
      aria-label={`Interactive canvas for ${shapeType}`}
    >
      Canvas for {shapeType} (fallback text)
    </canvas>
  );
}
