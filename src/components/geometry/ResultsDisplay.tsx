
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsDisplayProps {
  shapeType: 'triangle' | 'circle' | 'square' | 'trapezium';
  // Props for results: area, perimeter, angles, etc.
  results?: Record<string, string | number>;
}

export default function ResultsDisplay({ shapeType, results }: ResultsDisplayProps) {
  // Placeholder results - these would be calculated and passed as props
  const placeholderResults: Record<string, string | number> = {
    Area: 'N/A',
    Perimeter: 'N/A',
  };

  if (shapeType === 'triangle') {
    placeholderResults['Angle A'] = 'N/A';
    placeholderResults['Angle B'] = 'N/A';
    placeholderResults['Angle C'] = 'N/A';
    placeholderResults['Type'] = 'N/A';
  } else if (shapeType === 'circle') {
    placeholderResults['Diameter'] = 'N/A';
    placeholderResults['Circumference'] = 'N/A';
  } else if (shapeType === 'square') {
    placeholderResults['Diagonal'] = 'N/A';
  } else if (shapeType === 'trapezium') {
    // Specific trapezium results if any
  }


  const displayData = results || placeholderResults;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Calculated Properties for {shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}</CardTitle>
        <CardDescription>Results based on the current inputs or shape configuration.</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.entries(displayData).length > 0 ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {Object.entries(displayData).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-dashed pb-1">
                <dt className="font-medium text-muted-foreground">{key}:</dt>
                <dd className="text-foreground font-semibold">{String(value)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted-foreground">Enter values or adjust the shape to see results.</p>
        )}
      </CardContent>
    </Card>
  );
}
