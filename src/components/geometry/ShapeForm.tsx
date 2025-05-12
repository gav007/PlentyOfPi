'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Button removed as calculation is now live
// import { Button } from '@/components/ui/button';
import type { TriangleVertices, Point } from '@/lib/geometry/triangleUtils';

interface ShapeFormProps {
  shapeType: 'triangle' | 'circle' | 'square' | 'trapezium';
  triangleVertices?: TriangleVertices;
  onTriangleVertexChange?: (vertexKey: keyof TriangleVertices, coord: 'x' | 'y', value: number) => void;
  // Add more props for other shapes as needed
}

export default function ShapeForm({
  shapeType,
  triangleVertices,
  onTriangleVertexChange,
}: ShapeFormProps) {

  const handleTriangleInputChange = (
    vertexKey: keyof TriangleVertices,
    coord: 'x' | 'y',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onTriangleVertexChange) {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        onTriangleVertexChange(vertexKey, coord, value);
      }
    }
  };

  const renderFormFields = () => {
    switch (shapeType) {
      case 'triangle':
        if (!triangleVertices || !onTriangleVertexChange) return <p>Triangle data not available.</p>;
        return (
          <div className="space-y-4">
            {(['A', 'B', 'C'] as const).map(vertexKey => (
              <div key={vertexKey} className="grid grid-cols-2 gap-3 items-center">
                <Label className="font-semibold col-span-2">Vertex {vertexKey}</Label>
                <div>
                  <Label htmlFor={`${vertexKey}-x`} className="text-xs">X:</Label>
                  <Input
                    id={`${vertexKey}-x`}
                    type="number"
                    value={triangleVertices[vertexKey].x.toFixed(0)} // Show integer part for simplicity
                    onChange={(e) => handleTriangleInputChange(vertexKey, 'x', e)}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor={`${vertexKey}-y`} className="text-xs">Y:</Label>
                  <Input
                    id={`${vertexKey}-y`}
                    type="number"
                    value={triangleVertices[vertexKey].y.toFixed(0)} // Show integer part for simplicity
                    onChange={(e) => handleTriangleInputChange(vertexKey, 'y', e)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case 'circle':
        return (
          <div>
            <Label htmlFor="radius">Radius</Label>
            <Input id="radius" type="number" placeholder="e.g., 10" />
          </div>
        );
      case 'square':
        return (
          <div>
            <Label htmlFor="sideLength">Side Length</Label>
            <Input id="sideLength" type="number" placeholder="e.g., 8" />
          </div>
        );
      case 'trapezium':
        return (
          <>
            <div>
              <Label htmlFor="base1">Base 1 (Top)</Label>
              <Input id="base1" type="number" placeholder="e.g., 6" />
            </div>
            <div>
              <Label htmlFor="base2">Base 2 (Bottom)</Label>
              <Input id="base2" type="number" placeholder="e.g., 10" />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input id="height" type="number" placeholder="e.g., 4" />
            </div>
          </>
        );
      default:
        return <p>Select a shape type.</p>;
    }
  };

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
      {renderFormFields()}
      {/* Calculation is now live, so submit button might not be needed unless for explicit "calculate" action */}
      {/* <Button type="submit" className="w-full">Calculate</Button> */}
    </form>
  );
}