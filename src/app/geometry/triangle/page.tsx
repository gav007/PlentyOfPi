
import type { Metadata } from 'next';
import TriangleTool from '@/components/geometry/TriangleTool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Triangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Triangle Calculator | Geometry Tools | Plenty of π',
  description: 'Explore and calculate properties of triangles interactively. Drag vertices on a coordinate grid, or input values to see live updates for area, perimeter, angles, and more.',
};

export default function TriangleToolPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Triangle className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-bold text-primary">
            Interactive Triangle Calculator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Dynamically calculate area, perimeter, and angles of a triangle.
            Drag vertices on the coordinate grid or input values to see live updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TriangleTool />
        </CardContent>
      </Card>
    </div>
  );
}

