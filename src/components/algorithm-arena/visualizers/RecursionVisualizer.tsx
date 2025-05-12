
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecursionVisualizer() {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle>Recursion Visualizer Area</CardTitle>
        <CardDescription>Interactive visualization of Factorial, Fibonacci, Tower of Hanoi, etc., will appear here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px] bg-muted rounded-md flex items-center justify-center p-8">
          <p className="text-muted-foreground">Recursion visualization placeholder.</p>
        </div>
      </CardContent>
    </Card>
  );
}
