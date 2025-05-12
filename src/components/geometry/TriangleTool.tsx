'use client';

import * as React from 'react';
import HowToUseToggle from './HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Point, TriangleVertices, TriangleSides, TriangleAngles } from '@/lib/geometry/triangleUtils';
import { calculateSideLengths, calculateAngles, calculateArea, calculatePerimeter, classifyTriangle } from '@/lib/geometry/triangleUtils';

const CANVAS_WIDTH = 400; // Define canvas width
const CANVAS_HEIGHT = 300; // Define canvas height

export default function TriangleTool() {
  const instructions = "Interactive Triangle Tool: Drag the vertices (A, B, C) of the triangle on the canvas, or enter their coordinates in the form below. The tool will dynamically calculate and display the triangle's side lengths, angles, area, perimeter, and type.";

  const [vertices, setVertices] = React.useState<TriangleVertices>({
    A: { x: 50, y: CANVAS_HEIGHT - 50 },
    B: { x: CANVAS_WIDTH - 50, y: CANVAS_HEIGHT - 50 },
    C: { x: CANVAS_WIDTH / 2, y: 50 },
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
    setVertices(prev => ({
      ...prev,
      [vertexKey]: {
        ...prev[vertexKey],
        [coord]: value,
      },
    }));
  };
  
  const handleCanvasVertexMove = (vertexKey: keyof TriangleVertices, newPosition: Point) => {
    // Clamp position to canvas bounds
    const clampedX = Math.max(0, Math.min(CANVAS_WIDTH, newPosition.x));
    const clampedY = Math.max(0, Math.min(CANVAS_HEIGHT, newPosition.y));
    
    setVertices(prev => ({
      ...prev,
      [vertexKey]: { x: clampedX, y: clampedY },
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
            <CardDescription>Adjust values or drag points on the canvas.</CardDescription>
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
             <CardDescription>Drag points A, B, or C to reshape.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[340px] bg-muted/20 rounded-md p-0">
            <CanvasRenderer
              shapeType="triangle"
              triangleVertices={vertices}
              onTriangleVertexMove={handleCanvasVertexMove}
              canvasWidth={CANVAS_WIDTH}
              canvasHeight={CANVAS_HEIGHT}
            />
          </CardContent>
        </Card>
      </div>
      <ResultsDisplay shapeType="triangle" results={results} />
    </div>
  );
}