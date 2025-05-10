
'use client';

import type * as React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp, Minus, AreaChartIcon } from 'lucide-react';


interface TogglePanelProps {
  showFullDerivativeCurve: boolean; // Changed from showDerivative
  onShowFullDerivativeCurveChange: (checked: boolean) => void; // Changed handler name
  showTangent: boolean;
  onShowTangentChange: (checked: boolean) => void;
  showArea: boolean;
  onShowAreaChange: (checked: boolean) => void;
}

export default function TogglePanel({
  showFullDerivativeCurve,
  onShowFullDerivativeCurveChange,
  showTangent,
  onShowTangentChange,
  showArea,
  onShowAreaChange,
}: TogglePanelProps) {
  return (
    <Card className="bg-muted/20">
       <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Graph Overlays
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="flex items-center justify-between sm:justify-start space-x-2 p-3 bg-background/50 rounded-lg shadow-sm">
          <Label htmlFor="show-derivative-curve-toggle" className="flex items-center gap-1.5 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-chart-2"/>
            Derivative Curve f'(x)
          </Label>
          <Switch
            id="show-derivative-curve-toggle"
            checked={showFullDerivativeCurve}
            onCheckedChange={onShowFullDerivativeCurveChange}
            aria-label="Toggle full derivative curve visibility"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-start space-x-2 p-3 bg-background/50 rounded-lg shadow-sm">
          <Label htmlFor="show-tangent-toggle" className="flex items-center gap-1.5 text-sm font-medium">
            <Minus className="w-4 h-4 text-destructive rotate-[-25deg]" />
            Tangent Line
          </Label>
          <Switch
            id="show-tangent-toggle"
            checked={showTangent}
            onCheckedChange={onShowTangentChange}
            aria-label="Toggle tangent line visibility"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-start space-x-2 p-3 bg-background/50 rounded-lg shadow-sm">
          <Label htmlFor="show-area-toggle" className="flex items-center gap-1.5 text-sm font-medium">
            <AreaChartIcon className="w-4 h-4 text-chart-3"/>
            Area ∫f(x)dx
          </Label>
          <Switch
            id="show-area-toggle"
            checked={showArea}
            onCheckedChange={onShowAreaChange}
            aria-label="Toggle area shading visibility"
          />
        </div>
      </CardContent>
    </Card>
  );
}

