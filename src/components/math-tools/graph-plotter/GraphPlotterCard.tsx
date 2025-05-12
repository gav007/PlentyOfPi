
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from 'lucide-react';

export default function GraphPlotterCard() {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <AreaChart className="w-8 h-8" />
          Graph Plotter
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          This interactive tool for plotting mathematical functions is currently under construction.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="p-8 bg-muted/30 rounded-lg">
          <p className="text-xl font-semibold text-foreground">Coming Soon!</p>
          <p className="text-muted-foreground mt-2">
            We're working hard to bring you an advanced graphing calculator. 
            You'll be able to plot multiple expressions, customize graph appearance, 
            find intersections, and much more. Stay tuned!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
