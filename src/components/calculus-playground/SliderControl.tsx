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
  const effectiveStep = (max > min && step > 1e-9) ? step : 0.01; 
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="x-slider" className="text-base font-semibold">
          Adjust x-value (or click on graph):
        </Label>
        <span className="font-mono text-primary text-lg bg-muted/50 px-2 py-0.5 rounded-md">
          {value.toFixed(3)} {/* Display the value prop directly */}
        </span>
      </div>
      <Slider
        id="x-slider"
        value={[value]} // Use the value prop directly
        onValueChange={(newValues) => {
            // Only call parent's onValueChange if the value has meaningfully changed
            if (Math.abs(value - newValues[0]) > 1e-9) { // Tolerance for float comparison
                onValueChange(newValues[0]);
            }
        }}
        min={min}
        max={max}
        step={effectiveStep}
        aria-label={`x-value slider, current value ${value.toFixed(3)}`}
        disabled={min >= max || isNaN(min) || isNaN(max)}
      />
    </div>
  );
}
