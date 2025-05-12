
'use client';

import HowToUseToggle from './HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SquareTool() {
  const instructions = "Interactive Square Tool: Modify the square's side length via the input field or by dragging a corner of the square on the canvas. All sides will adjust equally. The tool will display the calculated area, perimeter, and diagonal length in real-time.";

  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Square Inputs</CardTitle>
            <CardDescription>Adjust side length or drag the shape.</CardDescription>
          </CardHeader>
          <CardContent>
            <ShapeForm shapeType="square" />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Visual Representation</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px] bg-muted/20 rounded-md">
            <CanvasRenderer shapeType="square" />
          </CardContent>
        </Card>
      </div>
      <ResultsDisplay shapeType="square" />
    </div>
  );
}
