
import type { Metadata } from 'next';
import CircleTool from '@/components/geometry/CircleTool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Circle Calculator | Geometry Tools | Plenty of π',
  description: 'Explore and calculate properties of circles interactively. Find area, circumference, diameter, and more.',
};

export default function CircleToolPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Circle className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-bold text-primary">
            Interactive Circle Calculator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Dynamically calculate area, circumference, and diameter of a circle.
            Adjust radius to see live updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CircleTool />
        </CardContent>
      </Card>
    </div>
  );
}
