
'use client';

import type * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SliderControlProps {
  value: number;
  onValueChange: (newValue: number) => void;
  min: number;
  max: number;
  step: number;
}

export default function SliderControl({ value, onValueChange, min, max, step }: SliderControlProps) {
  const effectiveStep = (max - min) > 0 ? step : 0.01; // Prevent step=0 if min=max

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="x-slider" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {value.toFixed(2)}
        </span>
      </div>
      <Slider
        id="x-slider"
        value={[value]}
        onValueChange={(newValues) => onValueChange(newValues[0])}
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${value.toFixed(2)}`}
        disabled={min >= max} // Disable slider if domain is invalid
      />
    </div>
  );
}
