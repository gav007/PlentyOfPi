// src/components/geometry/TriangleTool.tsx
'use client';

import * as React from 'react';
import HowToUseToggle from './HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Point, TriangleVertices, TriangleSides, TriangleAngles } from '@/lib/geometry/triangleUtils';
import { calculateSideLengths, calculateAngles, calculateArea, calculatePerimeter, classifyTriangle } from '@/lib/geometry/triangleUtils';

const CANVAS_WIDTH = 400; 
const CANVAS_HEIGHT = 350; // Adjusted height for better card fit
const GRID_SPACING = 25;

export default function TriangleTool() {
  const instructions = "Interactive Triangle Tool: Drag the vertices (A, B, C) of the triangle on the canvas, or enter their coordinates in the form below. Vertices will snap to the grid. The tool will dynamically calculate and display the triangle's side lengths, angles, area, perimeter, and type.";

  const [vertices, setVertices] = React.useState<TriangleVertices>({
    A: { x: GRID_SPACING * 2, y: CANVAS_HEIGHT - GRID_SPACING * 2 }, // Snap initial to grid
    B: { x: CANVAS_WIDTH - GRID_SPACING * 2, y: CANVAS_HEIGHT - GRID_SPACING * 2 },
    C: { x: Math.round((CANVAS_WIDTH / 2) / GRID_SPACING) * GRID_SPACING, y: GRID_SPACING * 2 },
  });

  const [sides, setSides] = React.useState<TriangleSides>({ a: 0, b: 0, c: 0 });
  const [angles, setAngles] = React.useState<TriangleAngles>({ A: 0, B: 0, C: 0 });
  const [area, setArea] = React.useState<number>(0);
  const [perimeter, setPerimeter] = React.useState<number>(0);
  const [triangleType, setTriangleType] = React.useState<string>("N/A");

  React.useEffect(() => {
    const newSides = calculateSideLengths(vertices);
    setSides(newSides);
    const newAngles = calculateAngles(newSides);
    setAngles(newAngles);
    setArea(calculateArea(newSides));
    setPerimeter(calculatePerimeter(newSides));
    setTriangleType(classifyTriangle(newSides, newAngles));
  }, [vertices]);

  const handleVertexChange = (vertexKey: keyof TriangleVertices, coord: 'x' | 'y', value: number) => {
    // Ensure value is a multiple of gridSpacing if manual input should also snap, or allow free input.
    // For now, manual input is free, canvas drag snaps.
    const clampedValue = Math.max(0, Math.min(value, coord === 'x' ? CANVAS_WIDTH : CANVAS_HEIGHT));
    setVertices(prev => ({
      ...prev,
      [vertexKey]: {
        ...prev[vertexKey],
        [coord]: clampedValue,
      },
    }));
  };
  
  const handleCanvasVertexMove = (vertexKey: keyof TriangleVertices, newPosition: Point) => {
    // newPosition is already snapped and clamped by CanvasRenderer
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
      <HowToUseToggle instructions={instructions} />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Triangle Inputs (Vertex Coordinates)</CardTitle>
            <CardDescription>Adjust values or drag points on the canvas (snaps to grid).</CardDescription>
          </CardHeader>
          <CardContent>
            <ShapeForm
              shapeType="triangle"
              triangleVertices={vertices}
              onTriangleVertexChange={handleVertexChange}
            />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Visual Representation</CardTitle>
             <CardDescription>Drag points A, B, or C to reshape. Grid spacing: {GRID_SPACING}px.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 bg-muted/10 rounded-md">
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
      <ResultsDisplay shapeType="triangle" results={results} />
    </div>
  );
}
