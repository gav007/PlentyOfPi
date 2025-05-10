
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
  // Ensure step is positive and sensible, especially if min === max
  const effectiveStep = (max > min && step > 0) ? step : 0.01; 
  // Clamp value to be within min and max, primarily for initial render or if props change unexpectedly
  const clampedValue = Math.max(min, Math.min(max, value));


  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="x-slider" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {clampedValue.toFixed(2)}
        </span>
      </div>
      <Slider
        id="x-slider"
        value={[clampedValue]}
        onValueChange={(newValues) => onValueChange(newValues[0])}
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${clampedValue.toFixed(2)}`}
        disabled={min >= max} // Disable slider if domain is invalid (e.g., min is not less than max)
      />
    </div>
  );
}

    