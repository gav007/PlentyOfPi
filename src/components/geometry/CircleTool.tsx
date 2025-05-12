
'use client';

import HowToUseToggle from '@/components/ui/HowToUseToggle'; // Updated path
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300; // Keep as is, or adjust for consistency

export default function CircleTool() {
  const instructions = "Interactive Circle Tool: Adjust the circle's radius using the input field. The tool will live-calculate and display the circle's area, circumference, and diameter. The canvas shows a visual representation with the origin (0,0) at the bottom-left.";
  
  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} title="How to Use Circle Tool" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:flex-1 md:max-w-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Circle Inputs</CardTitle>
              <CardDescription>Adjust radius value.</CardDescription>
            </CardHeader>
            <CardContent>
              <ShapeForm shapeType="circle" />
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Visual Representation</CardTitle>
              <CardDescription>A sample circle is displayed on the coordinate grid.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-2 md:p-4 bg-muted/10 rounded-md min-h-[300px] md:min-h-[auto]">
              <CanvasRenderer 
                shapeType="circle" 
                canvasWidth={CANVAS_WIDTH}
                canvasHeight={CANVAS_HEIGHT}
                gridSpacing={25} // Example grid spacing
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <ResultsDisplay shapeType="circle" />
    </div>
  );
}
