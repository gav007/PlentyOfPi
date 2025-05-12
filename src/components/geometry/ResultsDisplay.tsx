'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsDisplayProps {
  shapeType: 'triangle' | 'circle' | 'square' | 'trapezium';
  results?: Record<string, string | number>;
}

export default function ResultsDisplay({ shapeType, results }: ResultsDisplayProps) {
  let placeholderResults: Record<string, string | number> = {};

  switch (shapeType) {
    case 'triangle':
      placeholderResults = {
        'Side a (BC)': 'N/A',
        'Side b (AC)': 'N/A',
        'Side c (AB)': 'N/A',
        'Angle A': 'N/A',
        'Angle B': 'N/A',
        'Angle C': 'N/A',
        'Area': 'N/A',
        'Perimeter': 'N/A',
        'Type': 'N/A',
      };
      break;
    case 'circle':
      placeholderResults = {
        'Radius': 'N/A', // Assuming radius is the primary input
        'Diameter': 'N/A',
        'Circumference': 'N/A',
        'Area': 'N/A',
      };
      break;
    case 'square':
      placeholderResults = {
        'Side Length': 'N/A', // Assuming side length is primary input
        'Area': 'N/A',
        'Perimeter': 'N/A',
        'Diagonal': 'N/A',
      };
      break;
    case 'trapezium':
      placeholderResults = {
        'Base 1': 'N/A',
        'Base 2': 'N/A',
        'Height': 'N/A',
        'Area': 'N/A',
        'Perimeter': 'N/A', // Perimeter for a general trapezium needs side lengths
      };
      break;
    default:
      placeholderResults = { Result: 'N/A' };
  }

  const displayData = results || placeholderResults;
  const shapeTitle = shapeType.charAt(0).toUpperCase() + shapeType.slice(1);

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle>Calculated Properties for {shapeTitle}</CardTitle>
        <CardDescription>
          {Object.keys(displayData).every(key => displayData[key] === 'N/A' || displayData[key] === 0 || displayData[key] === '0.00' || displayData[key] === 'NaN°')
            ? 'Enter valid inputs or adjust the shape to see results.'
            : 'Results based on the current inputs or shape configuration.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(displayData).length > 0 ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
            {Object.entries(displayData).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-dashed border-border/70 pb-1.5">
                <dt className="font-medium text-muted-foreground">{key}:</dt>
                <dd className="text-foreground font-semibold text-right">
                  {String(value) === 'NaN°' || String(value) === 'NaN' || String(value).includes("Infinity") ? "Invalid" : String(value)}
                  </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted-foreground">No results to display.</p>
        )}
      </CardContent>
    </Card>
  );
}