
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GraphSearchVisualizer() {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle>Graph Traversal Visualizer Area</CardTitle>
        <CardDescription>Interactive visualization of BFS, DFS, Dijkstra's, etc., will appear here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px] bg-muted rounded-md flex items-center justify-center p-8">
          <p className="text-muted-foreground">Graph traversal visualization placeholder.</p>
        </div>
      </CardContent>
    </Card>
  );
}
