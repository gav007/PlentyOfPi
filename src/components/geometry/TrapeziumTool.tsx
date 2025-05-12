
'use client';

import HowToUseToggle from '@/components/ui/HowToUseToggle';
import ShapeForm from './ShapeForm';
import CanvasRenderer from './CanvasRenderer';
import ResultsDisplay from './ResultsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const INITIAL_CANVAS_WIDTH = 400;
const INITIAL_CANVAS_HEIGHT = 300; // For 4:3 aspect ratio

export default function TrapeziumTool() {
  const instructions = "Interactive Trapezium Tool: Input the lengths of the two parallel bases (top and bottom) and the height. The tool will calculate and display the trapezium's area and perimeter. The canvas shows a visual representation on a coordinate grid with origin (0,0) at the bottom-left.";

  return (
    <div className="space-y-6">
      <HowToUseToggle instructions={instructions} title="How to Use Trapezium Tool" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:flex-1 md:max-w-sm">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Trapezium Inputs</CardTitle>
              <CardDescription>Adjust bases and height.</CardDescription>
            </CardHeader>
            <CardContent>
              <ShapeForm shapeType="trapezium" />
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Visual Representation</CardTitle>
              <CardDescription>A sample trapezium is displayed on the coordinate grid.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-2 md:p-4 bg-muted/10 rounded-md aspect-[4/3] min-h-[300px] md:min-h-[auto]">
              <CanvasRenderer 
                shapeType="trapezium"
                initialCanvasWidth={INITIAL_CANVAS_WIDTH}
                initialCanvasHeight={INITIAL_CANVAS_HEIGHT}
                gridSpacing={25}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <ResultsDisplay shapeType="trapezium" />
    </div>
  );
}
