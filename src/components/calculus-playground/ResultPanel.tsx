
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sigma, BarChart2, AreaChart } from 'lucide-react'; 
import type { CurrentFunctionInputType } from './CalculusPlaygroundCard';


interface ResultPanelProps {
  functions: CurrentFunctionInputType[];
  integralValuesMap: Map<string, number | undefined>; 
  xValue: number;
  firstFunctionFxValue: number;
  firstFunctionFpxValue: number;
}

const formatValue = (val: number | undefined, precision: number = 3): string => {
  if (val === undefined || isNaN(val) || !isFinite(val)) return 'N/A';
  if (Math.abs(val) < 1e-9 && val !==0) return (0).toFixed(precision);
  if (val === 0) return (0).toFixed(precision);
  return val.toFixed(precision);
};

export default function ResultPanel({ functions, integralValuesMap, xValue, firstFunctionFxValue, firstFunctionFpxValue }: ResultPanelProps) {
  const firstFunction = functions[0];

  return (
    <Card className="bg-muted/20">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg">Calculated Values</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {firstFunction && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center sm:text-left border-b pb-3 mb-3">
            <div className="p-2 bg-background/50 rounded-lg shadow-sm">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-muted-foreground mb-0.5">
                <BarChart2 className="w-3.5 h-3.5 text-primary" />
                <span>f<sub>1</sub>(x) at x = {xValue.toFixed(2)}</span>
              </div>
              <span className="font-mono text-lg text-primary">{formatValue(firstFunctionFxValue, 3)}</span>
            </div>
            <div className="p-2 bg-background/50 rounded-lg shadow-sm">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-muted-foreground mb-0.5">
                <Sigma className="w-3.5 h-3.5 text-chart-2" />
                <span>f'<sub>1</sub>(x) at x = {xValue.toFixed(2)}</span>
              </div>
              <span className="font-mono text-lg text-chart-2">{formatValue(firstFunctionFpxValue, 3)}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
            <AreaChart className="w-4 h-4" /> Definite Integrals ∫f(x)dx:
          </h4>
          {functions.map((func, index) => {
            const integralValue = integralValuesMap.get(func.id);
            return (
              <div key={func.id} className="p-2 bg-background/50 rounded-lg shadow-sm flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: func.color }} />
                  <span>
                    f<sub>{index + 1}</sub>(x) from <span className="font-mono">{func.integralBounds.a || 'N/A'}</span> to <span className="font-mono">{func.integralBounds.b || 'N/A'}</span>:
                  </span>
                </div>
                <span className="font-mono text-sm" style={{color: func.color || 'hsl(var(--foreground))'}}>{formatValue(integralValue, 3)}</span>
              </div>
            );
          })}
          {functions.every(f => {
             const val = integralValuesMap.get(f.id);
             return val === undefined || isNaN(val);
           }) && functions.length > 0 && (
            <p className="text-xs text-muted-foreground italic text-center">Enter valid numeric bounds (a, b) for integrals.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
