
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SearchVisualizer() {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle>Searching Visualizer Area</CardTitle>
        <CardDescription>Interactive visualization of searching algorithms (Linear, Binary) will appear here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px] bg-muted rounded-md flex items-center justify-center p-8">
          <p className="text-muted-foreground">Searching visualization placeholder.</p>
        </div>
      </CardContent>
    </Card>
  );
}
