
'use client';

import HowToUseToggle from './HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CircleTool() {
  const instructions = "Interactive Circle Tool: Adjust the circle's radius using the input field or by dragging the radius handle on the canvas. The tool will live-calculate and display the circle's area, circumference, and diameter.";
  
  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Circle Inputs</CardTitle>
            <CardDescription>Adjust radius or drag the shape.</CardDescription>
          </CardHeader>
          <CardContent>
            <ShapeForm shapeType="circle" />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Visual Representation</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px] bg-muted/20 rounded-md">
            <CanvasRenderer shapeType="circle" />
          </CardContent>
        </Card>
      </div>
      <ResultsDisplay shapeType="circle" />
    </div>
  );
}
