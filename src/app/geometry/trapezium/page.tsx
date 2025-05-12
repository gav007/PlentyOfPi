
import type { Metadata } from 'next';
import TrapeziumTool from '@/components/geometry/TrapeziumTool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutPanelLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Trapezium Calculator | Geometry Tools | Plenty of π',
  description: 'Explore and calculate properties of trapeziums interactively. Find area, perimeter, and more.',
};

export default function TrapeziumToolPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <LayoutPanelLeft className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-bold text-primary">
            Interactive Trapezium Calculator
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Dynamically calculate area and other properties of a trapezium.
            Adjust bases and height to see live updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrapeziumTool />
        </CardContent>
      </Card>
    </div>
  );
}
