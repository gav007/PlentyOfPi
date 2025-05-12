
import type { Metadata } from 'next';
import SquareTool from '@/components/geometry/SquareTool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Square } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Square Calculator | Geometry Tools | Plenty of π',
  description: 'Explore and calculate properties of squares interactively. Find area, perimeter, diagonal, and more.',
};

export default function SquareToolPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <Square className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-bold text-primary">
            Interactive Square Calculator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Dynamically calculate area, perimeter, and diagonal of a square.
            Adjust side length to see live updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SquareTool />
        </CardContent>
      </Card>
    </div>
  );
}
