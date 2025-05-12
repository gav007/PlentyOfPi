
'use client';

import HowToUseToggle from './HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function TriangleTool() {
  const instructions = "Interactive Triangle Tool: Drag the vertices of the triangle on the canvas, or enter side lengths/angles in the form below. The tool will dynamically calculate and display the triangle's properties like area, perimeter, and other angles. Toggle visual aids like height or angle labels using the controls.";

  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Triangle Inputs</CardTitle>
            <CardDescription>Adjust values or drag the shape.</CardDescription>
          </CardHeader>
          <CardContent>
            <ShapeForm shapeType="triangle" />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Visual Representation</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px] bg-muted/20 rounded-md">
            <CanvasRenderer shapeType="triangle" />
          </CardContent>
        </Card>
      </div>
      <ResultsDisplay shapeType="triangle" />
    </div>
  );
}
