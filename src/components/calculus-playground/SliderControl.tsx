
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
  // A very small step is preferred for smooth dragging if (max - min) is large.
  // For PLOT_POINTS = 200, this makes 200 steps across the domain.
  const effectiveStep = (max > min && step > 1e-9) ? step : 0.01; 
  
  const clampedValue = Math.max(min, Math.min(max, value));


  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="x-slider" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {clampedValue.toFixed(3)} {/* Increased precision for display */}
        </span>
      </div>
      <Slider
        id="x-slider"
        value={[clampedValue]}
        onValueChange={(newValues) => onValueChange(newValues[0])}
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${clampedValue.toFixed(3)}`}
        disabled={min >= max || isNaN(min) || isNaN(max)} // Disable slider if domain is invalid
      />
    </div>
  );
}
