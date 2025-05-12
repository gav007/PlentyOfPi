
// src/components/geometry/TriangleTool.tsx
'use client';

import * as React from 'react';
import HowToUseToggle from '@/components/ui/HowToUseToggle'; // Updated path
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Point, TriangleVertices, TriangleSides, TriangleAngles } from '@/lib/geometry/triangleUtils';
import { calculateSideLengths, calculateAngles, calculateArea, calculatePerimeter, classifyTriangle } from '@/lib/geometry/triangleUtils';

const CANVAS_WIDTH = 400; 
const CANVAS_HEIGHT = 350;
const GRID_SPACING = 25; // Grid spacing in pixels

export default function TriangleTool() {
  const instructions = "Drag the vertices (A, B, C) of the triangle on the canvas, or enter their coordinates in the form below. Vertices will snap to the grid, where each grid unit represents 1 unit for calculations (e.g., 25 pixels = 1 math unit if scaling). The tool will dynamically calculate and display the triangle's side lengths, angles, area, perimeter, and type. The origin (0,0) is at the bottom-left of the canvas.";

  // Initialize vertices based on pixel coordinates within the canvas dimensions.
  // These are now interpreted as direct pixel values for the canvas.
  const [vertices, setVertices] = React.useState<TriangleVertices>({
    A: { x: GRID_SPACING * 2, y: CANVAS_HEIGHT - GRID_SPACING * 2 },
    B: { x: CANVAS_WIDTH - GRID_SPACING * 2, y: CANVAS_HEIGHT - GRID_SPACING * 2 },
    C: { x: Math.round((CANVAS_WIDTH / 2) / GRID_SPACING) * GRID_SPACING, y: GRID_SPACING * 2 },
  });

  const [sides, setSides] = React.useState<TriangleSides>({ a: 0, b: 0, c: 0 });
  const [angles, setAngles] = React.useState<TriangleAngles>({ A: 0, B: 0, C: 0 });
  const [area, setArea] = React.useState<number>(0);
  const [perimeter, setPerimeter] = React.useState<number>(0);
  const [triangleType, setTriangleType] = React.useState<string>("N/A");

  // Function to convert canvas pixel coordinates to math units if needed
  // For now, assuming 1 pixel = 1 math unit for simplicity in calculations based on vertex positions
  const toMathUnits = (pixelValue: number): number => pixelValue; // Or pixelValue / GRID_SPACING if grid represents units

  React.useEffect(() => {
    // Create math-unit vertices if calculations depend on unit scaling
    // For this example, calculations are direct from pixel positions, assuming 1px = 1 unit.
    // If GRID_SPACING represents a "math unit", then:
    // const mathA = { x: vertices.A.x / GRID_SPACING, y: (CANVAS_HEIGHT - vertices.A.y) / GRID_SPACING }; // Y flipped for math
    // const mathB = { x: vertices.B.x / GRID_SPACING, y: (CANVAS_HEIGHT - vertices.B.y) / GRID_SPACING };
    // const mathC = { x: vertices.C.x / GRID_SPACING, y: (CANVAS_HEIGHT - vertices.C.y) / GRID_SPACING };
    // const mathVertices = {A: mathA, B: mathB, C: mathC};
    // For direct pixel calculation:
    const mathVertices = {
        A: {x: vertices.A.x, y: CANVAS_HEIGHT - vertices.A.y}, // Y is flipped for calculation (origin bottom-left)
        B: {x: vertices.B.x, y: CANVAS_HEIGHT - vertices.B.y},
        C: {x: vertices.C.x, y: CANVAS_HEIGHT - vertices.C.y},
    }

    const newSides = calculateSideLengths(mathVertices);
    setSides(newSides);
    const newAngles = calculateAngles(newSides);
    setAngles(newAngles);
    setArea(calculateArea(newSides));
    setPerimeter(calculatePerimeter(newSides));
    setTriangleType(classifyTriangle(newSides, newAngles));
  }, [vertices]);

  const handleVertexChange = (vertexKey: keyof TriangleVertices, coord: 'x' | 'y', value: number) => {
    const snappedValue = Math.round(value / GRID_SPACING) * GRID_SPACING;
    const clampedValue = Math.max(
        DRAG_HANDLE_RADIUS, // From CanvasRenderer, assuming it's exported or defined similarly
        Math.min(snappedValue, (coord === 'x' ? CANVAS_WIDTH : CANVAS_HEIGHT) - DRAG_HANDLE_RADIUS)
    );
    setVertices(prev => ({
      ...prev,
      [vertexKey]: {
        ...prev[vertexKey],
        [coord]: clampedValue,
      },
    }));
  };
  
  const handleCanvasVertexMove = (vertexKey: keyof TriangleVertices, newPosition: Point) => {
    setVertices(prev => ({
      ...prev,
      [vertexKey]: newPosition, // newPosition is already snapped and clamped by CanvasRenderer
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
  
  // Define DRAG_HANDLE_RADIUS if not imported from CanvasRenderer (for clamping in handleVertexChange)
  const DRAG_HANDLE_RADIUS = 8; 

  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} title="How to Use Triangle Tool" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:flex-1 md:max-w-sm"> {/* Inputs Card takes less space on larger screens */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Triangle Inputs</CardTitle>
              <CardDescription>Adjust vertex coordinates (snaps to grid) or drag points on canvas.</CardDescription>
            </CardHeader>
            <CardContent>
              <ShapeForm
                shapeType="triangle"
                triangleVertices={vertices} // Pass pixel-based vertices to form
                onTriangleVertexChange={handleVertexChange}
              />
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:flex-1"> {/* Canvas Card takes more space */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Visual Representation</CardTitle>
              <CardDescription>Grid spacing: {GRID_SPACING}px. Origin (0,0) at bottom-left.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-2 md:p-4 bg-muted/10 rounded-md min-h-[350px] md:min-h-[auto]">
              <CanvasRenderer
                shapeType="triangle"
                triangleVertices={vertices}
                onTriangleVertexMove={handleCanvasVertexMove}
                canvasWidth={CANVAS_WIDTH}
                canvasHeight={CANVAS_HEIGHT}
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
