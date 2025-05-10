
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sigma, BarChart2, AreaChart } from 'lucide-react'; // Replaced FunctionSquare with more fitting icons

interface ResultPanelProps {
  xValue: number;
  fxValue: number;
  fpxValue: number;
  integralValue: number;
}

const formatValue = (val: number, precision: number = 3): string => {
  if (isNaN(val) || !isFinite(val)) return 'Undefined';
  // Handle very small numbers that should be zero
  if (Math.abs(val) < 1e-9) return (0).toFixed(precision);
  return val.toFixed(precision);
};

export default function ResultPanel({ xValue, fxValue, fpxValue, integralValue }: ResultPanelProps) {
  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg">Calculated Values at x = {formatValue(xValue,2)}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
        <div className="p-3 bg-background/50 rounded-lg shadow-sm">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-muted-foreground mb-1">
            <BarChart2 className="w-4 h-4 text-primary" />
            <span>f(x)</span>
          </div>
          <span className="font-mono text-xl text-primary">{formatValue(fxValue)}</span>
        </div>
        <div className="p-3 bg-background/50 rounded-lg shadow-sm">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-muted-foreground mb-1">
            <Sigma className="w-4 h-4 text-chart-2" />
            <span>f'(x) (Derivative)</span>
          </div>
          <span className="font-mono text-xl text-chart-2">{formatValue(fpxValue)}</span>
        </div>
        <div className="p-3 bg-background/50 rounded-lg shadow-sm">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-muted-foreground mb-1">
            <AreaChart className="w-4 h-4 text-chart-3" />
            <span>∫f(x)dx (from 0 to x)</span>
          </div>
          <span className="font-mono text-xl text-chart-3">{formatValue(integralValue)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
