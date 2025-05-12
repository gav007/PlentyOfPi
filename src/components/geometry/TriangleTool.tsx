
// src/components/geometry/TriangleTool.tsx
'use client';

import * as React from 'react';
import HowToUseToggle from '@/components/ui/HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Point, TriangleVertices, TriangleSides, TriangleAngles } from '@/lib/geometry/triangleUtils';
import { calculateSideLengths, calculateAngles, calculateArea, calculatePerimeter, classifyTriangle } from '@/lib/geometry/triangleUtils';

const INITIAL_CANVAS_WIDTH = 400; 
const INITIAL_CANVAS_HEIGHT = 300; // Maintained for 4:3 aspect ratio initially
const GRID_SPACING = 25; 

export default function TriangleTool() {
  const instructions = "Drag the vertices (A, B, C) of the triangle on the canvas, or enter their coordinates in the form below. Vertices will snap to the grid. The tool will dynamically calculate and display the triangle's side lengths, angles, area, perimeter, and type. The origin (0,0) is at the bottom-left of the canvas.";
  
  const DRAG_HANDLE_RADIUS = 8; // Consistent with CanvasRenderer

  const [vertices, setVertices] = React.useState<TriangleVertices>({
    A: { x: GRID_SPACING * 2, y: GRID_SPACING * 2 }, // Initial Y is top-down screen coord
    B: { x: INITIAL_CANVAS_WIDTH - GRID_SPACING * 2, y: GRID_SPACING * 2 },
    C: { x: Math.round((INITIAL_CANVAS_WIDTH / 2) / GRID_SPACING) * GRID_SPACING, y: INITIAL_CANVAS_HEIGHT - GRID_SPACING * 2 },
  });

  const [sides, setSides] = React.useState<TriangleSides>({ a: 0, b: 0, c: 0 });
  const [angles, setAngles] = React.useState<TriangleAngles>({ A: 0, B: 0, C: 0 });
  const [area, setArea] = React.useState<number>(0);
  const [perimeter, setPerimeter] = React.useState<number>(0);
  const [triangleType, setTriangleType] = React.useState<string>("N/A");


  React.useEffect(() => {
    // For calculations, convert screen Y (top-down) to math Y (bottom-up) based on a nominal height.
    // Since canvas is responsive, this nominal height is for calculation consistency if vertices were based on it.
    // However, as vertices are in screen coords, their diffs for side lengths are correct.
    // The critical part is that the *display* in CanvasRenderer flips.
    // Calculations should use the direct vertex values as they represent relative positions.
    
    // Example: If canvas height is H, and vertex Y is screen_y (from top),
    // its math_y (from bottom, assuming origin at bottom-left of the drawing area) is H - screen_y.
    // However, distance formula (sqrt((x2-x1)^2 + (y2-y1)^2)) works the same with screen_y.
    // The angles also depend on side lengths, so they are fine.
    
    const mathVerticesForCalc = { // Not strictly needed if side lengths are direct pixel diffs
        A: {x: vertices.A.x, y: vertices.A.y}, 
        B: {x: vertices.B.x, y: vertices.B.y},
        C: {x: vertices.C.x, y: vertices.C.y},
    };

    const newSides = calculateSideLengths(mathVerticesForCalc);
    setSides(newSides);
    const newAngles = calculateAngles(newSides);
    setAngles(newAngles);
    setArea(calculateArea(newSides));
    setPerimeter(calculatePerimeter(newSides));
    setTriangleType(classifyTriangle(newSides, newAngles));
  }, [vertices]);

  const handleVertexChange = (vertexKey: keyof TriangleVertices, coord: 'x' | 'y', value: number) => {
    // This function receives values from the input form, which should be math units
    // These need to be snapped and clamped based on the *current* canvas size.
    // This part is tricky if form inputs are absolute math units and canvas is responsive.
    // For now, assume form inputs are also pixel-like values that snap to grid.
    const canvasWidth = canvasRef.current?.width || INITIAL_CANVAS_WIDTH; // Get current canvas width
    const canvasHeight = canvasRef.current?.height || INITIAL_CANVAS_HEIGHT; // Get current canvas height

    const snappedValue = Math.round(value / GRID_SPACING) * GRID_SPACING;
    const clampedValue = Math.max(
        DRAG_HANDLE_RADIUS, 
        Math.min(snappedValue, (coord === 'x' ? canvasWidth : canvasHeight) - DRAG_HANDLE_RADIUS)
    );
    setVertices(prev => ({
      ...prev,
      [vertexKey]: {
        ...prev[vertexKey],
        [coord]: clampedValue,
      },
    }));
  };
  
  // Ref for canvas element to get its current size for clamping in form input
  const canvasRef = React.useRef<HTMLCanvasElement>(null);


  const handleCanvasVertexMove = (vertexKey: keyof TriangleVertices, newPosition: Point) => {
    // newPosition from CanvasRenderer is already snapped and clamped based on its current dimensions
    setVertices(prev => ({
      ...prev,
      [vertexKey]: newPosition,
    }));
  };

  const results = {
    'Side a (BC)': sides.a.toFixed(2),
    'Side b (AC)': sides.b.toFixed(2),
    'Side c (AB)': sides.c.toFixed(2),
    'Angle A': angles.A.toFixed(1) + '°',
    'Angle B': angles.B.toFixed(1) + '°',
    'Angle C': angles.C.toFixed(1) + '°',
    'Area': area.toFixed(2),
    'Perimeter': perimeter.toFixed(2),
    'Type': triangleType,
  };
  
  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} title="How to Use Triangle Tool" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:flex-1 md:max-w-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Triangle Inputs</CardTitle>
              <CardDescription>Adjust vertex coordinates (snaps to grid) or drag points on canvas.</CardDescription>
            </CardHeader>
            <CardContent>
              <ShapeForm
                shapeType="triangle"
                triangleVertices={vertices}
                onTriangleVertexChange={handleVertexChange}
              />
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Visual Representation</CardTitle>
              <CardDescription>Grid spacing: {GRID_SPACING}px. Origin (0,0) at bottom-left.</CardDescription>
            </CardHeader>
            {/* Parent div for responsive canvas */}
            <CardContent className="flex items-center justify-center p-2 md:p-4 bg-muted/10 rounded-md aspect-[4/3] min-h-[300px] md:min-h-[auto]">
              <CanvasRenderer
                // Pass ref to CanvasRenderer if it needs to know its own actual rendered size for some internal calcs
                // Or, CanvasRenderer can manage its own ref. For now, let CSS handle sizing.
                shapeType="triangle"
                triangleVertices={vertices}
                onTriangleVertexMove={handleCanvasVertexMove}
                initialCanvasWidth={INITIAL_CANVAS_WIDTH} // Pass initial for fallback
                initialCanvasHeight={INITIAL_CANVAS_HEIGHT} // Pass initial for fallback
                gridSpacing={GRID_SPACING}
                showAxes={true}
                showTicks={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <ResultsDisplay shapeType="triangle" results={results} />
    </div>
  );
}
