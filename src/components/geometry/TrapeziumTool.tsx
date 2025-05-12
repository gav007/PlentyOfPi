
'use client';

import HowToUseToggle from './HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrapeziumTool() {
  const instructions = "Interactive Trapezium Tool: Input the lengths of the two parallel bases (top and bottom) and the height. You can also drag the bases or adjust the height line on the canvas. The tool will calculate and display the trapezium's area and perimeter.";

  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trapezium Inputs</CardTitle>
            <CardDescription>Adjust bases, height, or drag the shape.</CardDescription>
          </CardHeader>
          <CardContent>
            <ShapeForm shapeType="trapezium" />
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
            <CardTitle>Visual Representation</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px] bg-muted/20 rounded-md">
            <CanvasRenderer shapeType="trapezium" />
          </CardContent>
        </Card>
      </div>
      <ResultsDisplay shapeType="trapezium" />
    </div>
  );
}
